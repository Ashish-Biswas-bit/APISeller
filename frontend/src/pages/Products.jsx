import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { 
  Search, 
  Filter, 
  ArrowRight, 
  Code, 
  Dices,
  Gamepad2,
  Coins,
  Trophy,
  Shield,
  Star,
  CreditCard,
  BarChart3
} from 'lucide-react'
import { getProducts } from '../lib/supabase'
import { formatPrice, truncateText } from '../utils/helpers'

const categoryIcons = {
  'Live Casino': Dices,
  'Slots': Gamepad2,
  'Table Games': Trophy,
  'Payments': CreditCard,
  'Analytics': BarChart3,
  'RNG': Code,
  Default: Code,
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Live Casino', 'Slots', 'Table Games', 'Payments', 'RNG']

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await getProducts()
      if (!error && data) {
        setProducts(data)
      } else {
        // Default casino gaming products if fetch fails
        setProducts([
          {
            id: 1,
            name: 'Live Dealer API',
            description: 'Real-time streaming of Blackjack, Roulette, Baccarat, and Poker with professional dealers. HD video with sub-100ms latency.',
            category: 'Live Casino',
            price: 499,
            requests: '100,000',
            rating: 4.9,
            features: ['50+ Live Tables', 'Multi-language Dealers', 'HD Streaming', 'Bet Behind'],
          },
          {
            id: 2,
            name: 'Slots Aggregator API',
            description: 'Access 1000+ slot games from NetEnt, Pragmatic Play, Microgaming, and more through a single integration.',
            category: 'Slots',
            price: 299,
            requests: '500,000',
            rating: 4.8,
            features: ['1000+ Games', 'Jackpot Networks', 'Bonus Features', 'Mobile Optimized'],
          },
          {
            id: 3,
            name: 'Certified RNG Engine',
            description: 'GLI and eCOGRA certified random number generator for slots, table games, and lottery systems.',
            category: 'RNG',
            price: 199,
            requests: 'Unlimited',
            rating: 5.0,
            features: ['GLI Certified', 'eCOGRA Approved', 'Provably Fair', 'Audit Logs'],
          },
          {
            id: 4,
            name: 'Casino Wallet API',
            description: 'Unified wallet system supporting crypto, fiat, and all major payment processors with instant deposits/withdrawals.',
            category: 'Payments',
            price: 399,
            requests: 'Unlimited',
            rating: 4.9,
            features: ['Crypto Support', 'Multi-currency', 'Instant Withdrawals', 'KYC Integration'],
          },
          {
            id: 5,
            name: 'Tournament Engine',
            description: 'Complete tournament management system with leaderboards, prize pools, and automated payouts.',
            category: 'Table Games',
            price: 249,
            requests: '50,000',
            rating: 4.7,
            features: ['Leaderboards', 'Prize Pools', 'Auto Payouts', 'Multi-game Support'],
          },
          {
            id: 6,
            name: 'Virtual Sports API',
            description: '24/7 virtual sports betting with realistic odds and instant results. Horse racing, football, and more.',
            category: 'Live Casino',
            price: 349,
            requests: '200,000',
            rating: 4.8,
            features: ['24/7 Events', 'Realistic Odds', 'Instant Results', 'Multiple Sports'],
          },
        ])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={clsx('min-h-screen', 'bg-dark-900', 'pt-24', 'pb-16')}>
      <div className="section-padding">
        <div className={clsx('max-w-7xl', 'mx-auto')}>
          {/* Header */}
          <div className="mb-12">
            <h1 className={clsx('text-3xl', 'lg:text-4xl', 'font-bold', 'text-white', 'mb-4')}>
              Casino Gaming <span className="gradient-text">APIs</span>
            </h1>
            <p className={clsx('text-gray-400', 'max-w-2xl')}>
              Premium casino gaming APIs for iGaming operators. From live dealer games to RNG systems, 
              everything you need to launch or upgrade your casino platform.
            </p>
          </div>

          {/* Filters */}
          <div className={clsx('flex', 'flex-col', 'md:flex-row', 'gap-4', 'mb-8')}>
            {/* Search */}
            <div className={clsx('relative', 'flex-1')}>
              <Search className={clsx('absolute', 'left-4', 'top-1/2', '-translate-y-1/2', 'w-5', 'h-5', 'text-gray-400')} />
              <input
                type="text"
                placeholder="Search casino gaming APIs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={clsx('w-full', 'pl-12', 'pr-4', 'py-3', 'bg-dark-700', 'border', 'border-dark-400', 'rounded-xl', 'text-white', 'placeholder-gray-500', 'focus:outline-none', 'focus:border-primary-500', 'transition-colors')}
              />
            </div>

            {/* Category Filter */}
            <div className={clsx('flex', 'items-center', 'gap-2', 'overflow-x-auto', 'scrollbar-hide', 'pb-2', 'md:pb-0')}>
              <Filter className={clsx('w-5', 'h-5', 'text-gray-400', 'flex-shrink-0')} />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className={clsx('flex', 'items-center', 'justify-center', 'py-20')}>
              <div className={clsx('w-8', 'h-8', 'border-2', 'border-primary-500', 'border-t-transparent', 'rounded-full', 'animate-spin')} />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={clsx('text-center', 'py-20')}>
              <p className="text-gray-400">No APIs found matching your criteria.</p>
            </div>
          ) : (
            <div className={clsx('grid', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-6')}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const ProductCard = ({ product }) => {
  const Icon = categoryIcons[product.category] || categoryIcons.Default

  return (
    <div className={clsx('group', 'glass-card-hover', 'p-6', 'flex', 'flex-col', 'h-full')}>
      {/* Header */}
      <div className={clsx('flex', 'items-start', 'justify-between', 'mb-4')}>
        <div className={clsx('w-12', 'h-12', 'bg-gradient-to-br', 'from-primary-500/20', 'to-accent-cyan/20', 'rounded-xl', 'flex', 'items-center', 'justify-center', 'group-hover:from-primary-500/30', 'group-hover:to-accent-cyan/30', 'transition-all')}>
          <Icon className={clsx('w-6', 'h-6', 'text-primary-400')} />
        </div>
        <div className={clsx('flex', 'items-center', 'gap-1', 'px-2', 'py-1', 'bg-dark-600', 'rounded-lg')}>
          <Star className={clsx('w-3', 'h-3', 'text-yellow-400', 'fill-current')} />
          <span className={clsx('text-xs', 'text-gray-400')}>{product.rating || 4.8}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <span className={clsx('text-xs', 'text-primary-400', 'font-medium', 'uppercase', 'tracking-wider')}>
          {product.category}
        </span>
        <h3 className={clsx('text-lg', 'font-bold', 'text-white', 'mt-1', 'mb-2', 'group-hover:text-primary-400', 'transition-colors')}>
          {product.name}
        </h3>
        <p className={clsx('text-gray-400', 'text-sm', 'mb-4')}>
          {truncateText(product.description, 100)}
        </p>

        {/* Features */}
        <div className={clsx('space-y-1', 'mb-4')}>
          {(product.features || []).slice(0, 3).map((feature, i) => (
            <div key={i} className={clsx('flex', 'items-center', 'gap-2', 'text-xs', 'text-gray-500')}>
              <Shield className={clsx('w-3', 'h-3', 'text-accent-green')} />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className={clsx('pt-4', 'border-t', 'border-dark-400/30')}>
        <div className={clsx('flex', 'items-center', 'justify-between', 'mb-3')}>
          <div className={clsx('flex', 'items-baseline', 'gap-1')}>
            <span className={clsx('text-xl', 'font-bold', 'text-white')}>
              {formatPrice(product.price || 29)}
            </span>
            <span className={clsx('text-xs', 'text-gray-400')}>/mo</span>
          </div>
          <span className={clsx('text-xs', 'text-gray-400')}>
            {product.requests || '10,000'} req
          </span>
        </div>
        <Link
          to={`/products/${product.id}`}
          className={clsx('btn-primary', 'w-full', 'text-center', 'text-sm', 'py-2.5', 'flex', 'items-center', 'justify-center', 'gap-2')}
        >
          View Details
          <ArrowRight className={clsx('w-4', 'h-4')} />
        </Link>
      </div>
    </div>
  )
}

export default Products
