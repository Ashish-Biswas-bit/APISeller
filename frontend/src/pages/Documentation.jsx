import React, { useState } from 'react'
import { 
  Search, 
  Book, 
  Code, 
  Key, 
  Zap, 
  ChevronRight,
  Copy,
  Check,
  Terminal,
  ArrowRight
} from 'lucide-react'

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('getting-started')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(null)

  const copyCode = (id, code) => {
    navigator.clipboard.writeText(code)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const sidebarItems = [
    { id: 'getting-started', label: 'Getting Started', icon: Book },
    { id: 'authentication', label: 'Authentication', icon: Key },
    { id: 'text-analysis', label: 'Text Analysis API', icon: Code },
    { id: 'image-recognition', label: 'Image Recognition API', icon: Code },
    { id: 'data-enrichment', label: 'Data Enrichment API', icon: Code },
    { id: 'sdks', label: 'SDKs & Libraries', icon: Terminal },
    { id: 'errors', label: 'Error Handling', icon: Zap },
  ]

  const codeExamples = {
    'getting-started': `// Install the SDK
npm install @apistore/sdk

// Initialize the client
import { APIClient } from '@apistore/sdk';

const client = new APIClient({
  apiKey: 'live_your_api_key_here'
});

// Make your first API call
const result = await client.analyze({
  text: "Hello, World!"
});

console.log(result);`,
    'authentication': `// API Key Authentication
// Include your API key in the Authorization header

const headers = {
  'Authorization': 'Bearer live_your_api_key_here',
  'Content-Type': 'application/json'
};

// Example request
fetch('https://api.apistore.com/v1/analyze', {
  method: 'POST',
  headers: headers,
  body: JSON.stringify({
    text: 'Your text here',
    features: ['sentiment']
  })
});`,
    'text-analysis': `// Text Analysis API Example
const response = await fetch('https://api.apistore.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'I love this product! It is amazing!',
    features: ['sentiment', 'entities', 'keywords']
  })
});

const data = await response.json();

// Response:
// {
//   "success": true,
//   "data": {
//     "sentiment": {
//       "label": "positive",
//       "confidence": 0.94,
//       "score": 0.85
//     },
//     "entities": [...],
//     "keywords": ["love", "product", "amazing"]
//   }
// }`,
    'image-recognition': `// Image Recognition API Example
const response = await fetch('https://api.apistore.com/v1/recognize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image_url: 'https://example.com/image.jpg',
    features: ['objects', 'faces', 'labels']
  })
});

const data = await response.json();

// Response:
// {
//   "success": true,
//   "data": {
//     "objects": [
//       { "label": "person", "confidence": 0.98 },
//       { "label": "car", "confidence": 0.95 }
//     ],
//     "faces": [...],
//     "labels": ["outdoor", "vehicle"]
//   }
// }`,
    'data-enrichment': `// Data Enrichment API Example
const response = await fetch('https://api.apistore.com/v1/enrich', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer live_your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    phone: '+1234567890',
    address: '123 Main St, San Francisco, CA'
  })
});

const data = await response.json();

// Response:
// {
//   "success": true,
//   "data": {
//     "email": {
//       "valid": true,
//       "disposable": false,
//       "free_provider": true
//     },
//     "phone": {
//       "valid": true,
//       "type": "mobile",
//       "carrier": "Verizon"
//     }
//   }
// }`,
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Getting Started</h1>
              <p className="text-gray-400 text-lg">
                Welcome to the API Store documentation. This guide will help you get up and running with our APIs in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Quick Start</h2>
              <p className="text-gray-400">
                1. Sign up for a free account at <a href="/register" className="text-primary-400 hover:underline">API Store</a>
              </p>
              <p className="text-gray-400">
                2. Get your API key from the <a href="/dashboard/apis" className="text-primary-400 hover:underline">dashboard</a>
              </p>
              <p className="text-gray-400">
                3. Make your first API request using the code examples below
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Base URL</h2>
              <code className="block bg-dark-700 p-4 rounded-xl text-primary-400 font-mono">
                https://api.apistore.com/v1
              </code>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Code Example</h2>
              <div className="relative">
                <button
                  onClick={() => copyCode('getting-started', codeExamples['getting-started'])}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'getting-started' ? <Check className="w-5 h-5 text-accent-green" /> : <Copy className="w-5 h-5" />}
                </button>
                <pre className="bg-dark-700 p-6 rounded-xl overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{codeExamples['getting-started']}</code>
                </pre>
              </div>
            </div>
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Authentication</h1>
              <p className="text-gray-400 text-lg">
                All API requests require authentication using an API key. Include your key in the Authorization header.
              </p>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">API Key Format</h3>
              <code className="block bg-dark-700 p-4 rounded-xl text-primary-400 font-mono text-sm">
                Authorization: Bearer live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
              </code>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Security Best Practices</h2>
              <ul className="space-y-2 text-gray-400 list-disc list-inside">
                <li>Never expose your API key in client-side code</li>
                <li>Use environment variables to store your API key</li>
                <li>Rotate your API keys regularly</li>
                <li>Monitor your API usage for suspicious activity</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Code Example</h2>
              <div className="relative">
                <button
                  onClick={() => copyCode('auth', codeExamples['authentication'])}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  {copied === 'auth' ? <Check className="w-5 h-5 text-accent-green" /> : <Copy className="w-5 h-5" />}
                </button>
                <pre className="bg-dark-700 p-6 rounded-xl overflow-x-auto">
                  <code className="text-sm text-gray-300 font-mono">{codeExamples['authentication']}</code>
                </pre>
              </div>
            </div>
          </div>
        )

      case 'errors':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4">Error Handling</h1>
              <p className="text-gray-400 text-lg">
                The API uses standard HTTP response codes and returns detailed error messages to help you debug issues.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">HTTP Status Codes</h2>
              <div className="glass-card overflow-hidden">
                <table className="w-full">
                  <thead className="bg-dark-700">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Code</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Meaning</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-400/30">
                    {[
                      { code: '200', meaning: 'OK', desc: 'Request succeeded' },
                      { code: '400', meaning: 'Bad Request', desc: 'Invalid request format' },
                      { code: '401', meaning: 'Unauthorized', desc: 'Invalid or missing API key' },
                      { code: '429', meaning: 'Too Many Requests', desc: 'Rate limit exceeded' },
                      { code: '500', meaning: 'Server Error', desc: 'Internal server error' },
                    ].map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 px-4 text-white font-mono">{row.code}</td>
                        <td className="py-3 px-4 text-white">{row.meaning}</td>
                        <td className="py-3 px-4 text-gray-400">{row.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Error Response Format</h2>
              <pre className="bg-dark-700 p-6 rounded-xl overflow-x-auto">
                <code className="text-sm text-gray-300 font-mono">{`{
  "success": false,
  "error": {
    "code": "invalid_api_key",
    "message": "The provided API key is invalid or expired",
    "type": "authentication_error"
  }
}`}</code>
              </pre>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-4 capitalize">
                {activeSection.replace('-', ' ')}
              </h1>
              <p className="text-gray-400 text-lg">
                Documentation for the {activeSection.replace('-', ' ')} endpoint.
              </p>
            </div>

            {codeExamples[activeSection] && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Example Request</h2>
                <div className="relative">
                  <button
                    onClick={() => copyCode(activeSection, codeExamples[activeSection])}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    {copied === activeSection ? <Check className="w-5 h-5 text-accent-green" /> : <Copy className="w-5 h-5" />}
                  </button>
                  <pre className="bg-dark-700 p-6 rounded-xl overflow-x-auto">
                    <code className="text-sm text-gray-300 font-mono">{codeExamples[activeSection]}</code>
                  </pre>
                </div>
              </div>
            )}

            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-4">Endpoint</h3>
              <code className="block bg-dark-700 p-4 rounded-xl text-primary-400 font-mono text-sm">
                POST https://api.apistore.com/v1/{activeSection.replace('-', '/')}
              </code>
            </div>

            <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <Zap className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                Need help? Contact our support team at support@apistore.com
              </p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 sticky top-24">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-400 rounded-lg text-sm text-white 
                             placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                        activeSection === item.id
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-gray-400 hover:bg-dark-700 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {activeSection === item.id && (
                        <ChevronRight className="w-4 h-4 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="glass-card p-8">
                {renderContent()}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => {
                    const currentIndex = sidebarItems.findIndex(item => item.id === activeSection)
                    if (currentIndex > 0) {
                      setActiveSection(sidebarItems[currentIndex - 1].id)
                    }
                  }}
                  disabled={activeSection === sidebarItems[0].id}
                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Previous
                </button>
                <button
                  onClick={() => {
                    const currentIndex = sidebarItems.findIndex(item => item.id === activeSection)
                    if (currentIndex < sidebarItems.length - 1) {
                      setActiveSection(sidebarItems[currentIndex + 1].id)
                    }
                  }}
                  disabled={activeSection === sidebarItems[sidebarItems.length - 1].id}
                  className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Documentation
