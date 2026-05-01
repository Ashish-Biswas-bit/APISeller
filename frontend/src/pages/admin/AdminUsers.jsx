import React, { useEffect, useState, useRef } from 'react'
import { 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Shield,
  User,
  Ban,
  Check,
  Users,
  Crown,
  Clock,
  Edit3,
  Eye,
  X,
  ChevronDown,
  Key,
  Activity,
  CreditCard,
  AlertTriangle
} from 'lucide-react'
import { getAllUsers, updateUserRole } from '../../lib/supabase'
import { formatDate } from '../../utils/helpers'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [actionMenuOpen, setActionMenuOpen] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenuOpen(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await getAllUsers()
      if (!error && data) {
        setUsers(data)
      }
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const handleRoleChange = async (userId, newRole) => {
    const { error } = await updateUserRole(userId, newRole)
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
    setEditingUser(null)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.company?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || (user.status || 'active') === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => (u.status || 'active') === 'active').length,
    newThisWeek: users.filter(u => {
      const created = new Date(u.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return created > weekAgo
    }).length
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-500/5 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Users</p>
              <p className="text-xl font-bold text-white">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-pink/20 to-accent-pink/5 rounded-xl flex items-center justify-center">
              <Crown className="w-5 h-5 text-accent-pink" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Admins</p>
              <p className="text-xl font-bold text-white">{stats.admins}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-green/20 to-accent-green/5 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Now</p>
              <p className="text-xl font-bold text-white">{stats.active}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-gray-400">New This Week</p>
              <p className="text-xl font-bold text-white">{stats.newThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-400">Manage casino operator accounts and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-dark-700 transition-all"
            />
          </div>
        </div>
        
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              roleFilter === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              roleFilter === 'admin'
                ? 'bg-gradient-to-r from-accent-pink to-purple-500 text-white shadow-lg'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4" />
            Admins
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              roleFilter === 'user'
                ? 'bg-gradient-to-r from-primary-500 to-accent-cyan text-white shadow-lg'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Users
          </button>
          
          <div className="w-px h-8 bg-dark-400/50 mx-2" />
          
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              statusFilter === 'active'
                ? 'bg-accent-green text-dark-900 shadow-lg shadow-accent-green/30'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            Active
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden rounded-2xl border border-dark-400/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400/30 bg-dark-800/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">API Keys</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-400/20">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-dark-700/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-br from-accent-pink to-purple-500 text-white'
                          : 'bg-gradient-to-br from-primary-500 to-accent-cyan text-white'
                      }`}>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {user.full_name || 'Unnamed User'}
                        </p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        {user.company && (
                          <p className="text-xs text-gray-500">{user.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setEditingUser(user)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-accent-pink to-purple-500 text-white shadow-lg shadow-accent-pink/30'
                          : 'bg-dark-600 text-gray-300 border border-dark-400/50'
                      }`}
                    >
                      {user.role === 'admin' && <Crown className="w-3 h-3" />}
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      (user.status || 'active') === 'active'
                        ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {(user.status || 'active') === 'active' ? (
                        <><Check className="w-3.5 h-3.5" /> Active</>
                      ) : (
                        <><Ban className="w-3.5 h-3.5" /> Suspended</>
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-white text-sm">{formatDate(user.created_at)}</p>
                    <p className="text-xs text-gray-500">
                      Last seen: {formatDate(user.last_sign_in_at) || 'Never'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{user.api_keys_count || 0}</span>
                      <span className="text-xs text-gray-500">active</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1" ref={menuRef}>
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setEditingUser(user)}
                        className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                        title="Edit Role"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                          className="p-2.5 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {actionMenuOpen === user.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-dark-800 border border-dark-400/30 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
                            <button 
                              onClick={() => { setSelectedUser(user); setActionMenuOpen(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Profile
                            </button>
                            <button 
                              onClick={() => { setEditingUser(user); setActionMenuOpen(null); }}
                              className="w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
                            >
                              <Shield className="w-4 h-4" /> Change Role
                            </button>
                            <div className="border-t border-dark-400/30" />
                            <button 
                              className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Ban className="w-4 h-4" /> Suspend User
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-semibold">{filteredUsers.length}</span> of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-50">
            Previous
          </button>
          <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-gray-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Role Edit Modal */}
      {editingUser && (
        <RoleEditModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)}
          onSave={handleRoleChange}
        />
      )}
    </div>
  )
}

const UserDetailModal = ({ user, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="glass-card w-full max-w-lg rounded-2xl border border-dark-400/50 overflow-hidden">
      <div className="p-6 border-b border-dark-400/30 bg-gradient-to-r from-primary-500/10 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold ${
              user.role === 'admin' 
                ? 'bg-gradient-to-br from-accent-pink to-purple-500 text-white'
                : 'bg-gradient-to-br from-primary-500 to-accent-cyan text-white'
            }`}>
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.full_name || 'Unnamed User'}</h3>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Role</p>
            <div className="flex items-center gap-2">
              {user.role === 'admin' ? <Crown className="w-4 h-4 text-accent-pink" /> : <User className="w-4 h-4 text-primary-400" />}
              <span className={`font-semibold ${user.role === 'admin' ? 'text-accent-pink' : 'text-white'}`}>
                {user.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${(user.status || 'active') === 'active' ? 'bg-accent-green' : 'bg-red-500'}`} />
              <span className="font-semibold text-white capitalize">{user.status || 'Active'}</span>
            </div>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Joined</p>
            <p className="font-semibold text-white">{formatDate(user.created_at)}</p>
          </div>
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Last Active</p>
            <p className="font-semibold text-white">{formatDate(user.last_sign_in_at) || 'Never'}</p>
          </div>
        </div>
        
        {user.company && (
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Company</p>
            <p className="font-semibold text-white">{user.company}</p>
          </div>
        )}
        
        {user.bio && (
          <div className="p-4 bg-dark-700/50 rounded-xl">
            <p className="text-sm text-gray-400 mb-1">Bio</p>
            <p className="text-gray-300">{user.bio}</p>
          </div>
        )}
        
        <div className="flex gap-3 pt-2">
          <button className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Mail className="w-4 h-4" /> Send Email
          </button>
          <button className="flex-1 px-6 py-3 bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
            <Key className="w-4 h-4" /> View API Keys
          </button>
        </div>
      </div>
    </div>
  </div>
)

const RoleEditModal = ({ user, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user.role || 'user')
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-md rounded-2xl border border-dark-400/50 overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Change User Role</h3>
          <p className="text-gray-400 mb-6">
            Update role for <span className="text-white font-semibold">{user.email}</span>
          </p>
          
          <div className="space-y-3 mb-6">
            <button
              onClick={() => setSelectedRole('user')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selectedRole === 'user'
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-dark-400/50 hover:border-dark-400'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">User</p>
                <p className="text-sm text-gray-400">Standard access to APIs and dashboard</p>
              </div>
              {selectedRole === 'user' && <Check className="w-5 h-5 text-primary-400 ml-auto" />}
            </button>
            
            <button
              onClick={() => setSelectedRole('admin')}
              className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                selectedRole === 'admin'
                  ? 'border-accent-pink bg-accent-pink/10'
                  : 'border-dark-400/50 hover:border-dark-400'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-accent-pink to-purple-500 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-white">Administrator</p>
                <p className="text-sm text-gray-400">Full access to admin panel and all features</p>
              </div>
              {selectedRole === 'admin' && <Check className="w-5 h-5 text-accent-pink ml-auto" />}
            </button>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={() => onSave(user.id, selectedRole)}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
