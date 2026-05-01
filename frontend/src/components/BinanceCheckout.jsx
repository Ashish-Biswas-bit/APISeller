import React, { useState, useEffect } from 'react'
import { 
  Wallet, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Shield,
  Copy,
  Check
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createBinanceOrder, pollOrderStatus } from '../lib/binance'
import { formatPrice } from '../utils/helpers'

const BinanceCheckout = ({ product, onSuccess, onCancel }) => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState('idle') // idle, creating, pending, completed, failed
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleCreateOrder = async () => {
    if (!user) {
      setError('Please login to purchase')
      return
    }

    setLoading(true)
    setStatus('creating')
    setError(null)

    try {
      const result = await createBinanceOrder(product.id, user.id, user.email)
      
      if (result.success) {
        setOrder(result)
        setStatus('pending')
        
        // Start polling for status
        pollOrderStatus(result.orderId, (statusUpdate) => {
          if (statusUpdate.status === 'completed') {
            setStatus('completed')
            onSuccess?.(statusUpdate)
          } else if (statusUpdate.error) {
            setStatus('failed')
            setError(statusUpdate.error)
          }
        })
        
        // Open Binance checkout in new window
        if (result.checkoutUrl) {
          window.open(result.checkoutUrl, '_blank')
        }
      }
    } catch (err) {
      setError(err.message)
      setStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order?.orderId || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStatus = () => {
    switch (status) {
      case 'creating':
        return (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Creating Binance order...</p>
          </div>
        )
      
      case 'pending':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Payment in Progress</p>
                  <p className="text-sm text-gray-400 mt-1">
                    A Binance Pay window has opened. Complete your payment there.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-400">Order ID</span>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-white">{order?.orderId?.slice(0, 8)}...</code>
                  <button 
                    onClick={copyOrderId}
                    className="p-1 text-gray-400 hover:text-white transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-medium">{formatPrice(product.price)} USDT</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                <span className="text-gray-400">Network</span>
                <span className="text-white">Binance Pay / BSC</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              Waiting for payment confirmation...
            </div>
          </div>
        )
      
      case 'completed':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Payment Successful!</p>
              <p className="text-gray-400 mt-2">
                Your API key has been generated and is available in your dashboard.
              </p>
            </div>
            <button 
              onClick={() => window.location.href = '/dashboard/apis'}
              className="btn-primary px-6 py-3 rounded-xl inline-flex items-center gap-2"
            >
              View My APIs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )
      
      case 'failed':
        return (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-white">Payment Failed</p>
              <p className="text-gray-400 mt-2">{error || 'Something went wrong. Please try again.'}</p>
            </div>
            <button 
              onClick={() => setStatus('idle')}
              className="btn-secondary px-6 py-3 rounded-xl"
            >
              Try Again
            </button>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            {/* Product Summary */}
            <div className="p-4 bg-dark-700/50 rounded-xl border border-dark-400/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-xl flex items-center justify-center text-2xl">
                  {product.icon || '🎰'}
                </div>
                <div>
                  <h3 className="font-semibold text-white">{product.name}</h3>
                  <p className="text-sm text-gray-400">{product.category}</p>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-gray-400">
                <span>API Price</span>
                <span>{formatPrice(product.price)} USDT</span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <span>Network Fee</span>
                <span className="text-accent-green">Included</span>
              </div>
              <div className="border-t border-dark-400/30 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-white">Total</span>
                  <span className="text-xl font-bold text-white">{formatPrice(product.price)} USDT</span>
                </div>
              </div>
            </div>

            {/* Payment Method Info */}
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl border border-yellow-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Binance Pay</p>
                  <p className="text-sm text-gray-400">Secure crypto payment</p>
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Payments are processed securely via Binance Pay. 
                You'll be redirected to Binance to complete the payment.
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={onCancel}
                className="btn-secondary flex-1 py-3 rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateOrder}
                disabled={loading}
                className="btn-primary flex-1 py-3 rounded-xl inline-flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Pay with Binance
                    <ExternalLink className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {status === 'completed' ? 'Success' : 'Checkout'}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Binance Pay
          </div>
        </div>
        
        {renderStatus()}
      </div>
    </div>
  )
}

export default BinanceCheckout
