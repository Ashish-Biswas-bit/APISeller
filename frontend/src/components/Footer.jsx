import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Zap, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  MapPin,
  Phone
} from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    Product: [
      { label: 'All APIs', path: '/products' },
      { label: 'Pricing', path: '/pricing' },
      { label: 'Documentation', path: '/docs' },
      { label: 'Status', path: '#' },
    ],
    Company: [
      { label: 'About', path: '#' },
      { label: 'Blog', path: '#' },
      { label: 'Careers', path: '#' },
      { label: 'Contact', path: '#' },
    ],
    Legal: [
      { label: 'Privacy', path: '#' },
      { label: 'Terms', path: '#' },
      { label: 'Security', path: '#' },
      { label: 'Cookies', path: '#' },
    ],
    Resources: [
      { label: 'API Guide', path: '/docs' },
      { label: 'SDKs', path: '#' },
      { label: 'Community', path: '#' },
      { label: 'Support', path: '#' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Mail, href: '#', label: 'Email' },
  ]

  return (
    <footer className="bg-dark-800 border-t border-dark-400/30">
      <div className="section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">API Store</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Empowering developers with powerful, reliable APIs. 
              Build the future with our comprehensive API solutions.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 glass-card flex items-center justify-center text-gray-400 
                           hover:text-primary-400 hover:border-primary-500/50 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-400/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} API Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              San Francisco, CA
            </span>
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1 (555) 123-4567
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
