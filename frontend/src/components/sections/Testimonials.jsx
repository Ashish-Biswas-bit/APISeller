import React from 'react'
import { Quote, Star, Building2, Github, Twitter } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The API Store has been a game-changer for our development team. We've reduced integration time by 70% and improved reliability significantly.",
      author: 'Sarah Chen',
      role: 'CTO at TechFlow',
      avatar: 'SC',
      rating: 5,
      company: 'Building2',
    },
    {
      quote: "Best API platform we've used. The documentation is exceptional, and the support team responds within minutes. Highly recommended!",
      author: 'Marcus Johnson',
      role: 'Lead Developer',
      avatar: 'MJ',
      rating: 5,
      company: 'Github',
    },
    {
      quote: "We migrated from another provider and couldn't be happier. The pricing is transparent, and the performance is consistently excellent.",
      author: 'Emily Rodriguez',
      role: 'Engineering Manager',
      avatar: 'ER',
      rating: 5,
      company: 'Twitter',
    },
  ]

  const companies = [
    { name: 'TechFlow', icon: Building2 },
    { name: 'GitHub', icon: Github },
    { name: 'Twitter', icon: Twitter },
    { name: 'Stripe', icon: Building2 },
    { name: 'Shopify', icon: Building2 },
    { name: 'Vercel', icon: Building2 },
  ]

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 rounded-full mb-6">
              <Star className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-400 font-medium">Testimonials</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Loved by <span className="gradient-text">Developers</span> Worldwide
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of developers and companies building with our APIs.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card-hover p-6 lg:p-8 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary-400" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trusted By */}
          <div className="text-center">
            <p className="text-gray-500 text-sm uppercase tracking-wider mb-8">
              Trusted by leading companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
              {companies.map((company, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-400 transition-colors"
                >
                  <company.icon className="w-6 h-6" />
                  <span className="font-semibold">{company.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
