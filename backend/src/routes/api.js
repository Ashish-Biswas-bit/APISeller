import express from 'express'
import { createClient } from '@supabase/supabase-js'
import axios from 'axios'
import crypto from 'crypto'

const router = express.Router()

// Lazy-load Supabase client to ensure env vars are loaded
let supabase
const getSupabase = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

// Middleware to verify API key
const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '')
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' })
  }

  try {
    // Check if API key exists and is active
    const { data: keyData, error } = await getSupabase()
      .from('api_keys')
      .select('*, product:products(*)')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single()

    if (error || !keyData) {
      return res.status(401).json({ error: 'Invalid or inactive API key' })
    }

    // Check rate limit
    if (keyData.requests_this_minute >= keyData.rate_limit) {
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }

    // Attach API key data to request
    req.apiKeyData = keyData
    req.productData = keyData.product
    
    next()
  } catch (error) {
    console.error('API key verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Middleware to track API usage
const trackUsage = async (req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime
    
    try {
      // Update usage statistics
      await getSupabase()
        .from('api_keys')
        .update({
          requests_this_minute: req.apiKeyData.requests_this_minute + 1,
          total_requests: (req.apiKeyData.total_requests || 0) + 1,
          monthly_requests: (req.apiKeyData.monthly_requests || 0) + 1,
          last_used: new Date().toISOString()
        })
        .eq('id', req.apiKeyData.id)

      // Log the request
      await getSupabase().from('api_logs').insert([{
        api_key_id: req.apiKeyData.id,
        user_id: req.apiKeyData.user_id,
        product_id: req.apiKeyData.product_id,
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        duration,
        created_at: new Date().toISOString()
      }])
    } catch (error) {
      console.error('Usage tracking error:', error)
    }
  })
  
  next()
}

// Live Casino Games API - Get available games and table status
router.get('/casino/games', verifyApiKey, trackUsage, async (req, res) => {
  try {
    // MIDDLEMAN LOGIC: Forward to original casino game provider
    // In production, this calls the actual live casino API
    
    const mockResponse = {
      success: true,
      data: {
        games: [
          { 
            id: 'bj_live_001', 
            name: 'Live Blackjack', 
            type: 'blackjack',
            status: 'active',
            dealers: 12,
            min_bet: 5,
            max_bet: 5000,
            players_online: 234
          },
          { 
            id: 'roulette_european', 
            name: 'European Roulette', 
            type: 'roulette',
            status: 'active',
            dealers: 8,
            min_bet: 1,
            max_bet: 10000,
            players_online: 567
          },
          { 
            id: 'baccarat_standard', 
            name: 'Standard Baccarat', 
            type: 'baccarat',
            status: 'active',
            dealers: 6,
            min_bet: 10,
            max_bet: 15000,
            players_online: 189
          },
          { 
            id: 'poker_casino_holdem', 
            name: 'Casino Hold\'em', 
            type: 'poker',
            status: 'active',
            dealers: 4,
            min_bet: 5,
            max_bet: 2500,
            players_online: 98
          }
        ],
        total_tables: 30,
        processing_time: '25ms'
      },
      request_id: `req_${Date.now()}`,
      cached: false
    }

    res.json(mockResponse)
  } catch (error) {
    console.error('Casino games error:', error)
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

// Place Bet API - Process a casino bet
router.post('/casino/bet', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { game_id, player_id, bet_amount, bet_type, session_token } = req.body

    if (!game_id || !player_id || !bet_amount || !session_token) {
      return res.status(400).json({ 
        error: 'game_id, player_id, bet_amount, and session_token are required' 
      })
    }

    // MIDDLEMAN LOGIC: Forward to original casino provider
    // Validate bet, check player balance, process wager

    const mockResponse = {
      success: true,
      data: {
        bet_id: `bet_${Date.now()}`,
        game_id,
        player_id,
        bet_amount,
        bet_type: bet_type || 'standard',
        status: 'accepted',
        timestamp: new Date().toISOString(),
        session_token,
        // In a real implementation, this would include the game result
        result_pending: true,
        estimated_result_time: '3s'
      },
      request_id: `req_${Date.now()}`,
      processing_time: '45ms'
    }

    res.json(mockResponse)
  } catch (error) {
    console.error('Bet placement error:', error)
    res.status(500).json({ error: 'Bet placement failed' })
  }
})

// RNG - Generate certified random number
router.post('/casino/rng', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { game_type, seed, client_seed } = req.body

    // MIDDLEMAN LOGIC: Forward to certified RNG provider
    // In production, this connects to GLI-certified RNG servers

    // Generate provably fair random number
    const server_seed = crypto.randomBytes(32).toString('hex')
    const combined_seed = `${server_seed}:${client_seed || 'client_default'}:${Date.now()}`
    const hash = crypto.createHash('sha256').update(combined_seed).digest('hex')
    
    // Extract random values from hash
    const random_number = parseInt(hash.substring(0, 8), 16) / 0xffffffff
    
    const mockResponse = {
      success: true,
      data: {
        game_type: game_type || 'generic',
        random_number,
        server_seed_hash: crypto.createHash('sha256').update(server_seed).digest('hex'),
        client_seed: client_seed || null,
        timestamp: new Date().toISOString(),
        certified: true,
        certification: 'GLI-19 v2.0',
        provably_fair: true,
        audit_trail_id: `rng_${Date.now()}`
      },
      request_id: `req_${Date.now()}`,
      processing_time: '15ms'
    }

    res.json(mockResponse)
  } catch (error) {
    console.error('RNG generation error:', error)
    res.status(500).json({ error: 'RNG generation failed' })
  }
})

// Player Wallet - Get balance and transaction history
router.get('/casino/wallet/:player_id', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { player_id } = req.params
    
    // MIDDLEMAN LOGIC: Query original casino wallet provider

    const mockResponse = {
      success: true,
      data: {
        player_id,
        balances: {
          USD: 1250.50,
          EUR: 890.00,
          BTC: 0.025,
          ETH: 1.5
        },
        total_wagered_today: 450.00,
        total_won_today: 320.00,
        session_active: true,
        kyc_verified: true,
        vip_level: 'gold',
        transactions: [
          { id: 'tx_001', type: 'deposit', amount: 500, currency: 'USD', status: 'completed', timestamp: '2024-01-15T10:30:00Z' },
          { id: 'tx_002', type: 'bet', amount: -50, currency: 'USD', status: 'completed', timestamp: '2024-01-15T11:00:00Z' },
          { id: 'tx_003', type: 'win', amount: 120, currency: 'USD', status: 'completed', timestamp: '2024-01-15T11:02:00Z' }
        ]
      },
      request_id: `req_${Date.now()}`,
      processing_time: '35ms'
    }

    res.json(mockResponse)
  } catch (error) {
    console.error('Wallet error:', error)
    res.status(500).json({ error: 'Failed to fetch wallet data' })
  }
})

// Game Results - Get historical game results
router.get('/casino/results/:game_id', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { game_id } = req.params
    const { limit = 20 } = req.query

    // MIDDLEMAN LOGIC: Query original casino provider for game history

    const mockResponse = {
      success: true,
      data: {
        game_id,
        results: [
          { round_id: 'r_001', result: 'blackjack', dealer_hand: ['10♠', '7♦'], timestamp: '2024-01-15T11:00:00Z' },
          { round_id: 'r_002', result: 'player_win', dealer_hand: ['K♥', '5♣', '8♠'], timestamp: '2024-01-15T11:03:00Z' },
          { round_id: 'r_003', result: 'dealer_win', dealer_hand: ['A♦', '9♥'], timestamp: '2024-01-15T11:06:00Z' }
        ],
        total_rounds_today: 1458,
        rtp_today: 97.2,
        certification_verified: true
      },
      request_id: `req_${Date.now()}`,
      processing_time: '40ms'
    }

    res.json(mockResponse)
  } catch (error) {
    console.error('Game results error:', error)
    res.status(500).json({ error: 'Failed to fetch game results' })
  }
})

// Generic proxy endpoint for custom APIs
router.all('/proxy/:service/*', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { service } = req.params
    const path = req.params[0]
    
    // Get the original API configuration for this service
    const { data: serviceConfig } = await supabase
      .from('api_services')
      .select('*')
      .eq('slug', service)
      .single()

    if (!serviceConfig) {
      return res.status(404).json({ error: 'Service not found' })
    }

    // Build the original API URL
    const originalUrl = `${serviceConfig.base_url}/${path}`
    
    // Forward the request to the original API
    const response = await axios({
      method: req.method,
      url: originalUrl,
      data: req.body,
      headers: {
        'Authorization': `Bearer ${serviceConfig.api_key}`,
        'Content-Type': 'application/json',
        ...req.headers
      },
      params: req.query,
      timeout: 30000
    })

    res.status(response.status).json(response.data)
  } catch (error) {
    console.error('Proxy error:', error)
    if (error.response) {
      res.status(error.response.status).json(error.response.data)
    } else {
      res.status(500).json({ error: 'Proxy request failed' })
    }
  }
})

export default router
