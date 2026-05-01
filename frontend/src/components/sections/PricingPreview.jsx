import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap } from 'lucide-react'

const PricingPreview = () => {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for learning and small projects',
      features: [
        '1,000 requests/month',
        '3 API endpoints',
        'Community support',
        'Basic analytics',
        '99.9% uptime SLA',
      ],
      cta: 'Get Started Free',
      popular: false,
    },
    {
      name: 'Pro',
      price: 29,
      description: 'For growing applications and teams',
      features: [
        '50,000 requests/month',
        'Unlimited API endpoints',
        'Priority email support',
        'Advanced analytics',
        '99.95% uptime SLA',
        'Custom webhooks',
        'Team collaboration',
      ],
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For large-scale production systems',
      features: [
        'Unlimited requests',
        'Unlimited API endpoints',
        '24/7 phone support',
        'Real-time analytics',
        '99.99% uptime SLA',
        'Dedicated infrastructure',
        'Custom contracts',
        'SSO & advanced security',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent" />

      <div className="section-padding relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
              <Zap className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Pricing</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Simple, <span className="gradient-text">Transparent</span> Pricing
            </h2>
            <p className="text-gray-400 text-lg">
              Start free, scale as you grow. No hidden fees, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card p-6 lg:p-8 relative flex flex-col ${
                  plan.popular ? 'border-primary-500/50 shadow-lg shadow-primary-glow' : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-4 py-1.5 bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full text-white text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  {plan.price !== null ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl lg:text-5xl font-bold text-white">
                        ${plan.price}
                      </span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white">Custom</div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-accent-green" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  to={plan.price === 0 ? '/register' : '/pricing'}
                  className={`text-center py-3 px-6 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-12">
            <p className="text-gray-400">
              All plans include a 14-day free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingPreview
