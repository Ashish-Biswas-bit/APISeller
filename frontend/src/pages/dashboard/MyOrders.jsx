import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  ShoppingCart, 
  Download, 
  AlertCircle,
  Check,
  Clock,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUserOrders } from '../../lib/supabase'
import { formatDate, formatPrice, getStatusColor } from '../../utils/helpers'

const MyOrders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return
      const { data, error } = await getUserOrders(user.id)
      if (!error && data) {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [user])

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Orders</h1>
          <p className="text-gray-400">View and manage your API subscriptions</p>
        </div>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Browse APIs
        </Link>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Orders Yet</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            You haven't made any purchases yet. Explore our APIs and find the perfect solution for your needs.
          </p>
          <Link to="/products" className="btn-primary">
            Explore APIs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="glass-card overflow-hidden">
              {/* Order Header */}
              <div 
                className="p-6 flex items-center justify-between cursor-pointer hover:bg-dark-700/30 transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{order.product?.name || 'API Subscription'}</h3>
                    <p className="text-sm text-gray-400">Order #{order.id?.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatPrice(order.amount || 29)}</p>
                    <p className="text-sm text-gray-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                    </span>
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="px-6 pb-6 border-t border-dark-400/30">
                  <div className="grid md:grid-cols-2 gap-6 pt-6">
                    {/* Order Details */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-4">Order Details</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Plan</span>
                          <span className="text-white">{order.plan_name || 'Pro Plan'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Billing Cycle</span>
                          <span className="text-white">Monthly</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Payment Method</span>
                          <span className="text-white">•••• {order.card_last4 || '4242'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Next Billing</span>
                          <span className="text-white">{formatDate(order.next_billing_date || new Date())}</span>
                        </div>
                      </div>
                    </div>

                    {/* API Access */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-4">API Access</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">API Key</span>
                          <span className="text-white font-mono">live_••••{order.api_key?.slice(-4) || 'abcd'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Rate Limit</span>
                          <span className="text-white">{order.rate_limit || '1,000'}/min</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Monthly Requests</span>
                          <span className="text-white">{order.monthly_requests || '50,000'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-dark-400/30">
                    <button className="btn-secondary text-sm">
                      <Download className="w-4 h-4" />
                      Download Invoice
                    </button>
                    <Link to="/dashboard/apis" className="btn-secondary text-sm">
                      Manage API Key
                    </Link>
                    {order.status === 'active' && (
                      <button className="btn-secondary text-sm text-red-400 hover:text-red-300 ml-auto">
                        Cancel Subscription
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Billing Info */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Billing Information</h4>
            <p className="text-sm text-gray-400">
              All subscriptions are billed automatically on a monthly basis. 
              You can cancel anytime from your order details. 
              Questions? Contact our support team at support@apistore.com
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyOrders
