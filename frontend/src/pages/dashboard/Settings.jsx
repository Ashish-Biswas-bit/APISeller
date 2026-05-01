import React, { useState } from 'react'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Save,
  Check,
  AlertCircle,
  Mail,
  Key,
  Smartphone,
  Camera,
  Calendar,
  Crown,
  Sparkles,
  MapPin,
  Briefcase,
  Globe
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const Settings = () => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    company: user?.user_metadata?.company || '',
    bio: user?.user_metadata?.bio || '',
    location: user?.user_metadata?.location || '',
    website: user?.user_metadata?.website || '',
    role: user?.user_metadata?.role || 'Developer',
  })

  // Format member since date
  const memberSince = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'January 2024'

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and configuration</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="glass-card p-6">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Profile Header Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-700 via-dark-800 to-dark-900 border border-dark-400/30">
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-cyan/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                  
                  <div className="relative p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      {/* Avatar with border */}
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-br from-primary-500 via-accent-cyan to-primary-400 rounded-2xl blur opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-dark-700 to-dark-800 rounded-xl flex items-center justify-center border border-dark-400/50">
                          <span className="text-3xl font-bold bg-gradient-to-br from-primary-400 to-accent-cyan bg-clip-text text-transparent">
                            {formData.name.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                          {/* Online indicator */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-green rounded-full border-2 border-dark-800 flex items-center justify-center">
                            <div className="w-2 h-2 bg-dark-800 rounded-full" />
                          </div>
                        </div>
                        {/* Camera overlay */}
                        <button className="absolute inset-0 bg-dark-900/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </button>
                      </div>

                      {/* Profile Info */}
                      <div className="text-center md:text-left flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold text-white">
                            {formData.name || 'User'}
                          </h2>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-primary-500/20 to-accent-cyan/20 text-primary-400 text-xs font-medium rounded-full border border-primary-500/30">
                            <Crown className="w-3 h-3" />
                            {formData.role}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-4">{user?.email}</p>
                        
                        {/* Stats */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4 text-primary-400" />
                            Member since {memberSince}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Sparkles className="w-4 h-4 text-accent-cyan" />
                            Active Plan
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1 h-6 bg-gradient-to-b from-primary-500 to-accent-cyan rounded-full" />
                    <h3 className="text-lg font-semibold text-white">Personal Information</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <User className="w-4 h-4 text-primary-400" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Mail className="w-4 h-4 text-primary-400" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input-field"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Briefcase className="w-4 h-4 text-primary-400" />
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="input-field"
                        placeholder="Acme Inc."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <MapPin className="w-4 h-4 text-primary-400" />
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="input-field"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <Globe className="w-4 h-4 text-primary-400" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="input-field"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                        <User className="w-4 h-4 text-primary-400" />
                        Role
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="input-field"
                      >
                        <option value="Developer">Developer</option>
                        <option value="Manager">Manager</option>
                        <option value="CTO">CTO</option>
                        <option value="Founder">Founder</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                      <Sparkles className="w-4 h-4 text-primary-400" />
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="input-field min-h-[120px] resize-none"
                      placeholder="Tell us about yourself, your experience, and what you're building..."
                    />
                    <p className="text-xs text-gray-500">Brief description for your profile. Max 240 characters.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Notification Preferences</h3>
                
                <div className="space-y-4">
                  {[
                    { id: 'email_usage', label: 'Usage Alerts', description: 'Get notified when you reach 80% of your API limit', icon: Mail },
                    { id: 'email_security', label: 'Security Alerts', description: 'Important security notifications', icon: Shield },
                    { id: 'email_billing', label: 'Billing Alerts', description: 'Payment and invoice notifications', icon: CreditCard },
                    { id: 'email_product', label: 'Product Updates', description: 'New features and API announcements', icon: Bell },
                  ].map((item) => (
                    <div key={item.id} className="flex items-start gap-4 p-4 bg-dark-700 rounded-xl">
                      <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-white">{item.label}</h4>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                          </label>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-dark-700 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center">
                        <Key className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Password</h4>
                        <p className="text-sm text-gray-400">Last changed 3 months ago</p>
                      </div>
                      <button className="btn-secondary text-sm">Change</button>
                    </div>
                  </div>

                  <div className="p-4 bg-dark-700 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-400">Add an extra layer of security</p>
                      </div>
                      <button className="btn-secondary text-sm">Enable</button>
                    </div>
                  </div>

                  <div className="p-4 bg-dark-700 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">Active Sessions</h4>
                        <p className="text-sm text-gray-400">2 active sessions</p>
                      </div>
                      <button className="btn-secondary text-sm">Manage</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Billing Information</h3>
                
                <div className="p-4 bg-dark-700 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white">Payment Method</h4>
                      <p className="text-sm text-gray-400">Visa ending in 4242 • Expires 12/25</p>
                    </div>
                    <button className="btn-secondary text-sm">Update</button>
                  </div>
                </div>

                <div className="p-4 bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-white">Current Plan</h4>
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-400 rounded-full text-sm font-medium">Pro</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">
                    Your next billing date is January 1, 2024
                  </p>
                  <button className="btn-secondary text-sm">Manage Subscription</button>
                </div>
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'billing' && (
              <div className="flex items-center justify-between pt-6 border-t border-dark-400/30">
                {saved ? (
                  <div className="flex items-center gap-2 text-accent-green">
                    <Check className="w-5 h-5" />
                    <span>Saved successfully</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <AlertCircle className="w-5 h-5" />
                    <span>Don't forget to save your changes</span>
                  </div>
                )}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
