import React from 'react'
import { 
  Zap, 
  Shield, 
  Gamepad2, 
  Code2, 
  Clock, 
  Headphones,
  ArrowRight,
  Dices,
  Coins,
  Trophy
} from 'lucide-react'

const FeaturesSection = () => {
  const features = [
    {
      icon: Dices,
      title: 'Live Casino Games',
      description: 'Access 50+ live dealer games including Blackjack, Roulette, Baccarat, and Poker with real-time streaming.',
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
    },
    {
      icon: Shield,
      title: 'Certified RNG Systems',
      description: 'GLI-certified random number generators ensuring fair play and regulatory compliance across all jurisdictions.',
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
    },
    {
      icon: Zap,
      title: 'Real-time Data Feeds',
      description: 'Sub-50ms odds updates and live game state streaming. Keep your players in sync with every action.',
      color: 'from-blue-500/20 to-cyan-500/20',
      iconColor: 'text-blue-400',
    },
    {
      icon: Coins,
      title: 'Payment Integration',
      description: 'Seamless wallet and payment APIs supporting crypto, fiat, and all major gaming payment processors.',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400',
    },
    {
      icon: Trophy,
      title: 'Tournament Engine',
      description: 'Built-in tournament management with leaderboards, prize pools, and automated payout systems.',
      color: 'from-orange-500/20 to-red-500/20',
      iconColor: 'text-orange-400',
    },
    {
      icon: Gamepad2,
      title: 'Game Aggregator',
      description: 'Single integration for 1000+ slots and table games from top providers like NetEnt, Pragmatic, and Evolution.',
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />
      
      <div className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
              <Gamepad2 className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Casino Gaming Solutions</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything for <span className="gradient-text">iGaming Success</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Complete casino gaming infrastructure from a single provider. 
              Integrate once, access everything from slots to live dealer games.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group glass-card-hover p-8"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6
                              group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              See all features
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
