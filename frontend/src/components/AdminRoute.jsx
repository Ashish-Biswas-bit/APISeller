import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading, user, profile } = useAuth()
  const location = useLocation()

  // Debug logging
  console.log('[AdminRoute] State:', { isAuthenticated, isAdmin, loading, user: !!user, profileRole: profile?.role })

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="text-gray-400">Checking admin privileges...</span>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('[AdminRoute] Not authenticated, redirecting to login')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (!isAdmin) {
    console.log('[AdminRoute] Not admin (role:', profile?.role, '), showing unauthorized')
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="glass-card max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-2">You don't have permission to access the admin panel.</p>
          <p className="text-sm text-gray-500 mb-6">
            Current role: <span className="text-primary-400 font-semibold">{profile?.role || 'none'}</span>
          </p>
          <a 
            href="/dashboard" 
            className="btn-primary inline-flex items-center gap-2 px-6 py-3"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return children
}
