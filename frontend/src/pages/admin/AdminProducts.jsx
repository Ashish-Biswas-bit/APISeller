import React, { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  MoreVertical,
  Check,
  X,
  Filter,
  AlertTriangle,
  Package,
  Tag,
  DollarSign,
  List,
  Activity,
  Dice5,
  Coins,
  Trophy,
  Gamepad2,
  CreditCard,
  Shield,
  TrendingUp,
  ExternalLink
} from 'lucide-react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'

const casinoCategories = [
  { value: 'Live Casino', icon: Dice5, color: 'from-red-500 to-pink-500' },
  { value: 'Slots', icon: Coins, color: 'from-yellow-500 to-orange-500' },
  { value: 'Table Games', icon: Trophy, color: 'from-green-500 to-emerald-500' },
  { value: 'Payments', icon: CreditCard, color: 'from-blue-500 to-cyan-500' },
  { value: 'RNG', icon: Shield, color: 'from-purple-500 to-violet-500' },
  { value: 'Sports', icon: Activity, color: 'from-orange-500 to-red-500' },
  { value: 'Security', icon: Shield, color: 'from-gray-500 to-slate-500' },
]

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await getProducts()
      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handleSaveProduct = async (productData) => {
    if (editingProduct) {
      const { data, error } = await updateProduct(editingProduct.id, productData)
      if (!error && data) {
        setProducts(products.map(p => p.id === editingProduct.id ? data : p))
      }
    } else {
      const { data, error } = await createProduct(productData)
      if (!error && data) {
        setProducts([...products, data])
      }
    }
    setShowAddModal(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return
    
    const { error } = await deleteProduct(deletingProduct.id)
    if (!error) {
      setProducts(products.filter(p => p.id !== deletingProduct.id))
    }
    setDeletingProduct(null)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const totalRevenue = products.reduce((sum, p) => sum + (p.sales_count || 0) * (p.price || 0), 0)
  const activeProducts = products.filter(p => p.is_active !== false).length
  const totalSales = products.reduce((sum, p) => sum + (p.sales_count || 0), 0)

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500/20 to-primary-500/5 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Products</p>
              <p className="text-xl font-bold text-white">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-green/20 to-accent-green/5 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent-green" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-xl font-bold text-white">{activeProducts}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-cyan/20 to-accent-cyan/5 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Revenue</p>
              <p className="text-xl font-bold text-white">{formatPrice(totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-pink/20 to-accent-pink/5 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-accent-pink" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Sales</p>
              <p className="text-xl font-bold text-white">{totalSales}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">API Products</h1>
          <p className="text-gray-400">Manage casino gaming APIs and services</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl font-semibold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add API Product
        </button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search casino APIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white 
                       placeholder-gray-500 focus:outline-none focus:border-primary-500/50 focus:bg-dark-700 transition-all"
            />
          </div>
        </div>
        
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
            }`}
          >
            All Categories
          </button>
          {casinoCategories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                categoryFilter === cat.value
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                  : 'bg-dark-700 text-gray-400 hover:bg-dark-600 hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.value}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card overflow-hidden rounded-2xl border border-dark-400/30">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-400/30 bg-dark-800/50">
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Sales</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-400/20">
              {filteredProducts.map((product) => {
                const category = casinoCategories.find(c => c.value === product.category)
                return (
                  <tr key={product.id} className="hover:bg-dark-700/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-xl flex items-center justify-center border border-primary-500/20">
                          <span className="text-xl">{product.icon || '🎰'}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">{product.name}</p>
                          <p className="text-sm text-gray-400 truncate max-w-xs">
                            {product.description?.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        category 
                          ? `bg-gradient-to-r ${category.color} bg-opacity-20 text-white border border-white/20`
                          : 'bg-dark-600 text-gray-300'
                      }`}>
                        {category && <category.icon className="w-3 h-3" />}
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-white text-lg">{formatPrice(product.price || 0)}</p>
                      <p className="text-xs text-gray-400">per month</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                        product.is_active !== false
                          ? 'bg-accent-green/10 text-accent-green border border-accent-green/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}>
                        {product.is_active !== false ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Active
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white font-semibold">{product.sales_count || 0}</p>
                      <p className="text-xs text-gray-400">subscriptions</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => {
                            setEditingProduct(product)
                            setShowAddModal(true)
                          }}
                          className="p-2.5 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingProduct(product)}
                          className="p-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowAddModal(false)
            setEditingProduct(null)
          }}
          onSave={handleSaveProduct}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <DeleteModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteProduct}
        />
      )}
    </div>
  )
}

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(product || {
    name: '',
    description: '',
    category: 'Live Casino',
    price: 29900,
    original_price: 19900,
    original_provider_name: '',
    original_api_url: '',
    original_product_id: '',
    icon: '🎰',
    requests_included: 100000,
    rate_limit: 1000,
    features: ['HD Streaming', '24/7 Support', 'API Access'],
    endpoints: ['/api/v1/games'],
    is_active: true,
  })
  const [featureInput, setFeatureInput] = useState('')
  const [endpointInput, setEndpointInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      price: Number(formData.price),
      requests_included: Number(formData.requests_included),
      rate_limit: Number(formData.rate_limit),
    })
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = (index) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) })
  }

  const addEndpoint = () => {
    if (endpointInput.trim()) {
      setFormData({ ...formData, endpoints: [...(formData.endpoints || []), endpointInput.trim()] })
      setEndpointInput('')
    }
  }

  const removeEndpoint = (index) => {
    setFormData({ ...formData, endpoints: formData.endpoints.filter((_, i) => i !== index) })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-dark-400/50">
        <div className="p-6 border-b border-dark-400/30 flex items-center justify-between bg-gradient-to-r from-primary-500/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">
              {product ? 'Edit API Product' : 'Add New Casino API'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-dark-700 rounded-lg transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">API Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-all"
                placeholder="e.g. Live Dealer API"
                required
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-all min-h-[80px]"
                placeholder="Describe what this API offers..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-all"
                required
              >
                {casinoCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.value}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Icon (Emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-3 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white focus:outline-none focus:border-primary-500/50 transition-all"
                placeholder="🎰"
                maxLength={2}
              />
            </div>
          </div>

          {/* Pricing & Reseller Settings */}
          <div className="p-4 bg-dark-700/30 rounded-xl border border-dark-400/30 space-y-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-accent-cyan" />
              Reseller Pricing Strategy
            </h3>
            
            {/* Our Price vs Original Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-dark-700/50 rounded-lg border border-accent-green/30">
                <label className="text-xs text-accent-green font-medium mb-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Our Selling Price (cents)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-accent-green/50"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Customer pays: <span className="text-accent-green font-medium">{formatPrice(formData.price)}</span>/month</p>
              </div>
              <div className="p-3 bg-dark-700/50 rounded-lg border border-primary-500/30">
                <label className="text-xs text-primary-400 font-medium mb-1 flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" />
                  Original Provider Price (cents)
                </label>
                <input
                  type="number"
                  value={formData.original_price || ''}
                  onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                  placeholder="e.g. 19900"
                />
                <p className="text-xs text-gray-400 mt-1">We pay provider: <span className="text-primary-400 font-medium">{formatPrice(formData.original_price || 0)}</span></p>
              </div>
            </div>

            {/* Profit Display */}
            {formData.price && formData.original_price && (
              <div className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Profit Margin</span>
                  <span className="text-lg font-bold text-amber-400">
                    {formatPrice(formData.price - formData.original_price)}
                    <span className="text-sm font-normal text-gray-400 ml-1">
                      ({Math.round(((formData.price - formData.original_price) / formData.price) * 100)}%)
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Original Provider Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Original Provider Name</label>
                <input
                  type="text"
                  value={formData.original_provider_name || ''}
                  onChange={(e) => setFormData({ ...formData, original_provider_name: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                  placeholder="e.g. Evolution Gaming"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Original Product ID</label>
                <input
                  type="text"
                  value={formData.original_product_id || ''}
                  onChange={(e) => setFormData({ ...formData, original_product_id: e.target.value })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                  placeholder="Provider's product ID"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Original API URL</label>
              <input
                type="url"
                value={formData.original_api_url || ''}
                onChange={(e) => setFormData({ ...formData, original_api_url: e.target.value })}
                className="w-full px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                placeholder="https://api.provider.com/v1"
              />
            </div>

            {/* Rate Limits */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dark-400/30">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Requests/Month</label>
                <input
                  type="number"
                  value={formData.requests_included}
                  onChange={(e) => setFormData({ ...formData, requests_included: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Rate Limit (req/min)</label>
                <input
                  type="number"
                  value={formData.rate_limit}
                  onChange={(e) => setFormData({ ...formData, rate_limit: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-400/50 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Features</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500/50"
                placeholder="Add a feature..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-xl hover:bg-primary-500/30 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.features || []).map((feature, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-dark-600 rounded-lg text-sm text-gray-300">
                  {feature}
                  <button type="button" onClick={() => removeFeature(index)} className="text-gray-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">API Endpoints</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={endpointInput}
                onChange={(e) => setEndpointInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEndpoint())}
                className="flex-1 px-4 py-2 bg-dark-700/50 border border-dark-400/50 rounded-xl text-white text-sm focus:outline-none focus:border-primary-500/50"
                placeholder="e.g. /api/v1/games"
              />
              <button
                type="button"
                onClick={addEndpoint}
                className="px-4 py-2 bg-accent-cyan/20 text-accent-cyan rounded-xl hover:bg-accent-cyan/30 transition-colors text-sm font-medium"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.endpoints || []).map((endpoint, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1.5 bg-dark-600 rounded-lg text-sm text-accent-cyan font-mono">
                  {endpoint}
                  <button type="button" onClick={() => removeEndpoint(index)} className="text-gray-500 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          {/* Status Toggle */}
          <div className="flex items-center gap-3 p-4 bg-dark-700/30 rounded-xl">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-5 h-5 rounded border-dark-400 accent-primary-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-300">
              <span className="font-medium text-white">Active</span> - Make this API available for purchase
            </label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-500/30 transition-all"
            >
              {product ? 'Save Changes' : 'Create API Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DeleteModal = ({ product, onClose, onConfirm }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="glass-card w-full max-w-md rounded-2xl border border-red-500/30 overflow-hidden">
      <div className="p-6 text-center">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Delete API Product</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete <span className="text-white font-semibold">{product.name}</span>? 
          This action cannot be undone and may affect active subscriptions.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-500/30 transition-all"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  </div>
)

export default AdminProducts
