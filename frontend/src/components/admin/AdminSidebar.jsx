import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Dices,
  ChevronLeft,
  ChevronRight,
  Shield,
  ExternalLink,
  BarChart3,
  Key,
  LogOut,
  DollarSign
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const AdminSidebar = () => {
  const { user, isAdmin } = useAuth()
  const [collapsed, setCollapsed] = React.useState(false)

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/products', icon: Package, label: 'API Products' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/profits', icon: DollarSign, label: 'Reseller Profits' },
    { path: '/admin/api-management', icon: Shield, label: 'API Health' },
    { path: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <aside 
      className={`fixed left-0 top-0 bottom-0 bg-dark-800 border-r border-dark-400/30 z-40 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-dark-400/30">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-pink rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/20">
            <Dices className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <span className="text-lg font-bold gradient-text">CasinoHub</span>
              <span className="block text-[10px] text-primary-400 uppercase tracking-wider font-semibold">Admin Panel</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        <p className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${collapsed ? 'hidden' : ''}`}>
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                isActive
                  ? 'bg-gradient-to-r from-primary-500/20 to-primary-500/5 text-primary-400 border border-primary-500/30 shadow-sm'
                  : 'text-gray-400 hover:bg-dark-700 hover:text-white'
              }`
            }
          >
            <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${
              window.location.pathname === item.path ? 'text-primary-400' : 'group-hover:text-primary-400'
            }`} />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Quick Access */}
      <div className="px-4 py-2">
        <p className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 ${collapsed ? 'hidden' : ''}`}>
          Quick Access
        </p>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all text-sm"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>User Panel</span>}
        </NavLink>
        <NavLink
          to="/products"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all text-sm"
        >
          <Package className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>API Store</span>}
        </NavLink>
      </div>

      {/* User Section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-400/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-primary-400">Administrator</p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mt-2 w-full flex items-center justify-center p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
