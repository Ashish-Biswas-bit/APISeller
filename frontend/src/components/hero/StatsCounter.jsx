import React, { useEffect, useState, useRef } from 'react'
import { Dices, Users, Coins, Trophy } from 'lucide-react'

const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  const stats = [
    {
      icon: Dices,
      value: 50,
      suffix: '+',
      label: 'Casino Games',
      description: 'Live & virtual',
    },
    {
      icon: Users,
      value: 500,
      suffix: '+',
      label: 'Casino Operators',
      description: 'Worldwide',
    },
    {
      icon: Coins,
      value: 10,
      suffix: 'M+',
      label: 'Daily Bets',
      description: 'Processed via APIs',
    },
    {
      icon: Trophy,
      value: 99.99,
      suffix: '%',
      label: 'Uptime SLA',
      description: '24/7 availability',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const AnimatedNumber = ({ value, suffix }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let startTime = null
      const duration = 2000

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(easeOutQuart * value)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }, [isVisible, value])

    const formattedValue = value % 1 === 0 
      ? Math.round(count).toLocaleString()
      : count.toFixed(2)

    return (
      <span>
        {formattedValue}
        {suffix}
      </span>
    )
  }

  return (
    <div ref={sectionRef} className="glass-card rounded-2xl p-8 lg:p-12">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`text-center transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-dark-700 rounded-xl mb-4">
              <stat.icon className="w-6 h-6 text-primary-400" />
            </div>
            <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-medium text-gray-300 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-gray-500">
              {stat.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsCounter
