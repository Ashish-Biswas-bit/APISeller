import React, { useEffect, useState } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Package,
  ExternalLink,
  AlertCircle,
  Check,
  Clock,
  Calendar,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  Wallet
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { formatPrice, formatDate } from '../../utils/helpers'

const AdminProfits = () => {
  const [profitData, setProfitData] = useState({
    summary: [],
    transactions: [],
    stats: {
      totalRevenue: 0,
      totalProviderCost: 0,
      totalProfit: 0,
      pendingPayments: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const [expandedProvider, setExpandedProvider] = useState(null)

  useEffect(() => {
    fetchProfitData()
  }, [dateRange])

  const fetchProfitData = async () => {
    try {
      // Fetch profit summary by product
      const { data: summaryData } = await supabase
        .from('profit_summary')
        .select('*')

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('profit_transactions')
        .select('*, product:products(name), user:profiles(email, full_name)')
        .order('transaction_date', { ascending: false })
        .limit(50)

      // Calculate stats with safe defaults
      const stats = (summaryData || []).reduce((acc, item) => ({
        totalRevenue: acc.totalRevenue + (item.total_revenue || 0),
        totalProviderCost: acc.totalProviderCost + (item.total_provider_cost || 0),
        totalProfit: acc.totalProfit + (item.total_profit || 0),
        pendingPayments: acc.pendingPayments + (item.total_provider_cost || 0)
      }), {
        totalRevenue: 0,
        totalProviderCost: 0,
        totalProfit: 0,
        pendingPayments: 0
      })

      setProfitData({
        summary: summaryData || [],
        transactions: transactionsData || [],
        stats: stats || {
          totalRevenue: 0,
          totalProviderCost: 0,
          totalProfit: 0,
          pendingPayments: 0
        }
      })
    } catch (error) {
      console.error('Error fetching profit data:', error)
    } finally {
      setLoading(false)
    }
  }

  const markProviderPaid = async (transactionId) => {
    try {
      await supabase
        .from('profit_transactions')
        .update({ 
          paid_to_provider: true, 
          paid_date: new Date().toISOString() 
        })
        .eq('id', transactionId)
      
      // Refresh data
      fetchProfitData()
    } catch (error) {
      console.error('Error marking payment:', error)
    }
  }

  const exportToCSV = () => {
    const csv = [
      ['Product', 'Provider', 'Our Price', 'Original Price', 'Profit', 'Sales', 'Total Profit'].join(','),
      ...profitData.summary.map(item => [
        item.product_name,
        item.original_provider_name,
        formatPrice(item.our_price),
        formatPrice(item.original_price),
        formatPrice(item.profit_margin),
        item.total_sales,
        formatPrice(item.total_profit)
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profit-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reseller Profit Dashboard</h1>
          <p className="text-gray-400">Track your API resale profits and provider payments</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-dark-700 border border-dark-400/50 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500/50"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button 
            onClick={exportToCSV}
            className="btn-secondary px-4 py-2 rounded-xl inline-flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-green to-emerald-500 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">+24%</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(profitData.stats.totalRevenue * 100)}</h3>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-full">Profit</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(profitData.stats.totalProfit * 100)}</h3>
          <p className="text-sm text-gray-400">Net Profit</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">Cost</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(profitData.stats.totalProviderCost * 100)}</h3>
          <p className="text-sm text-gray-400">Provider Costs</p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full">Pending</span>
          </div>
          <h3 className="text-3xl font-bold text-white">{formatPrice(profitData.stats.pendingPayments * 100)}</h3>
          <p className="text-sm text-gray-400">Unpaid to Providers</p>
        </div>
      </div>

      {/* Profit Margin by Product */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-white">Profit by Product</h3>
          </div>
          <span className="text-sm text-gray-400">{profitData.summary.length} APIs</span>
        </div>
        
        <div className="divide-y divide-dark-400/30">
          {profitData.summary.map((item) => (
            <div key={item.product_id} className="p-4 hover:bg-dark-700/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{item.product_name}</p>
                    <p className="text-sm text-gray-400">{item.original_provider_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatPrice(item.total_profit * 100)}</p>
                  <p className="text-xs text-gray-400">{item.total_sales} sales</p>
                </div>
              </div>
              
              {/* Margin Bar */}
              <div className="mt-3 flex items-center gap-4">
                <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-accent-green to-primary-500 rounded-full"
                    style={{ width: `${Math.min((item.profit_margin / item.our_price) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {Math.round((item.profit_margin / item.our_price) * 100)}% margin
                </span>
              </div>
              
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                <span>We charge: {formatPrice(item.our_price)}</span>
                <span>•</span>
                <span>Provider gets: {formatPrice(item.original_price)}</span>
                <span>•</span>
                <span className="text-accent-green">We keep: {formatPrice(item.profit_margin)}</span>
              </div>
            </div>
          ))}
          
          {profitData.summary.length === 0 && (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No profit data yet. Sales will appear here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-accent-green" />
            <h3 className="text-lg font-semibold text-white">Recent Profit Transactions</h3>
          </div>
        </div>
        
        <div className="divide-y divide-dark-400/30">
          {profitData.transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.paid_to_provider 
                    ? 'bg-accent-green/20' 
                    : 'bg-amber-500/20'
                }`}>
                  {transaction.paid_to_provider ? (
                    <Check className="w-5 h-5 text-accent-green" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-white">{transaction.product?.name}</p>
                  <p className="text-sm text-gray-400">
                    {transaction.user?.full_name || transaction.user?.email} • {formatDate(transaction.transaction_date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="font-semibold text-white">{formatPrice(transaction.profit)}</p>
                  <p className="text-xs text-gray-400">
                    Sale: {formatPrice(transaction.our_price)} - Cost: {formatPrice(transaction.original_price)}
                  </p>
                </div>
                
                {!transaction.paid_to_provider && (
                  <button
                    onClick={() => markProviderPaid(transaction.id)}
                    className="btn-secondary text-xs px-3 py-1.5 rounded-lg"
                  >
                    Mark Paid
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {profitData.transactions.length === 0 && (
            <div className="p-12 text-center">
              <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Provider Payment Status */}
      <div className="glass-card p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Provider Payment Workflow</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-accent-green" />
                Customer pays your marked-up price on your website
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                System tracks profit: Your Price - Original Price = Your Profit
              </li>
              <li className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-primary-400" />
                You pay the original provider their price (shown as "Mark Paid")
              </li>
              <li className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-accent-green" />
                Difference stays as your profit
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminProfits
