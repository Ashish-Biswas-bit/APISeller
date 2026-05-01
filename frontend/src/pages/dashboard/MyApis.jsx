import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertCircle,
  Plus,
  ExternalLink,
  Code,
  Dices,
  Zap,
  TrendingUp,
  BarChart3,
  Clock,
  Shield,
  Check,
  X,
  Sparkles,
  Terminal,
  Play,
  ChevronDown,
  ChevronUp,
  Package,
  CreditCard,
  Calendar,
  Crown,
  Activity,
  Server,
  Lock,
  FileCode,
  Rocket
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUserApiKeys } from '../../lib/supabase'
import { maskApiKey, copyToClipboard, formatDate, formatPrice } from '../../utils/helpers'

const MyApis = () => {
  const { user, profile } = useAuth()
  const [apiKeys, setApiKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showKey, setShowKey] = useState({})
  const [copied, setCopied] = useState({})
  const [selectedKey, setSelectedKey] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [expandedCard, setExpandedCard] = useState(null)

  const fetchApiKeys = async () => {
    if (!user) return
    const { data, error } = await getUserApiKeys(user.id)
    if (!error && data) {
      setApiKeys(data)
      if (data.length > 0 && !selectedKey) {
        setSelectedKey(data[0])
      }
    }
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    fetchApiKeys()
  }, [user])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchApiKeys()
  }

  const handleCopyKey = async (keyId, key) => {
    const success = await copyToClipboard(key)
    if (success) {
      setCopied({ ...copied, [keyId]: true })
      setTimeout(() => setCopied({ ...copied, [keyId]: false }), 2000)
    }
  }

  const toggleShowKey = (keyId) => {
    setShowKey({ ...showKey, [keyId]: !showKey[keyId] })
  }

  const getCategoryIcon = (category) => {
    const icons = {
      'Live Casino': Dices,
      'Slots': Zap,
      'Table Games': BarChart3,
      'Payments': Shield,
      'RNG': Sparkles,
      'Sports': TrendingUp,
      'Security': Shield
    }
    return icons[category] || Code
  }

  const getCategoryColor = (category) => {
    const colors = {
      'Live Casino': 'from-red-500 to-pink-500',
      'Slots': 'from-amber-500 to-yellow-500',
      'Table Games': 'from-primary-500 to-primary-600',
      'Payments': 'from-accent-green to-emerald-500',
      'RNG': 'from-purple-500 to-violet-500',
      'Sports': 'from-accent-cyan to-blue-500',
      'Security': 'from-rose-500 to-red-500'
    }
    return colors[category] || 'from-primary-500 to-accent-cyan'
  }

  if (loading) {
    return (
      <div className={clsx('flex', 'flex-col', 'items-center', 'justify-center', 'h-64', 'space-y-4')}>
        <div className="relative">
          <div className={clsx('w-12', 'h-12', 'border-2', 'border-primary-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
          <div className={clsx('absolute', 'inset-0', 'flex', 'items-center', 'justify-center')}>
            <Key className={clsx('w-5', 'h-5', 'text-primary-400')} />
          </div>
        </div>
        <p className="text-gray-400">Loading your API keys...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className={clsx('relative', 'overflow-hidden', 'rounded-2xl', 'bg-gradient-to-r', 'from-dark-800', 'via-dark-700', 'to-dark-800', 'border', 'border-primary-500/20', 'p-8')}>
        <div className={clsx('absolute', 'inset-0', 'opacity-30')} style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDEwMCwgMTAwLCAyNTUsIDAuMSkiLz48L3N2Zz4=")' }} />
        <div className={clsx('relative', 'flex', 'flex-col', 'md:flex-row', 'md:items-center', 'justify-between', 'gap-4')}>
          <div>
            <div className={clsx('flex', 'items-center', 'gap-2', 'mb-2')}>
              <Sparkles className={clsx('w-4', 'h-4', 'text-amber-400')} />
              <span className={clsx('text-xs', 'text-amber-400', 'font-medium', 'uppercase', 'tracking-wider')}>API Management</span>
            </div>
            <h1 className={clsx('text-3xl', 'font-bold', 'text-white', 'mb-2')}>My Casino API Keys</h1>
            <p className={clsx('text-gray-400', 'max-w-xl')}>
              Manage your gaming API credentials, monitor usage, and integrate casino services into your platform.
            </p>
          </div>
          <div className={clsx('flex', 'items-center', 'gap-3')}>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className={clsx('btn-secondary', 'px-4', 'py-2', 'rounded-xl', 'flex', 'items-center', 'gap-2')}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link to="/products" className={clsx('btn-primary', 'px-4', 'py-2', 'rounded-xl', 'inline-flex', 'items-center', 'gap-2')}>
              <Plus className={clsx('w-4', 'h-4')} />
              Get New API
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {apiKeys.length > 0 && (
        <div className={clsx('grid', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-4')}>
          <div className={clsx('glass-card', 'p-4')}>
            <div className={clsx('flex', 'items-center', 'gap-3')}>
              <div className={clsx('w-10', 'h-10', 'bg-gradient-to-br', 'from-primary-500', 'to-primary-600', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                <Key className={clsx('w-5', 'h-5', 'text-white')} />
              </div>
              <div>
                <p className={clsx('text-2xl', 'font-bold', 'text-white')}>{apiKeys.length}</p>
                <p className={clsx('text-xs', 'text-gray-400')}>Total APIs</p>
              </div>
            </div>
          </div>
          <div className={clsx('glass-card', 'p-4')}>
            <div className={clsx('flex', 'items-center', 'gap-3')}>
              <div className={clsx('w-10', 'h-10', 'bg-gradient-to-br', 'from-accent-green', 'to-emerald-500', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                <Zap className={clsx('w-5', 'h-5', 'text-white')} />
              </div>
              <div>
                <p className={clsx('text-2xl', 'font-bold', 'text-white')}>
                  {apiKeys.filter(k => k.status === 'active').length}
                </p>
                <p className={clsx('text-xs', 'text-gray-400')}>Active APIs</p>
              </div>
            </div>
          </div>
          <div className={clsx('glass-card', 'p-4')}>
            <div className={clsx('flex', 'items-center', 'gap-3')}>
              <div className={clsx('w-10', 'h-10', 'bg-gradient-to-br', 'from-accent-cyan', 'to-blue-500', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                <BarChart3 className={clsx('w-5', 'h-5', 'text-white')} />
              </div>
              <div>
                <p className={clsx('text-2xl', 'font-bold', 'text-white')}>
                  {apiKeys.reduce((sum, k) => sum + (k.monthly_requests || 0), 0).toLocaleString()}
                </p>
                <p className={clsx('text-xs', 'text-gray-400')}>Monthly Calls</p>
              </div>
            </div>
          </div>
          <div className={clsx('glass-card', 'p-4')}>
            <div className={clsx('flex', 'items-center', 'gap-3')}>
              <div className={clsx('w-10', 'h-10', 'bg-gradient-to-br', 'from-amber-500', 'to-orange-500', 'rounded-xl', 'flex', 'items-center', 'justify-center')}>
                <Clock className={clsx('w-5', 'h-5', 'text-white')} />
              </div>
              <div>
                <p className={clsx('text-2xl', 'font-bold', 'text-white')}>
                  {apiKeys.filter(k => k.last_used).length}
                </p>
                <p className={clsx('text-xs', 'text-gray-400')}>Used Recently</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className={clsx('glass-card', 'p-12', 'text-center')}>
          <div className={clsx('w-20', 'h-20', 'bg-gradient-to-br', 'from-primary-500/20', 'to-accent-cyan/20', 'rounded-2xl', 'flex', 'items-center', 'justify-center', 'mx-auto', 'mb-6')}>
            <Dices className={clsx('w-10', 'h-10', 'text-primary-400')} />
          </div>
          <h3 className={clsx('text-xl', 'font-semibold', 'text-white', 'mb-2')}>No API Keys Yet</h3>
          <p className={clsx('text-gray-400', 'mb-6', 'max-w-md', 'mx-auto')}>
            Start building your casino gaming platform. Browse our APIs for slots, live casino, and more.
          </p>
          <Link to="/products" className={clsx('btn-primary', 'px-6', 'py-3', 'rounded-xl', 'inline-flex', 'items-center', 'gap-2')}>
            <Play className={clsx('w-4', 'h-4')} />
            Explore Casino APIs
          </Link>
        </div>
      ) : (
        <div className={clsx('space-y-6')}>
          {apiKeys.map((apiKey) => {
            const CategoryIcon = getCategoryIcon(apiKey.product?.category)
            const categoryColor = getCategoryColor(apiKey.product?.category)
            const isExpanded = expandedCard === apiKey.id
            const usagePercent = Math.min(((apiKey.monthly_requests || 0) / (apiKey.requests_included || 1000)) * 100, 100)
            
            return (
              <div key={apiKey.id} className={clsx('glass-card', 'overflow-hidden', 'transition-all', 'duration-300', isExpanded && ['ring-1', 'ring-primary-500/30'])}> 
                {/* Header Section */}
                <div className="p-6">
                  <div className={clsx('flex', 'flex-col', 'lg:flex-row', 'lg:items-center', 'justify-between', 'gap-4')}>
                    {/* Product Info */}
                    <div className={clsx('flex', 'items-start', 'gap-4')}>
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br ${categoryColor}`}>
                        <CategoryIcon className={clsx('w-7', 'h-7', 'text-white')} />
                      </div>
                      <div>
                        <div className={clsx('flex', 'items-center', 'gap-2', 'mb-1')}>
                          <h3 className={clsx('font-bold', 'text-lg', 'text-white')}>{apiKey.product?.name || 'API Key'}</h3>
                          <span className={clsx('text-xs', 'px-2', 'py-0.5', 'bg-dark-600', 'text-gray-400', 'rounded-full')}>
                            {apiKey.product?.category || 'API'}
                          </span>
                        </div>
                        <div className={clsx('flex', 'items-center', 'gap-3', 'flex-wrap')}>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                            apiKey.status === 'active' 
                              ? 'bg-accent-green/10 text-accent-green border border-accent-green/20' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            <span className={clsx('w-1.5', 'h-1.5', 'rounded-full', apiKey.status === 'active' ? 'bg-accent-green' : 'bg-red-400', 'animate-pulse')} />
                            {apiKey.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                          <span className={clsx('text-xs', 'text-gray-500')}>
                            <Calendar className={clsx('w-3', 'h-3', 'inline', 'mr-1')} />
                            Purchased {formatDate(apiKey.order?.created_at || apiKey.created_at)}
                          </span>
                          <span className={clsx('text-xs', 'text-gray-500')}>
                            <Clock className={clsx('w-3', 'h-3', 'inline', 'mr-1')} />
                            Last used: {apiKey.last_used ? formatDate(apiKey.last_used) : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className={clsx('flex', 'items-center', 'gap-6')}> 
                      <div className={clsx('text-center')}>
                        <p className={clsx('text-2xl', 'font-bold', 'text-white')}>{apiKey.monthly_requests?.toLocaleString() || '0'}</p>
                        <p className={clsx('text-xs', 'text-gray-400')}>This Month</p>
                      </div>
                      <div className={clsx('h-8', 'w-px', 'bg-dark-400')} />
                      <div className={clsx('text-center')}>
                        <p className={clsx('text-2xl', 'font-bold', 'text-primary-400')}>{(apiKey.requests_included || 1000).toLocaleString()}</p>
                        <p className={clsx('text-xs', 'text-gray-400')}>Included</p>
                      </div>
                    </div>
                  </div>

                  {/* API Key Section */}
                  <div className={clsx('mt-6', 'p-4', 'bg-dark-700/50', 'rounded-xl', 'border', 'border-dark-400/30')}>
                    <div className={clsx('flex', 'items-center', 'justify-between', 'mb-3')}>
                      <label className={clsx('text-xs', 'font-medium', 'text-gray-400', 'uppercase', 'tracking-wider')}>API Key</label>
                      <div className={clsx('flex', 'items-center', 'gap-2')}>
                        <span className={clsx('text-xs', 'text-gray-500')}>
                          <Shield className={clsx('w-3', 'h-3', 'inline', 'mr-1')} />
                          Keep this secret
                        </span>
                      </div>
                    </div>
                    <div className={clsx('flex', 'items-center', 'gap-3')}>
                      <div className={clsx('flex-1', 'bg-dark-800', 'px-4', 'py-3', 'rounded-lg', 'border', 'border-dark-400/50')}>
                        <code className={clsx('text-sm', 'text-primary-300', 'font-mono', 'tracking-wide')}>
                          {showKey[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                        </code>
                      </div>
                      <button
                        onClick={() => toggleShowKey(apiKey.id)}
                        className={clsx('p-3', 'bg-dark-700', 'hover:bg-dark-600', 'text-gray-400', 'hover:text-white', 'rounded-lg', 'transition-colors')}
                        title={showKey[apiKey.id] ? 'Hide API Key' : 'Show API Key'}
                      >
                        {showKey[apiKey.id] ? <EyeOff className={clsx('w-5', 'h-5')} /> : <Eye className={clsx('w-5', 'h-5')} />}
                      </button>
                      <button
                        onClick={() => handleCopyKey(apiKey.id, apiKey.key)}
                        className={clsx('p-3', 'bg-primary-500', 'hover:bg-primary-600', 'text-white', 'rounded-lg', 'transition-colors', 'flex', 'items-center', 'gap-2')}
                        title="Copy to clipboard"
                      >
                        {copied[apiKey.id] ? (
                          <>
                            <Check className={clsx('w-5', 'h-5')} />
                            <span className={clsx('text-sm', 'font-medium')}>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className={clsx('w-5', 'h-5')} />
                            <span className={clsx('text-sm', 'font-medium')}>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Usage Bar */}
                  <div className={clsx('mt-4')}>
                    <div className={clsx('flex', 'items-center', 'justify-between', 'text-sm', 'mb-2')}>
                      <span className={clsx('text-gray-400', 'flex', 'items-center', 'gap-2')}>
                        <Activity className={clsx('w-4', 'h-4')} />
                        Monthly Usage
                      </span>
                      <span className={clsx('font-medium', usagePercent > 80 && 'text-amber-400') || 'text-gray-300'}>
                        {usagePercent.toFixed(1)}%
                      </span>
                    </div>
                    <div className={clsx('h-2.5', 'bg-dark-700', 'rounded-full', 'overflow-hidden')}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${usagePercent > 80 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-primary-500 to-accent-cyan'}`}
                        style={{ width: `${usagePercent}%` }}
                      />
                    </div>
                    <p className={clsx('text-xs', 'text-gray-500', 'mt-2')}>
                      {((apiKey.requests_included || 1000) - (apiKey.monthly_requests || 0)).toLocaleString()} requests remaining this month
                    </p>
                  </div>

                  {/* Quick Actions Row */}
                  <div className={clsx('mt-6', 'flex', 'flex-wrap', 'items-center', 'gap-3')}>
                    <button 
                      onClick={() => setExpandedCard(isExpanded ? null : apiKey.id)}
                      className={clsx('btn-secondary', 'text-sm', 'py-2.5', 'px-4', 'inline-flex', 'items-center', 'gap-2')}
                    >
                      {isExpanded ? <ChevronUp className={clsx('w-4', 'h-4')} /> : <ChevronDown className={clsx('w-4', 'h-4')} />}
                      {isExpanded ? 'Show Less' : 'View Details'}
                    </button>
                    <Link 
                      to="/docs" 
                      className={clsx('btn-secondary', 'text-sm', 'py-2.5', 'px-4', 'inline-flex', 'items-center', 'gap-2')}
                    >
                      <FileCode className={clsx('w-4', 'h-4')} />
                      Documentation
                    </Link>
                    <Link 
                      to={`/products/${apiKey.product?.id}`}
                      className={clsx('btn-secondary', 'text-sm', 'py-2.5', 'px-4', 'inline-flex', 'items-center', 'gap-2')}
                    >
                      <Package className={clsx('w-4', 'h-4')} />
                      Product Page
                    </Link>
                    <button className={clsx('btn-secondary', 'text-sm', 'py-2.5', 'px-4', 'ml-auto', 'text-red-400', 'hover:text-red-300')}>
                      <RefreshCw className={clsx('w-4', 'h-4', 'inline', 'mr-2')} />
                      Regenerate Key
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className={clsx('border-t', 'border-dark-400/30', 'bg-dark-700/20')}>
                    {/* Product Details */}
                    <div className={clsx('p-6', 'grid', 'md:grid-cols-2', 'gap-6')}>
                      {/* Left Column - Product Info */}
                      <div className={clsx('space-y-6')}>
                        <div>
                          <h4 className={clsx('text-sm', 'font-semibold', 'text-white', 'mb-3', 'flex', 'items-center', 'gap-2')}>
                            <Package className={clsx('w-4', 'h-4', 'text-primary-400')} />
                            Product Details
                          </h4>
                          <div className={clsx('space-y-3', 'text-sm')}>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Category</span>
                              <span className={clsx('text-white', 'font-medium')}>{apiKey.product?.category || 'API'}</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Rate Limit</span>
                              <span className={clsx('text-white', 'font-medium')}>{apiKey.rate_limit?.toLocaleString() || '1,000'} requests/min</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Monthly Quota</span>
                              <span className={clsx('text-white', 'font-medium')}>{(apiKey.requests_included || 1000).toLocaleString()} requests</span>
                            </div>
                          </div>
                        </div>

                        {/* Features */}
                        {apiKey.product?.features && apiKey.product.features.length > 0 && (
                          <div>
                            <h4 className={clsx('text-sm', 'font-semibold', 'text-white', 'mb-3', 'flex', 'items-center', 'gap-2')}>
                              <Crown className={clsx('w-4', 'h-4', 'text-amber-400')} />
                              Included Features
                            </h4>
                            <ul className={clsx('space-y-2')}>
                              {apiKey.product.features.slice(0, 5).map((feature, idx) => (
                                <li key={idx} className={clsx('flex', 'items-center', 'gap-2', 'text-sm', 'text-gray-300')}>
                                  <Check className={clsx('w-4', 'h-4', 'text-accent-green', 'flex-shrink-0')} />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Right Column - Purchase & Usage Info */}
                      <div className={clsx('space-y-6')}>
                        {/* Purchase Details */}
                        <div>
                          <h4 className={clsx('text-sm', 'font-semibold', 'text-white', 'mb-3', 'flex', 'items-center', 'gap-2')}>
                            <CreditCard className={clsx('w-4', 'h-4', 'text-accent-cyan')} />
                            Purchase Details
                          </h4>
                          <div className={clsx('space-y-3', 'text-sm')}>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Order ID</span>
                              <code className={clsx('text-xs', 'text-primary-300', 'bg-dark-800', 'px-2', 'py-1', 'rounded')}>{apiKey.order_id?.slice(0, 8)}...</code>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Purchase Date</span>
                              <span className={clsx('text-white')}>{formatDate(apiKey.order?.created_at || apiKey.created_at)}</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Amount Paid</span>
                              <span className={clsx('text-accent-green', 'font-medium')}>{formatPrice(apiKey.order?.amount || apiKey.product?.price || 0)}</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Payment Method</span>
                              <span className={clsx('text-white', 'flex', 'items-center', 'gap-1')}>
                                <span className={clsx('w-2', 'h-2', 'bg-yellow-400', 'rounded-full')} />
                                Binance Pay
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Usage Stats */}
                        <div>
                          <h4 className={clsx('text-sm', 'font-semibold', 'text-white', 'mb-3', 'flex', 'items-center', 'gap-2')}>
                            <BarChart3 className={clsx('w-4', 'h-4', 'text-accent-green')} />
                            Usage Statistics
                          </h4>
                          <div className={clsx('space-y-3', 'text-sm')}>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Total Requests</span>
                              <span className={clsx('text-white', 'font-medium')}>{apiKey.total_requests?.toLocaleString() || '0'}</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>This Month</span>
                              <span className={clsx('text-white', 'font-medium')}>{apiKey.monthly_requests?.toLocaleString() || '0'}</span>
                            </div>
                            <div className={clsx('flex', 'items-center', 'justify-between', 'p-3', 'bg-dark-700/50', 'rounded-lg')}>
                              <span className={clsx('text-gray-400')}>Remaining</span>
                              <span className={clsx('text-primary-400', 'font-medium')}>{((apiKey.requests_included || 1000) - (apiKey.monthly_requests || 0)).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>

                        {/* Integration Quick Start */}
                        <div>
                          <h4 className={clsx('text-sm', 'font-semibold', 'text-white', 'mb-3', 'flex', 'items-center', 'gap-2')}>
                            <Rocket className={clsx('w-4', 'h-4', 'text-accent-green')} />
                            Quick Integration
                          </h4>
                          <div className={clsx('p-3', 'bg-dark-800', 'rounded-lg', 'border', 'border-dark-400/50')}>
                            <code className={clsx('text-xs', 'text-gray-300', 'font-mono', 'block', 'whitespace-pre-wrap')}>
{`curl -X GET \\
  https://api.yoursite.com/v1/${apiKey.product?.category?.toLowerCase().replace(' ', '-') || 'casino'} \\
  -H "Authorization: Bearer ${apiKey.key.slice(0, 20)}..." \\
  -H "Content-Type: application/json"`}
                            </code>
                          </div>
                          <Link to="/docs" className={clsx('text-xs', 'text-primary-400', 'hover:text-primary-300', 'mt-2', 'inline-flex', 'items-center', 'gap-1')}>
                            <ExternalLink className={clsx('w-3', 'h-3')} />
                            View full documentation
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* API Usage Guidelines */}
      <div className={clsx('glass-card', 'p-6')}>
        <div className={clsx('flex', 'items-start', 'gap-4')}>
          <div className={clsx('w-10', 'h-10', 'bg-yellow-500/10', 'rounded-lg', 'flex', 'items-center', 'justify-center', 'flex-shrink-0')}>
            <AlertCircle className={clsx('w-5', 'h-5', 'text-yellow-400')} />
          </div>
          <div>
            <h4 className={clsx('font-semibold', 'text-white', 'mb-2')}>API Key Security</h4>
            <ul className={clsx('text-sm', 'text-gray-400', 'space-y-1', 'list-disc', 'list-inside')}>
              <li>Never share your API keys in public repositories or client-side code</li>
              <li>Rotate your API keys regularly for enhanced security</li>
              <li>Use environment variables to store API keys in your applications</li>
              <li>Monitor your API usage for any suspicious activity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyApis
