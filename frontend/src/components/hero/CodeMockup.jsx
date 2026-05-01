import React, { useEffect, useState } from 'react'
import { Check, Terminal } from 'lucide-react'

const CodeMockup = () => {
  const [currentLine, setCurrentLine] = useState(0)
  const [showResponse, setShowResponse] = useState(false)

  const codeLines = [
    { text: 'import { APIClient } from "@apistore/sdk";', color: 'text-accent-pink' },
    { text: '', color: '' },
    { text: 'const client = new APIClient({', color: 'text-primary-400' },
    { text: '  apiKey: process.env.API_KEY', color: 'text-gray-400' },
    { text: '});', color: 'text-primary-400' },
    { text: '', color: '' },
    { text: '// Make a request', color: 'text-gray-500' },
    { text: 'const data = await client.analyze({', color: 'text-primary-400' },
    { text: '  text: "Hello, World!"', color: 'text-accent-green' },
    { text: '});', color: 'text-primary-400' },
    { text: '', color: '' },
    { text: 'console.log(data.result);', color: 'text-primary-400' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLine((prev) => {
        if (prev >= codeLines.length) {
          setTimeout(() => setShowResponse(true), 500)
          return prev
        }
        return prev + 1
      })
    }, 200)

    const resetInterval = setInterval(() => {
      setCurrentLine(0)
      setShowResponse(false)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearInterval(resetInterval)
    }
  }, [])

  const responseData = {
    sentiment: 'positive',
    confidence: 0.94,
    keywords: ['hello', 'world'],
    processing_time: '45ms'
  }

  return (
    <div className="relative w-full max-w-lg animate-float">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-accent-cyan/20 rounded-3xl blur-2xl" />
      
      <div className="relative glass-card rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-dark-700/50 border-b border-dark-400/30">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-dark-600 rounded-lg">
            <Terminal className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-mono">example.js</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 font-mono text-sm bg-dark-800/50">
          <div className="space-y-1">
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`flex transition-all duration-300 ${
                  index < currentLine ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <span className="text-gray-600 w-8 text-right mr-4 select-none">
                  {index + 1}
                </span>
                <span className={line.color || 'text-gray-300'}>
                  {line.text}
                </span>
              </div>
            ))}
          </div>

          {/* Response Preview */}
          <div
            className={`mt-4 pt-4 border-t border-dark-400/30 transition-all duration-500 ${
              showResponse ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center gap-2 text-accent-green mb-2">
              <Check className="w-4 h-4" />
              <span className="text-xs font-medium">Request successful (200 OK)</span>
            </div>
            <div className="bg-dark-700/50 rounded-lg p-3 font-mono text-xs">
              <pre className="text-gray-300">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-800 to-transparent pointer-events-none" />
      </div>
    </div>
  )
}

export default CodeMockup
