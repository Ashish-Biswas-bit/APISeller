import express from 'express'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { generateApiKey } from '../utils/helpers.js'

const router = express.Router()

// Lazy-load clients to ensure env vars are loaded
let stripe
let supabase

const getStripe = () => {
  if (!stripe) stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  return stripe
}

const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

// Stripe webhook for payment events
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = getStripe().webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object)
      break
    
    case 'invoice.payment_succeeded':
      await handleSubscriptionPayment(event.data.object)
      break
    
    case 'customer.subscription.deleted':
      await handleSubscriptionCancelled(event.data.object)
      break
    
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  res.json({ received: true })
})

async function handlePaymentSuccess(paymentIntent) {
  const { user_id, product_id } = paymentIntent.metadata

  try {
    // Fetch product to get original_price for profit calculation
    const { data: product } = await getSupabase()
      .from('products')
      .select('original_price, original_provider_name, rate_limit, requests_included')
      .eq('id', product_id)
      .single()

    const ourAmount = paymentIntent.amount / 100 // cents to dollars
    const originalAmount = product?.original_price ? product.original_price / 100 : 0
    const profit = ourAmount - originalAmount

    // Create order record with profit tracking
    const { data: order } = await getSupabase()
      .from('orders')
      .insert([{
        user_id,
        product_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: ourAmount,
        original_amount: originalAmount,
        currency: paymentIntent.currency,
        status: 'completed',
        provider_paid: false, // Track if we paid the original provider
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    // Record profit transaction for reporting
    if (profit > 0) {
      await getSupabase()
        .from('profit_transactions')
        .insert([{
          order_id: order.id,
          product_id,
          user_id,
          our_price: ourAmount * 100, // store in cents
          original_price: originalAmount * 100,
          profit: profit * 100,
          provider_name: product?.original_provider_name || 'Unknown',
          transaction_date: new Date().toISOString(),
          paid_to_provider: false
        }])
    }

    // Generate API key for the user
    const apiKey = generateApiKey()
    
    await getSupabase()
      .from('api_keys')
      .insert([{
        user_id,
        product_id,
        order_id: order.id,
        key: apiKey,
        status: 'active',
        rate_limit: product?.rate_limit || 1000,
        requests_included: product?.requests_included || 1000,
        monthly_requests: 0,
        created_at: new Date().toISOString()
      }])

    // Update product sales count
    await getSupabase().rpc('increment_product_sales', { product_id })

    console.log(`Payment succeeded: Order ${order.id}, Profit: $${profit.toFixed(2)}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handleSubscriptionPayment(invoice) {
  const subscriptionId = invoice.subscription
  
  try {
    // Update subscription status
    await getSupabase()
      .from('subscriptions')
      .update({
        status: 'active',
        current_period_end: new Date(invoice.lines.data[0].period.end * 1000).toISOString()
      })
      .eq('stripe_subscription_id', subscriptionId)

    console.log(`Subscription payment succeeded: ${subscriptionId}`)
  } catch (error) {
    console.error('Error handling subscription payment:', error)
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    // Deactivate API keys associated with this subscription
    const { data: subscriptionData } = await getSupabase()
      .from('subscriptions')
      .select('user_id, product_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subscriptionData) {
      await getSupabase()
        .from('api_keys')
        .update({ status: 'inactive' })
        .eq('user_id', subscriptionData.user_id)
        .eq('product_id', subscriptionData.product_id)

      await getSupabase()
        .from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', subscription.id)
    }

    console.log(`Subscription cancelled: ${subscription.id}`)
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

export default router
