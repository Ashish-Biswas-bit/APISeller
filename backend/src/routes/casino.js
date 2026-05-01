import express from 'express'
import { createClient } from '@supabase/supabase-js'
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
    const { data: keyData, error } = await getSupabase()
      .from('api_keys')
      .select('*, product:products(*)')
      .eq('key', apiKey)
      .eq('status', 'active')
      .single()

    if (error || !keyData) {
      return res.status(401).json({ error: 'Invalid or inactive API key' })
    }

    if (keyData.requests_this_minute >= keyData.rate_limit) {
      return res.status(429).json({ error: 'Rate limit exceeded' })
    }

    req.apiKeyData = keyData
    req.productData = keyData.product
    
    next()
  } catch (error) {
    console.error('API key verification error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

// Track API usage
const trackUsage = async (req, res, next) => {
  const startTime = Date.now()
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime
    
    try {
      await getSupabase()
        .from('api_keys')
        .update({
          requests_this_minute: req.apiKeyData.requests_this_minute + 1,
          total_requests: (req.apiKeyData.total_requests || 0) + 1,
          monthly_requests: (req.apiKeyData.monthly_requests || 0) + 1,
          last_used: new Date().toISOString()
        })
        .eq('id', req.apiKeyData.id)

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

// Get available casino games
router.get('/games', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { category, provider } = req.query
    
    // In production, forward to original casino provider
    const games = [
      { id: 'bj_live_001', name: 'Live Blackjack', type: 'blackjack', category: 'live', min_bet: 5, max_bet: 5000, players: 234 },
      { id: 'roulette_eu', name: 'European Roulette', type: 'roulette', category: 'live', min_bet: 1, max_bet: 10000, players: 567 },
      { id: 'baccarat_std', name: 'Standard Baccarat', type: 'baccarat', category: 'live', min_bet: 10, max_bet: 15000, players: 189 },
      { id: 'poker_holdem', name: 'Casino Hold\'em', type: 'poker', category: 'live', min_bet: 5, max_bet: 2500, players: 98 },
      { id: 'slot_starburst', name: 'Starburst', type: 'slots', category: 'slots', provider: 'netent', rtp: 96.1 },
      { id: 'slot_wolf_gold', name: 'Wolf Gold', type: 'slots', category: 'slots', provider: 'pragmatic', rtp: 96.0 },
    ].filter(g => !category || g.category === category)
     .filter(g => !provider || g.provider === provider)

    res.json({
      success: true,
      data: { games, total: games.length },
      request_id: `req_${Date.now()}`
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games' })
  }
})

// Create game session
router.post('/session', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { player_id, game_id, currency = 'USD' } = req.body
    
    if (!player_id || !game_id) {
      return res.status(400).json({ error: 'player_id and game_id required' })
    }

    const sessionToken = `sess_${crypto.randomBytes(16).toString('hex')}`
    
    // Store session in database
    const { data: session, error } = await supabase
      .from('game_sessions')
      .insert([{
        player_id,
        game_id,
        session_token: sessionToken,
        currency,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      }])
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      data: {
        session_id: session.id,
        session_token: sessionToken,
        game_id,
        player_id,
        created_at: session.created_at
      }
    })
  } catch (error) {
    console.error('Session creation error:', error)
    res.status(500).json({ error: 'Failed to create session' })
  }
})

// Place bet
router.post('/bet', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { session_token, game_id, player_id, bet_amount, bet_type, currency = 'USD' } = req.body

    if (!session_token || !game_id || !player_id || !bet_amount) {
      return res.status(400). json({ error: 'Missing required fields' })
    }

    // Verify session
    const { data: session } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('session_token', session_token)
      .eq('status', 'active')
      .single()

    if (!session) {
      return res.status(401).json({ error: 'Invalid or expired session' })
    }

    // Generate provably fair result
    const serverSeed = crypto.randomBytes(32).toString('hex')
    const clientSeed = req.body.client_seed || 'default'
    const nonce = Date.now()
    const combined = `${serverSeed}:${clientSeed}:${nonce}`
    const hash = crypto.createHash('sha256').update(combined).digest('hex')
    
    // Determine result based on game type
    let result, winAmount = 0
    const random = parseInt(hash.substring(0, 8), 16) / 0xffffffff
    
    switch (game_id.split('_')[0]) {
      case 'bj':
        // Simulate blackjack result
        result = random > 0.45 ? 'win' : (random > 0.42 ? 'push' : 'loss')
        winAmount = result === 'win' ? bet_amount * 1.5 : (result === 'push' ? bet_amount : 0)
        break
      case 'roulette':
        result = random > 0.52 ? 'win' : 'loss'
        winAmount = result === 'win' ? bet_amount * 2 : 0
        break
      case 'slot':
        const winChance = 0.35
        result = random > (1 - winChance) ? 'win' : 'loss'
        const multiplier = [2, 3, 5, 10, 50, 100][Math.floor(Math.random() * 6)]
        winAmount = result === 'win' ? bet_amount * multiplier : 0
        break
      default:
        result = random > 0.5 ? 'win' : 'loss'
        winAmount = result === 'win' ? bet_amount * 2 : 0
    }

    // Store bet
    const betId = `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const { data: bet, error } = await supabase
      .from('bets')
      .insert([{
        session_id: session.id,
        player_id,
        api_key_id: req.apiKeyData.id,
        game_id,
        bet_id: betId,
        bet_amount,
        currency,
        bet_type: bet_type || 'standard',
        status: result === 'win' ? 'won' : 'lost',
        result,
        win_amount: winAmount,
        server_seed: serverSeed,
        client_seed: clientSeed,
        nonce,
        settled_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    // Update session stats
    await supabase
      .from('game_sessions')
      .update({
        total_bets: session.total_bets + 1,
        total_wagered: session.total_wagered + bet_amount,
        total_won: session.total_won + winAmount
      })
      .eq('id', session.id)

    res.json({
      success: true,
      data: {
        bet_id: betId,
        game_id,
        bet_amount,
        result,
        win_amount: winAmount,
        currency,
        server_seed_hash: crypto.createHash('sha256').update(serverSeed).digest('hex'),
        client_seed,
        nonce,
        timestamp: bet.created_at
      },
      provably_fair: true
    })
  } catch (error) {
    console.error('Bet error:', error)
    res.status(500).json({ error: 'Bet processing failed' })
  }
})

// Get player wallet
router.get('/wallet/:player_id', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { player_id } = req.params
    
    // Get or create player stats
    let { data: stats } = await supabase
      .from('player_stats')
      .select('*')
      .eq('player_id', player_id)
      .single()

    if (!stats) {
      const { data: newStats } = await supabase
        .from('player_stats')
        .insert([{ player_id }])
        .select()
        .single()
      stats = newStats
    }

    res.json({
      success: true,
      data: {
        player_id,
        balances: { USD: 1000.00, EUR: 0, BTC: 0.01 }, // Demo balance
        stats: {
          total_bets: stats.total_bets,
          total_wagered: stats.total_wagered,
          total_won: stats.total_won,
          vip_level: stats.vip_level,
          loyalty_points: stats.loyalty_points
        },
        session_active: true
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet' })
  }
})

// Get active jackpots
router.get('/jackpots', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { data: jackpots } = await supabase
      .from('jackpots')
      .select('*')
      .eq('status', 'active')
      .order('current_amount', { ascending: false })

    res.json({
      success: true,
      data: {
        jackpots: jackpots || [
          { id: 'jp_001', name: 'Mega Moolah', current_amount: 12500000, currency: 'USD', type: 'progressive' },
          { id: 'jp_002', name: 'Daily Drop', current_amount: 50000, currency: 'USD', type: 'daily' },
        ]
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jackpots' })
  }
})

// Get player history
router.get('/history/:player_id', verifyApiKey, trackUsage, async (req, res) => {
  try {
    const { player_id } = req.params
    const { limit = 20, offset = 0 } = req.query

    const { data: bets, count } = await supabase
      .from('bets')
      .select('*', { count: 'exact' })
      .eq('player_id', player_id)
      .order('placed_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    res.json({
      success: true,
      data: {
        bets: bets || [],
        total: count || 0,
        limit,
        offset
      }
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' })
  }
})

export default router
