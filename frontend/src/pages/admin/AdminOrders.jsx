import React, { useEffect, useState } from 'react'
import { 
  Search, 
  Filter,
  Download,
  Check,
  X,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { getAllOrders } from '../../lib/supabase'
import { formatPrice, formatDate, getStatusColor } from '../../utils/helpers'

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await getAllOrders()
      if (!error && data) {
        setOrders(data)
      }
      setLoading(false)
    }
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
      case 'cancelled':
        return <X className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Update order status logic here
    console.log('Updating order', orderId, 'to', newStatus)
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
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-gray-400">Manage customer orders and subscriptions</p>
        </div>
        <button className="btn-secondary inline-flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-700 border border-dark-400 rounded-xl text-white 
                     placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-dark-700 border border-dark-400 rounded-xl text-white focus:outline-none focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400/30">
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-gray-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-400/30">
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className="hover:bg-dark-700/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <td className="py-4 px-6">
                      <span className="text-sm font-mono text-white">#{order.id?.slice(0, 8)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white text-sm">{order.user?.email || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">User ID: {order.user_id?.slice(0, 8)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white text-sm">{order.product?.name || 'API Subscription'}</p>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">{formatPrice(order.amount || 0)}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-400 text-sm">{formatDate(order.created_at)}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                  </tr>
                  
                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <tr>
                      <td colSpan={7} className="px-6 pb-6">
                        <div className="bg-dark-700 rounded-xl p-6 space-y-4">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                              <p className="text-white text-sm">•••• {order.card_last4 || '4242'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Billing Cycle</p>
                              <p className="text-white text-sm">{order.billing_cycle || 'Monthly'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Next Billing</p>
                              <p className="text-white text-sm">{formatDate(order.next_billing_date)}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 pt-4 border-t border-dark-600">
                            <span className="text-sm text-gray-400">Update Status:</span>
                            {['completed', 'pending', 'failed', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleStatusUpdate(order.id, status)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                  order.status === status
                                    ? 'bg-primary-500 text-white'
                                    : 'bg-dark-600 text-gray-400 hover:text-white'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-dark-700 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-dark-700 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminOrders
