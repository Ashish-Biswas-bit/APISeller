import React from 'react'
import HeroSection from '../components/hero/HeroSection'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import FeaturesSection from '../components/sections/FeaturesSection'
import HowItWorks from '../components/sections/HowItWorks'
import Testimonials from '../components/sections/Testimonials'
import PricingPreview from '../components/sections/PricingPreview'
import CTASection from '../components/sections/CTASection'

const Home = () => {
  return (
    <div className="min-h-screen bg-dark-900">
      <HeroSection />
      <FeaturedProducts />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <PricingPreview />
      <CTASection />
    </div>
  )
}

export default Home
