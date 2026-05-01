import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Check, 
  Code, 
  Clock, 
  Shield, 
  Globe, 
  Zap,
  Star,
  Users,
  Copy,
  ChevronRight,
  X,
  Wallet
} from 'lucide-react'
import { getProductById } from '../lib/supabase'
import { formatPrice } from '../utils/helpers'
import { useAuth } from '../context/AuthContext'
import BinanceCheckout from '../components/BinanceCheckout'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [copied, setCopied] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await getProductById(id)
      if (!error && data) {
        setProduct(data)
      } else {
        // Default product if fetch fails
        setProduct({
          id,
          name: 'Text Analysis API',
          description: 'Advanced Natural Language Processing API that provides sentiment analysis, entity recognition, keyword extraction, and language detection. Built for developers who need powerful text analysis capabilities.',
          category: 'NLP',
          price: 29,
          requests: '10,000',
          rating: 4.9,
          reviews: 234,
          features: [
            'Sentiment Analysis with confidence scores',
            'Named Entity Recognition (NER)',
            'Keyword and phrase extraction',
            'Language detection for 100+ languages',
            'Text classification and categorization',
            'Emotion detection and analysis',
            'Real-time processing',
            'Batch processing support',
          ],
          endpoints: [
            { method: 'POST', path: '/api/v1/analyze', description: 'Analyze text for sentiment and entities' },
            { method: 'POST', path: '/api/v1/extract', description: 'Extract keywords and phrases' },
            { method: 'GET', path: '/api/v1/detect', description: 'Detect language of text' },
            { method: 'POST', path: '/api/v1/classify', description: 'Classify text into categories' },
          ],
          codeExample: `curl -X POST https://api.apistore.com/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "I love this product! It's amazing!",
    "features": ["sentiment", "entities"]
  }'`,
        })
      }
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  const copyCode = () => {
    if (product?.codeExample) {
      navigator.clipboard.writeText(product.codeExample)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Product not found</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </button>

          {/* Product Header */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Left - Product Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-500/10 rounded-full text-sm text-primary-400 font-medium mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white font-medium">{product.rating || 4.8}</span>
                      <span className="text-gray-400">({product.reviews || 128} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Users className="w-4 h-4" />
                      <span>{product.users || '2.5k'} users</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {product.description}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg">
                  <Clock className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-gray-300">&lt; 50ms latency</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg">
                  <Shield className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-gray-300">SOC 2 Compliant</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg">
                  <Globe className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-gray-300">Global CDN</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-700 rounded-lg">
                  <Zap className="w-4 h-4 text-accent-green" />
                  <span className="text-sm text-gray-300">99.99% Uptime</span>
                </div>
              </div>
            </div>

            {/* Right - Pricing Card */}
            <div className="glass-card p-6 h-fit">
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(product.price || 29)}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-sm text-gray-400">
                  Includes {product.requests || '10,000'} requests
                </p>
              </div>

              {user ? (
                <>
                  <button 
                    onClick={() => setShowCheckout(true)}
                    className="btn-primary w-full mb-4 inline-flex items-center justify-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    Buy with Binance Pay
                  </button>
                  <button className="btn-secondary w-full">
                    Contact Sales
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login', { state: { from: `/products/${id}` } })}
                    className="btn-primary w-full mb-4"
                  >
                    Login to Purchase
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="btn-secondary w-full"
                  >
                    Create Account
                  </button>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-dark-400/30">
                <p className="text-sm text-gray-400 mb-3">What's included:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-accent-green" />
                    {product.requests || '10,000'} API requests/month
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-accent-green" />
                    Email support
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-accent-green" />
                    SDK access
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-accent-green" />
                    Analytics dashboard
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-dark-400/30 mb-8">
            <div className="flex gap-8">
              {['overview', 'endpoints', 'documentation'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-medium capitalize transition-colors relative ${
                    activeTab === tab 
                      ? 'text-primary-400' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Features */}
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-bold text-white mb-6">Features</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {product.features?.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-accent-green" />
                          </div>
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">Quick Start</h3>
                      <button
                        onClick={copyCode}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 text-accent-green" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-dark-700 rounded-xl p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300 font-mono">
                        {product.codeExample || 'curl -X GET https://api.example.com/v1/endpoint'}
                      </code>
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'endpoints' && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-6">API Endpoints</h3>
                  <div className="space-y-4">
                    {product.endpoints?.map((endpoint, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-dark-700 rounded-xl">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          endpoint.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                          endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {endpoint.method}
                        </span>
                        <div className="flex-1">
                          <code className="text-sm text-white font-mono">{endpoint.path}</code>
                          <p className="text-xs text-gray-400 mt-1">{endpoint.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'documentation' && (
                <div className="glass-card p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Documentation</h3>
                  <p className="text-gray-400 mb-6">
                    Comprehensive documentation is available including guides, reference materials, 
                    and code examples in multiple languages.
                  </p>
                  <button className="btn-secondary">
                    View Full Documentation
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card p-6">
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-accent-green" />
                    Email support
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-accent-green" />
                    API status page
                  </li>
                  <li className="flex items-center gap-2 text-gray-400">
                    <Check className="w-4 h-4 text-accent-green" />
                    Community forum
                  </li>
                </ul>
              </div>

              <div className="glass-card p-6">
                <h4 className="font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                      SDK Downloads
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                      Code Examples
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                      API Status
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Binance Checkout Modal */}
      {showCheckout && product && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative">
            <button
              onClick={() => setShowCheckout(false)}
              className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <BinanceCheckout
              product={product}
              onSuccess={() => {
                setShowCheckout(false)
                navigate('/dashboard/apis')
              }}
              onCancel={() => setShowCheckout(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
