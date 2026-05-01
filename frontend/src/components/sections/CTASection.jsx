import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Rocket } from 'lucide-react'

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-accent-cyan/20" />
        <div className="absolute inset-0 bg-dark-900/80" />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-80 h-80 bg-accent-cyan/20 rounded-full blur-3xl" />

      <div className="section-padding relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 lg:p-16 text-center relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-accent-cyan/20 to-transparent rounded-full blur-2xl" />

            {/* Content */}
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-8">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm text-primary-400 font-medium">Ready to Start?</span>
              </div>

              <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                Build Something{' '}
                <span className="gradient-text">Amazing Today</span>
              </h2>

              <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
                Join thousands of developers who trust API Store for their API needs. 
                Get started in minutes with our free tier.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="btn-primary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="btn-secondary inline-flex items-center justify-center gap-2 text-lg px-8 py-4"
                >
                  <Rocket className="w-5 h-5" />
                  Explore APIs
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free forever tier
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent-green" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
