import React, { useState } from 'react'
import { 
  Activity,
  Server,
  AlertTriangle,
  Check,
  Clock,
  Globe,
  RefreshCw,
  Settings,
  Shield,
  Zap
} from 'lucide-react'

const AdminApiManagement = () => {
  const [selectedApi, setSelectedApi] = useState('text-analysis')

  const apis = [
    { id: 'text-analysis', name: 'Text Analysis API', status: 'operational', uptime: 99.99, latency: 45 },
    { id: 'image-recognition', name: 'Image Recognition API', status: 'operational', uptime: 99.97, latency: 120 },
    { id: 'data-enrichment', name: 'Data Enrichment API', status: 'degraded', uptime: 98.5, latency: 85 },
    { id: 'auth', name: 'Authentication API', status: 'operational', uptime: 99.99, latency: 25 },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'operational':
        return 'text-accent-green bg-accent-green/10'
      case 'degraded':
        return 'text-yellow-400 bg-yellow-400/10'
      case 'down':
        return 'text-red-400 bg-red-400/10'
      default:
        return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">API Management</h1>
        <p className="text-gray-400">Monitor and manage your API infrastructure</p>
      </div>

      {/* Status Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
              <Check className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4/4</p>
              <p className="text-sm text-gray-400">Operational</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1.2M</p>
              <p className="text-sm text-gray-400">Requests Today</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-cyan/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">68ms</p>
              <p className="text-sm text-gray-400">Avg. Latency</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-accent-pink/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-accent-pink" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-sm text-gray-400">Uptime</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Status List */}
      <div className="glass-card">
        <div className="p-6 border-b border-dark-400/30">
          <h3 className="text-lg font-semibold text-white">API Status</h3>
        </div>
        <div className="divide-y divide-dark-400/30">
          {apis.map((api) => (
            <div 
              key={api.id}
              className={`p-6 flex items-center justify-between cursor-pointer hover:bg-dark-700/30 transition-colors ${
                selectedApi === api.id ? 'bg-dark-700/50' : ''
              }`}
              onClick={() => setSelectedApi(api.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center">
                  <Server className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">{api.name}</h4>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <span>{api.latency}ms latency</span>
                    <span>{api.uptime}% uptime</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(api.status)}`}>
                {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected API Details */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Metrics */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Request Volume (24h)</h3>
            <select className="bg-dark-700 border border-dark-400 rounded-lg px-3 py-1.5 text-sm text-white">
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-48 flex items-end justify-between gap-1">
            {Array.from({ length: 24 }).map((_, i) => {
              const height = Math.random() * 80 + 20
              return (
                <div
                  key={i}
                  className="flex-1 bg-gradient-to-t from-primary-500/50 to-primary-400/30 rounded-t-sm hover:from-primary-500 hover:to-primary-400 transition-all cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${Math.round(height * 100)} requests`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>00:00</span>
            <span>06:00</span>
            <span>12:00</span>
            <span>18:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Configuration */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Configuration</h3>
          <div className="space-y-4">
            <div className="p-4 bg-dark-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Rate Limit</span>
                <span className="text-sm text-white">1,000/min</span>
              </div>
              <input type="range" className="w-full" min="100" max="10000" defaultValue="1000" />
            </div>
            <div className="p-4 bg-dark-700 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Timeout</span>
                <span className="text-sm text-white">30s</span>
              </div>
              <input type="range" className="w-full" min="5" max="60" defaultValue="30" />
            </div>
            <div className="p-4 bg-dark-700 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-white">API Key Required</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
            <div className="p-4 bg-dark-700 rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-white">Caching Enabled</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </div>
          <button className="btn-primary w-full mt-6">
            <Settings className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="glass-card">
        <div className="p-6 border-b border-dark-400/30 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Recent Incidents</h3>
          <button className="text-sm text-primary-400 hover:text-primary-300">
            View All
          </button>
        </div>
        <div className="divide-y divide-dark-400/30">
          <div className="p-4 flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-white">Degraded Performance - Data Enrichment API</h4>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-400">
                Elevated latency detected in the US-West region. Team is investigating.
              </p>
            </div>
          </div>
          <div className="p-4 flex items-start gap-4">
            <div className="w-8 h-8 bg-accent-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-accent-green" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-white">Resolved - Image Recognition API</h4>
                <span className="text-xs text-gray-400">Yesterday</span>
              </div>
              <p className="text-sm text-gray-400">
                Service degradation has been resolved. All systems operational.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminApiManagement
