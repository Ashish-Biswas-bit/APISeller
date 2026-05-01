import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, Sparkles, Zap, Shield, Gamepad2, Dices, Coins } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import CodeMockup from './CodeMockup'
import StatsCounter from './StatsCounter'

const HeroSection = () => {
  const features = [
    { icon: Zap, text: 'Real-time Data' },
    { icon: Shield, text: 'Secure Transactions' },
    { icon: Gamepad2, text: 'Live Gaming APIs' },
  ]

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <div className="relative section-padding w-full">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-gray-300">Trusted by 500+ Casino Operators</span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="text-white">Premium Casino</span>
                  <br />
                  <span className="gradient-text text-glow">Gaming APIs</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-400 max-w-xl leading-relaxed">
                  Integrate world-class casino gaming APIs. From live dealer games 
                  to RNG systems, we power the next generation of iGaming platforms.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                  Explore Gaming APIs
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-4 group">
                  <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                    <Play className="w-4 h-4 text-primary-400 fill-current" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* Features */}
              <div className="flex flex-wrap gap-6 pt-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-gray-400"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <feature.icon className="w-5 h-5 text-primary-400" />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Code Mockup */}
            <div className="relative lg:pl-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <CodeMockup />
              
              {/* Floating Stats Cards */}
              <div className="absolute -top-8 -right-4 lg:right-0 glass-card p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-green/20 rounded-xl flex items-center justify-center">
                    <Dices className="w-5 h-5 text-accent-green" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-xs text-gray-400">Casino Games</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 lg:left-0 glass-card p-4 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                    <Coins className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">99.99%</div>
                    <div className="text-xs text-gray-400">Uptime SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 lg:mt-32">
            <StatsCounter />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
    </section>
  )
}

export default HeroSection
