import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Key, 
  ShoppingCart, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  Sparkles,
  Zap,
  Coins,
  Trophy,
  Dices,
  Wallet,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  BarChart3,
  Globe,
  Shield
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUserApiKeys, getUserOrders, supabase } from '../../lib/supabase'
import { formatDate, formatPrice } from '../../utils/helpers'

const Dashboard = () => {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    activeApis: 0,
    totalOrders: 0,
    monthlyUsage: 0,
    totalRequests: 0,
    recentOrders: [],
    apiKeys: [],
    activity: []
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      const [apiKeysResult, ordersResult] = await Promise.all([
        getUserApiKeys(user.id),
        getUserOrders(user.id),
      ])

      const apiKeys = apiKeysResult.data || []
      const orders = ordersResult.data || []

      // Calculate total requests from API keys
      const totalRequests = apiKeys.reduce((sum, key) => sum + (key.monthly_requests || 0), 0)

      // Generate recent activity
      const activity = generateActivityFeed(apiKeys, orders)

      setStats({
        activeApis: apiKeys.filter(key => key.status === 'active').length,
        totalOrders: orders.length,
        monthlyUsage: totalRequests,
        totalRequests,
        recentOrders: orders.slice(0, 5),
        apiKeys: apiKeys.slice(0, 3),
        activity
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchDashboardData()
  }

  const generateActivityFeed = (apiKeys, orders) => {
    const activities = []
    
    // Add API key activities
    apiKeys.forEach(key => {
      if (key.last_used) {
        activities.push({
          id: `api-${key.id}`,
          type: 'api_usage',
          message: `API key used for ${key.product?.name || 'Unknown API'}`,
          time: key.last_used,
          icon: Zap,
          color: 'from-primary-500 to-primary-600'
        })
      }
    })

    // Add order activities
    orders.forEach(order => {
      activities.push({
        id: `order-${order.id}`,
        type: 'order',
        message: `Purchased ${order.product?.name || 'API Subscription'}`,
        time: order.created_at,
        icon: ShoppingCart,
        color: 'from-accent-green to-emerald-500',
        meta: formatPrice(order.amount)
      })
    })

    // Sort by time and take top 5
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)
  }

  const statCards = [
    {
      title: 'Active Casino APIs',
      value: stats.activeApis,
      icon: Dices,
      color: 'from-red-500 to-pink-600',
      trend: '+2 this month',
      trendUp: true,
      description: 'Live casino & slots APIs'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-accent-cyan to-blue-500',
      trend: 'All time purchases',
      trendUp: null,
      description: 'API subscriptions'
    },
    {
      title: 'Monthly API Calls',
      value: stats.monthlyUsage.toLocaleString(),
      icon: Activity,
      color: 'from-accent-green to-emerald-500',
      trend: '+12% vs last month',
      trendUp: true,
      description: 'Across all endpoints'
    },
    {
      title: 'Account Status',
      value: 'Active',
      icon: Shield,
      color: 'from-amber-500 to-orange-600',
      trend: 'Premium Member',
      trendUp: true,
      description: profile?.role === 'admin' ? 'Administrator' : 'Verified User'
    }
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Dices className="w-5 h-5 text-primary-400" />
          </div>
        </div>
        <p className="text-gray-400">Loading your casino dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-dark-800 via-dark-700 to-dark-800 border border-primary-500/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMEw2MCAzMEwzMCA2MEwwIDMwTDMwIDBaIiBmaWxsPSJyZ2JhKDEwMCwgMTAwLCAyNTUsIDAuMDMpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">CasinoHub API Platform</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-400 max-w-lg">
                Manage your casino gaming APIs, monitor usage, and discover new integrations for your platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRefresh}
                disabled={refreshing}
                className="btn-secondary px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link to="/products" className="btn-primary px-4 py-2 rounded-xl flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Browse APIs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div 
            key={index} 
            className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.trendUp !== null && (
                <div className={`flex items-center gap-1 text-xs ${stat.trendUp ? 'text-accent-green' : 'text-red-400'}`}>
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </div>
              )}
              {stat.trendUp === null && (
                <span className="text-xs text-gray-500">{stat.trend}</span>
              )}
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-300">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content - Orders & APIs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                  <p className="text-sm text-gray-400">Your API purchases</p>
                </div>
              </div>
              <Link to="/dashboard/orders" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-dark-400/30">
              {stats.recentOrders.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-dark-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-2">No orders yet</p>
                  <p className="text-sm text-gray-500 mb-4">Start by browsing our casino APIs</p>
                  <Link to="/products" className="btn-primary px-6 py-2 rounded-lg inline-flex items-center gap-2">
                    <Dices className="w-4 h-4" />
                    Browse APIs
                  </Link>
                </div>
              ) : (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-dark-700 to-dark-600 rounded-xl flex items-center justify-center">
                        <Key className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{order.product?.name || 'API Subscription'}</p>
                        <p className="text-sm text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{formatPrice(order.amount || 0)}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === 'completed' ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* API Keys Summary */}
          {stats.apiKeys.length > 0 && (
            <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan to-blue-500 rounded-xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your API Keys</h3>
                    <p className="text-sm text-gray-400">Active integrations</p>
                  </div>
                </div>
                <Link to="/dashboard/apis" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                  Manage
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-dark-400/30">
                {stats.apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{apiKey.product?.name}</p>
                        <p className="text-sm text-gray-400">
                          {apiKey.monthly_requests?.toLocaleString()} requests this month
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        apiKey.status === 'active' 
                          ? 'bg-accent-green/20 text-accent-green border border-accent-green/30' 
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {apiKey.status}
                      </span>
                      <Link 
                        to={`/dashboard/apis`}
                        className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link to="/products" className="flex items-center gap-3 p-4 bg-gradient-to-r from-dark-700 to-dark-600 rounded-xl hover:from-dark-600 hover:to-dark-500 transition-all group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Dices className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Browse Casino APIs</p>
                  <p className="text-xs text-gray-400">Slots, Live Casino & more</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
              </Link>
              
              <Link to="/dashboard/apis" className="flex items-center gap-3 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-all group">
                <div className="w-12 h-12 bg-accent-cyan/20 rounded-xl flex items-center justify-center group-hover:bg-accent-cyan/30 transition-colors">
                  <Key className="w-6 h-6 text-accent-cyan" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Manage API Keys</p>
                  <p className="text-xs text-gray-400">View usage & regenerate</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-accent-cyan transition-colors" />
              </Link>
              
              <Link to="/dashboard/settings" className="flex items-center gap-3 p-4 bg-dark-700 rounded-xl hover:bg-dark-600 transition-all group">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">Usage Analytics</p>
                  <p className="text-xs text-gray-400">Detailed statistics</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent-green" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {stats.activity.length === 0 ? (
                <div className="text-center py-6">
                  <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No recent activity</p>
                </div>
              ) : (
                stats.activity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 bg-gradient-to-br ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <activity.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{activity.message}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.time)}</p>
                      {activity.meta && (
                        <span className="text-xs text-accent-green font-medium">{activity.meta}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* API Usage Overview */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary-400" />
              API Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Live Casino API</span>
                </div>
                <span className="text-xs text-accent-green">99.9% Uptime</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">Slots Aggregator</span>
                </div>
                <span className="text-xs text-accent-green">99.8% Uptime</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
                  <span className="text-sm text-gray-300">RNG Engine</span>
                </div>
                <span className="text-xs text-accent-green">100% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
