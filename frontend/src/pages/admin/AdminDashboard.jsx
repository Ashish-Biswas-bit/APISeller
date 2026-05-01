import React, { useEffect, useState } from 'react'
import { 
  DollarSign, 
  Users, 
  Package, 
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  CreditCard
} from 'lucide-react'
import { getAllOrders, getAllUsers, getProducts } from '../../lib/supabase'
import { formatPrice, formatDate } from '../../utils/helpers'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenueChange: 12.5,
    usersChange: 8.3,
    ordersChange: -2.1,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [ordersResult, usersResult, productsResult] = await Promise.all([
          getAllOrders(),
          getAllUsers(),
          getProducts(),
        ])

        const orders = ordersResult.data || []
        const users = usersResult.data || []
        const products = productsResult.data || []

        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)

        setStats({
          totalRevenue,
          totalUsers: users.length,
          totalOrders: orders.length,
          totalProducts: products.length,
          revenueChange: 12.5,
          usersChange: 8.3,
          ordersChange: -2.1,
          recentOrders: orders.slice(0, 5),
        })
      } catch (error) {
        console.error('Error fetching admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600',
      change: stats.revenueChange,
      changeLabel: 'vs last month',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-primary-500 to-primary-600',
      change: stats.usersChange,
      changeLabel: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: CreditCard,
      color: 'from-accent-cyan to-blue-500',
      change: stats.ordersChange,
      changeLabel: 'vs last month',
    },
    {
      title: 'Active Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'from-accent-pink to-purple-500',
      change: null,
      changeLabel: 'APIs available',
    },
  ]

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
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of your API store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.change !== null && (
                <div className={`flex items-center gap-1 text-xs ${stat.change >= 0 ? 'text-accent-green' : 'text-red-400'}`}>
                  {stat.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(stat.change)}%
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-400">{stat.title}</p>
            {stat.changeLabel && (
              <p className="text-xs text-gray-500 mt-1">{stat.changeLabel}</p>
            )}
          </div>
        ))}
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
            <select className="bg-dark-700 border border-dark-400 rounded-lg px-3 py-1.5 text-sm text-white">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {[35, 45, 30, 65, 55, 80, 70, 85, 60, 75, 90, 95].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg opacity-80 hover:opacity-100 transition-opacity"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card">
          <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
            <a href="/admin/orders" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View All
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="divide-y divide-dark-400/30">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-dark-700/30 transition-colors">
                <div>
                  <p className="font-medium text-white text-sm">{order.product?.name || 'API Subscription'}</p>
                  <p className="text-xs text-gray-400">{order.user?.email || 'user@example.com'}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white text-sm">{formatPrice(order.amount || 29)}</p>
                  <p className="text-xs text-gray-400">{formatDate(order.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <a href="/admin/products" className="glass-card p-4 flex items-center gap-3 hover:bg-dark-700/50 transition-colors">
          <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <p className="font-medium text-white">Manage Products</p>
            <p className="text-xs text-gray-400">Add or edit APIs</p>
          </div>
        </a>
        <a href="/admin/users" className="glass-card p-4 flex items-center gap-3 hover:bg-dark-700/50 transition-colors">
          <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-accent-cyan" />
          </div>
          <div>
            <p className="font-medium text-white">User Management</p>
            <p className="text-xs text-gray-400">View and manage users</p>
          </div>
        </a>
        <a href="/admin/api-management" className="glass-card p-4 flex items-center gap-3 hover:bg-dark-700/50 transition-colors">
          <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-accent-green" />
          </div>
          <div>
            <p className="font-medium text-white">API Health</p>
            <p className="text-xs text-gray-400">Monitor API status</p>
          </div>
        </a>
        <a href="#" className="glass-card p-4 flex items-center gap-3 hover:bg-dark-700/50 transition-colors">
          <div className="w-10 h-10 bg-accent-pink/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-pink" />
          </div>
          <div>
            <p className="font-medium text-white">Analytics</p>
            <p className="text-xs text-gray-400">View detailed reports</p>
          </div>
        </a>
      </div>
    </div>
  )
}

export default AdminDashboard
