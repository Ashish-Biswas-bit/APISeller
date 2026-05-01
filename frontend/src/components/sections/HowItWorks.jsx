import React from 'react'
import { UserPlus, Key, Dices, Rocket, Gamepad2, CreditCard, Zap } from 'lucide-react'

const HowItWorks = () => {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up and complete KYC verification. Get approved as a licensed casino operator.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      number: '02',
      icon: Key,
      title: 'Choose APIs',
      description: 'Select from live dealer, slots, RNG, and payment APIs that match your platform needs.',
      color: 'from-accent-cyan to-blue-500',
    },
    {
      number: '03',
      icon: Dices,
      title: 'Integrate Games',
      description: 'Use our REST APIs and SDKs to integrate casino games into your platform within days.',
      color: 'from-accent-pink to-purple-500',
    },
    {
      number: '04',
      icon: Rocket,
      title: 'Go Live',
      description: 'Launch your casino with 50+ games, 99.99% uptime, and 24/7 support.',
      color: 'from-accent-green to-emerald-500',
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-800/50" />
      
      <div className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
              <Gamepad2 className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Launch Your Casino</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              From License to <span className="gradient-text">Live Games</span> in Weeks
            </h2>
            <p className="text-gray-400 text-lg">
              Launch your iGaming platform faster with our complete casino API suite. 
              Everything you need from games to payments.
            </p>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-px">
                    <div className="w-full h-full bg-gradient-to-r from-dark-400/50 to-transparent" />
                  </div>
                )}

                <div className="glass-card p-6 lg:p-8 h-full group-hover:border-primary-500/30 transition-all duration-300">
                  {/* Number Badge */}
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} 
                                  rounded-xl text-white font-bold text-lg mb-6
                                  group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-primary-400" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
