import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap, TrendingUp, Shield, Dices, Gamepad2, Trophy, Coins, CreditCard, Code } from 'lucide-react'
import { getProducts } from '../../lib/supabase'
import { formatPrice } from '../../utils/helpers'

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await getProducts()
      if (!error && data) {
        // Get first 3 products for featured section
        setProducts(data.slice(0, 3))
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const defaultProducts = [
    {
      id: 1,
      name: 'Live Dealer API',
      description: 'Real-time streaming of Blackjack, Roulette, Baccarat, and Poker with professional dealers.',
      icon: Dices,
      price: 499,
      category: 'Live Casino',
      requests: '100,000',
      rating: 4.9,
      features: ['50+ Live Tables', 'HD Streaming', 'Multi-language'],
    },
    {
      id: 2,
      name: 'Slots Aggregator',
      description: 'Access 1000+ slot games from top providers through a single integration.',
      icon: Gamepad2,
      price: 299,
      category: 'Slots',
      requests: '500,000',
      rating: 4.8,
      features: ['1000+ Games', 'Jackpot Networks', 'Mobile Ready'],
    },
    {
      id: 3,
      name: 'Casino Wallet API',
      description: 'Unified wallet system supporting crypto and fiat with instant deposits/withdrawals.',
      icon: CreditCard,
      price: 399,
      category: 'Payments',
      requests: 'Unlimited',
      rating: 4.9,
      features: ['Crypto Support', 'Multi-currency', 'KYC Ready'],
    },
  ]

  const displayProducts = products.length > 0 ? products : defaultProducts

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full">
                <Dices className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-400 font-medium">Featured Gaming APIs</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Popular Casino <span className="gradient-text">APIs</span>
              </h2>
              <p className="text-gray-400 max-w-xl">
                Trusted by 500+ casino operators worldwide. Everything you need to launch 
                or upgrade your iGaming platform.
              </p>
            </div>
            <Link to="/products" className="btn-secondary inline-flex items-center gap-2 self-start md:self-auto">
              View All APIs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ProductCard = ({ product, index }) => {
  const Icon = product.icon || Code

  return (
    <div
      className="group glass-card-hover p-6 lg:p-8 flex flex-col h-full"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 rounded-2xl flex items-center justify-center
                      group-hover:from-primary-500/30 group-hover:to-accent-cyan/30 transition-all duration-300">
          <Icon className="w-7 h-7 text-primary-400" />
        </div>
        <div className="flex items-center gap-1 px-3 py-1 bg-dark-600 rounded-full">
          <TrendingUp className="w-3 h-3 text-accent-green" />
          <span className="text-xs text-gray-400">{product.rating || 4.8}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-1">
        <span className="text-xs text-primary-400 font-medium uppercase tracking-wider">
          {product.category || 'API'}
        </span>
        <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Features */}
        <div className="space-y-2 mb-6">
          {(product.features || ['Fast Response', 'High Accuracy', '24/7 Support']).map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-accent-green flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-6 border-t border-dark-400/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-white">
              {formatPrice(product.price || 29)}
            </span>
            <span className="text-sm text-gray-400">/month</span>
          </div>
          <span className="text-sm text-gray-400">
            {product.requests || '10,000'} requests
          </span>
        </div>
        <Link
          to={`/products/${product.id}`}
          className="btn-primary w-full text-center block"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default FeaturedProducts
