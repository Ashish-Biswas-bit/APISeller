import React from 'react'
import { Link } from 'react-router-dom'
import { Check, Sparkles, Zap, ArrowRight, HelpCircle, Dices, Gamepad2, Coins } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: 0,
      description: 'Perfect for testing and development',
      icon: Zap,
      features: [
        '10,000 API requests/month',
        'Access to demo games',
        'Sandbox environment',
        'Basic RNG access',
        '99.9% uptime SLA',
        'Community support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Operator',
      price: 999,
      description: 'For licensed casino operators',
      icon: Dices,
      features: [
        '500,000 API requests/month',
        '50+ Live casino games',
        'Slots aggregator access',
        'Certified RNG engine',
        'Priority 24/7 support',
        'Compliance documentation',
        'Fraud detection tools',
        'Multi-currency support',
      ],
      cta: 'Become an Operator',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: null,
      description: 'For major gaming platforms',
      icon: Coins,
      features: [
        'Unlimited API requests',
        'All games + custom development',
        'White-label solutions',
        'Dedicated game servers',
        '99.99% uptime SLA',
        'Custom contracts & invoicing',
        'Regulatory compliance support',
        'Dedicated account manager',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Do I need a gaming license to use these APIs?',
      answer: 'Yes, our Operator and Enterprise plans require a valid gaming license from your jurisdiction. We provide compliance documentation to help with your licensing process.'
    },
    {
      question: 'How do you ensure fair gaming?',
      answer: 'All our RNG systems are GLI and eCOGRA certified. We provide provably fair algorithms, audit logs, and real-time monitoring to ensure game integrity.'
    },
    {
      question: 'Can I customize the games with my branding?',
      answer: 'Yes, Operator and Enterprise plans support white-label solutions. You can customize tables, cards, dealer uniforms, and add your own branding.'
    },
    {
      question: 'What currencies and payment methods are supported?',
      answer: 'We support 50+ fiat currencies and major cryptocurrencies. Our wallet API integrates with all major payment processors including Stripe, PayPal, and crypto wallets.'
    },
  ]

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      {/* Header */}
      <div className="section-padding mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-primary-400 font-medium">Simple Pricing</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises. 
            Cancel anytime.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="section-padding mb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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

                {/* Plan Icon & Name */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-primary-500 to-accent-cyan' 
                      : 'bg-dark-700'
                  }`}>
                    <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-white' : 'text-primary-400'}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-8">
                  {plan.price !== null ? (
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  ) : (
                    <div className="text-4xl font-bold text-white">Custom</div>
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
                  to={plan.price === 0 ? '/register' : '/register'}
                  className={`text-center py-4 px-6 rounded-xl font-medium transition-all ${
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

          {/* Free Trial Note */}
          <div className="text-center mt-12">
            <p className="text-gray-400">
              All paid plans include a 14-day free trial. No credit card required to start.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="section-padding mb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Compare <span className="gradient-text">Features</span>
          </h2>
          
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-dark-400/30">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Feature</th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-white">Starter</th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-primary-400">Pro</th>
                    <th className="text-center py-4 px-6 text-sm font-medium text-white">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-400/30">
                  {[
                    { name: 'API Requests', starter: '1,000/mo', pro: '50,000/mo', enterprise: 'Unlimited' },
                    { name: 'APIs Available', starter: '3', pro: 'All APIs', enterprise: 'All + Beta' },
                    { name: 'Support', starter: 'Community', pro: 'Priority Email', enterprise: '24/7 Phone' },
                    { name: 'Analytics', starter: 'Basic', pro: 'Advanced', enterprise: 'Real-time' },
                    { name: 'Uptime SLA', starter: '99.9%', pro: '99.95%', enterprise: '99.99%' },
                    { name: 'Team Members', starter: '1', pro: '5', enterprise: 'Unlimited' },
                    { name: 'Custom Webhooks', starter: false, pro: true, enterprise: true },
                    { name: 'SSO', starter: false, pro: false, enterprise: true },
                    { name: 'Dedicated Manager', starter: false, pro: false, enterprise: true },
                  ].map((feature, i) => (
                    <tr key={i} className="hover:bg-dark-700/30 transition-colors">
                      <td className="py-4 px-6 text-white">{feature.name}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.starter === 'boolean' ? (
                          feature.starter ? (
                            <Check className="w-5 h-5 text-accent-green mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )
                        ) : (
                          <span className="text-gray-400">{feature.starter}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.pro === 'boolean' ? (
                          feature.pro ? (
                            <Check className="w-5 h-5 text-accent-green mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )
                        ) : (
                          <span className="text-primary-400 font-medium">{feature.pro}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof feature.enterprise === 'boolean' ? (
                          feature.enterprise ? (
                            <Check className="w-5 h-5 text-accent-green mx-auto" />
                          ) : (
                            <span className="text-gray-600">—</span>
                          )
                        ) : (
                          <span className="text-gray-400">{feature.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="section-padding mb-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                    <p className="text-gray-400 text-sm">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of developers building with our APIs. 
              Start free today and upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/products" className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4">
                Explore APIs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
