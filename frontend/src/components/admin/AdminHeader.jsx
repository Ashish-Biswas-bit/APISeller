import React, { useState } from 'react'
import { Bell, Search, LogOut, Shield, Dices, Crown, Coins } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

const AdminHeader = () => {
  const { signOut, user, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const notifications = [
    { id: 1, title: 'New order received', message: 'Live Dealer API - $499.00', time: '2 min ago', unread: true },
    { id: 2, title: 'New user registered', message: 'casino-operator@example.com', time: '15 min ago', unread: true },
    { id: 3, title: 'API rate limit warning', message: 'Slots Aggregator at 85% capacity', time: '1 hour ago', unread: false },
  ]

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-sm border-b border-dark-400/30 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500/20 to-accent-pink/20 rounded-lg border border-primary-500/30">
          <Crown className="w-4 h-4 text-primary-400" />
          <span className="text-sm text-primary-400 font-semibold">Admin Mode</span>
        </div>
        <div className="h-6 w-px bg-dark-400/50" />
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Coins className="w-4 h-4 text-accent-green" />
          <span>Total Revenue: <span className="text-white font-semibold">$24,580.00</span></span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search users, orders, APIs..."
            className="w-72 pl-10 pr-4 py-2 bg-dark-700/50 border border-dark-400/50 rounded-xl text-sm text-white 
                     placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-dark-700 transition-all"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-dark-800" />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-dark-800 border border-dark-400/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-dark-400/30 flex items-center justify-between">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-xs text-primary-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`px-4 py-3 border-b border-dark-400/20 hover:bg-dark-700/50 cursor-pointer transition-colors ${notif.unread ? 'bg-primary-500/5' : ''}`}>
                    <div className="flex items-start gap-3">
                      {notif.unread && <div className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 flex-shrink-0" />}
                      <div className={notif.unread ? '' : 'pl-5'}>
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Quick Menu */}
        <div className="h-8 w-px bg-dark-400/50 hidden sm:block" />
        
        <Link 
          to="/dashboard" 
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-dark-700/50 rounded-lg transition-all"
        >
          <span>User Panel</span>
        </Link>

        {/* Sign Out */}
        <button
          onClick={handleSignOut}
          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}

export default AdminHeader
