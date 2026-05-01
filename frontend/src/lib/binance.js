// Binance Pay API Client
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const createBinanceOrder = async (productId, userId, userEmail) => {
  try {
    const response = await fetch(`${API_URL}/binance/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        user_id: userId,
        user_email: userEmail
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create order')
    }

    return await response.json()
  } catch (error) {
    console.error('Binance order creation error:', error)
    throw error
  }
}

export const checkOrderStatus = async (orderId) => {
  try {
    const response = await fetch(`${API_URL}/binance/order-status/${orderId}`)
    
    if (!response.ok) {
      throw new Error('Failed to check order status')
    }

    return await response.json()
  } catch (error) {
    console.error('Order status check error:', error)
    throw error
  }
}

export const getBinanceMerchantInfo = async () => {
  try {
    const response = await fetch(`${API_URL}/binance/merchant-info`)
    return await response.json()
  } catch (error) {
    console.error('Failed to get merchant info:', error)
    return null
  }
}

// Poll order status until completed or timeout
export const pollOrderStatus = async (orderId, onStatusChange, maxAttempts = 60) => {
  let attempts = 0
  
  const poll = async () => {
    try {
      const status = await checkOrderStatus(orderId)
      
      onStatusChange(status)
      
      // Stop polling if completed, failed, or expired
      if (status.status === 'completed' || status.status === 'failed' || status.status === 'expired') {
        return status
      }
      
      attempts++
      if (attempts >= maxAttempts) {
        throw new Error('Payment timeout')
      }
      
      // Poll every 3 seconds
      setTimeout(poll, 3000)
      
    } catch (error) {
      onStatusChange({ error: error.message })
    }
  }
  
  poll()
}
