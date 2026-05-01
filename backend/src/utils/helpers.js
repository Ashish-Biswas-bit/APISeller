export const generateApiKey = () => {
  const prefix = 'live_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = prefix
  for (let i = 0; i < 48; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const maskApiKey = (key) => {
  if (!key || key.length < 12) return key
  return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4)
}

export const formatPrice = (cents) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100)
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
