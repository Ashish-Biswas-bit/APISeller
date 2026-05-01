import express from 'express'
import crypto from 'crypto'
import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { generateApiKey } from '../utils/helpers.js'

const router = express.Router()

// Lazy-load clients
let supabase
const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

// Generate Binance Pay signature
const generateSignature = (payload, secretKey) => {
  const timestamp = Date.now()
  const nonce = crypto.randomUUID().replace(/-/g, '')
  
  // Binance Pay signature format
  const toSign = `${timestamp}\n${nonce}\n${JSON.stringify(payload)}\n`
  const signature = crypto
    .createHmac('sha512', secretKey)
    .update(toSign)
    .digest('hex')
    .toUpperCase()
  
  return { timestamp, nonce, signature }
}

// Create Binance Pay order
router.post('/create-order', async (req, res) => {
  const { product_id, user_id, user_email } = req.body
  
  try {
    // Get product details
    const { data: product } = await getSupabase()
      .from('products')
      .select('id, name, price, description, original_price, original_provider_name')
      .eq('id', product_id)
      .single()
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' })
    }
    
    // Create order in our database first
    const { data: order } = await getSupabase()
      .from('orders')
      .insert([{
        user_id,
        product_id,
        amount: product.price / 100, // Convert cents to dollars
        original_amount: product.original_price ? product.original_price / 100 : 0,
        currency: 'USDT', // Binance Pay primarily uses USDT
        status: 'pending',
        provider_paid: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()
    
    // Prepare Binance Pay payload
    const payload = {
      merchantId: process.env.BINANCE_MERCHANT_ID,
      merchantTradeNo: order.id, // Use our order ID as merchant trade number
      tradeType: 'WEB',
      totalFee: product.price / 100, // Amount in USDT
      currency: 'USDT',
      productType: 'API_ACCESS',
      productName: product.name,
      productDetail: product.description || 'API Access',
      returnUrl: `${process.env.FRONTEND_URL}/dashboard/orders`,
      cancelUrl: `${process.env.FRONTEND_URL}/products`,
      webhookUrl: `${process.env.FRONTEND_URL}/api/binance/webhook`
    }
    
    // Generate signature
    const { timestamp, nonce, signature } = generateSignature(payload, process.env.BINANCE_SECRET_KEY)
    
    // Make request to Binance Pay API
    const response = await axios.post(
      `${process.env.BINANCE_PAY_API_URL}/order/create`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': process.env.BINANCE_API_KEY,
          'BinancePay-Signature': signature
        }
      }
    )
    
    // Update order with Binance trade info
    if (response.data?.data?.prepayId) {
      await getSupabase()
        .from('orders')
        .update({
          binance_prepay_id: response.data.data.prepayId,
          binance_merchant_trade_no: payload.merchantTradeNo
        })
        .eq('id', order.id)
    }
    
    res.json({
      success: true,
      orderId: order.id,
      binanceData: response.data?.data,
      checkoutUrl: response.data?.data?.checkoutUrl || response.data?.data?.universalUrl
    })
    
  } catch (error) {
    console.error('Binance order creation error:', error.response?.data || error.message)
    res.status(500).json({ 
      error: 'Failed to create Binance order',
      details: error.response?.data?.msg || error.message 
    })
  }
})

// Binance Pay webhook handler
router.post('/webhook', async (req, res) => {
  try {
    // Verify webhook signature
    const signature = req.headers['binancepay-signature']
    const timestamp = req.headers['binancepay-timestamp']
    const nonce = req.headers['binancepay-nonce']
    
    if (!signature || !timestamp || !nonce) {
      return res.status(400).json({ error: 'Missing headers' })
    }
    
    // Verify signature
    const payload = JSON.stringify(req.body)
    const toSign = `${timestamp}\n${nonce}\n${payload}\n`
    const expectedSignature = crypto
      .createHmac('sha512', process.env.BINANCE_PAY_WEBHOOK_SECRET)
      .update(toSign)
      .digest('hex')
      .toUpperCase()
    
    if (signature !== expectedSignature) {
      return res.status(401).json({ error: 'Invalid signature' })
    }
    
    const { bizType, data } = req.body
    
    // Handle payment success
    if (bizType === 'PAY' && data?.status === 'PAID') {
      const { merchantTradeNo, transactionId, paidAmount } = data
      
      // Find our order
      const { data: order } = await getSupabase()
        .from('orders')
        .select('*, product:products(*)')
        .eq('id', merchantTradeNo)
        .single()
      
      if (!order || order.status === 'completed') {
        return res.json({ success: true, message: 'Order already processed or not found' })
      }
      
      // Update order status
      await getSupabase()
        .from('orders')
        .update({
          status: 'completed',
          binance_transaction_id: transactionId,
          paid_amount: paidAmount,
          completed_at: new Date().toISOString()
        })
        .eq('id', merchantTradeNo)
      
      // Calculate and record profit
      const ourAmount = order.amount
      const originalAmount = order.original_amount || 0
      const profit = ourAmount - originalAmount
      
      if (profit > 0) {
        await getSupabase()
          .from('profit_transactions')
          .insert([{
            order_id: order.id,
            product_id: order.product_id,
            user_id: order.user_id,
            our_price: ourAmount * 100,
            original_price: originalAmount * 100,
            profit: profit * 100,
            provider_name: order.product?.original_provider_name || 'Unknown',
            transaction_date: new Date().toISOString(),
            paid_to_provider: false
          }])
      }
      
      // Generate API key for user
      const apiKey = generateApiKey()
      
      await getSupabase()
        .from('api_keys')
        .insert([{
          user_id: order.user_id,
          product_id: order.product_id,
          order_id: order.id,
          key: apiKey,
          status: 'active',
          rate_limit: order.product?.rate_limit || 1000,
          requests_included: order.product?.requests_included || 1000,
          monthly_requests: 0,
          created_at: new Date().toISOString()
        }])
      
      // Update product sales count
      await getSupabase().rpc('increment_product_sales', { product_id: order.product_id })
      
      console.log(`Binance payment completed: Order ${merchantTradeNo}, Profit: $${profit.toFixed(2)}`)
    }
    
    // Handle refund (if needed)
    if (bizType === 'REFUND' && data?.status === 'REFUNDED') {
      const { merchantTradeNo } = data
      
      await getSupabase()
        .from('orders')
        .update({ status: 'refunded', refunded_at: new Date().toISOString() })
        .eq('id', merchantTradeNo)
      
      // Deactivate API key
      await getSupabase()
        .from('api_keys')
        .update({ status: 'inactive' })
        .eq('order_id', merchantTradeNo)
      
      console.log(`Order ${merchantTradeNo} refunded`)
    }
    
    res.json({ success: true })
    
  } catch (error) {
    console.error('Binance webhook error:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

// Query order status (for frontend polling)
router.get('/order-status/:orderId', async (req, res) => {
  const { orderId } = req.params
  
  try {
    const { data: order } = await getSupabase()
      .from('orders')
      .select('status, binance_transaction_id, completed_at, api_keys(key)')
      .eq('id', orderId)
      .single()
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    
    res.json({
      status: order.status,
      transactionId: order.binance_transaction_id,
      completedAt: order.completed_at,
      apiKey: order.api_keys?.[0]?.key || null
    })
    
  } catch (error) {
    console.error('Order status check error:', error)
    res.status(500).json({ error: 'Failed to check order status' })
  }
})

// Get Binance merchant info (for frontend)
router.get('/merchant-info', (req, res) => {
  res.json({
    merchantId: process.env.BINANCE_MERCHANT_ID,
    currency: 'USDT',
    supportedNetworks: ['BSC', 'ETH', 'TRON']
  })
})

export default router
