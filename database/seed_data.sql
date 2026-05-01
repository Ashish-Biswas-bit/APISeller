-- Seed Data for CasinoHub Platform
-- Run this after schema.sql to populate sample data

-- Insert Casino Gaming Products
INSERT INTO products (name, description, category, price, requests_included, rate_limit, features, endpoints, is_active, sales_count, original_api_url) VALUES
(
  'Live Dealer API',
  'Real-time streaming of Blackjack, Roulette, Baccarat, and Poker with professional dealers. HD video with sub-100ms latency. Multi-language support and 50+ live tables.',
  'Live Casino',
  49900, -- $499.00 in cents
  100000,
  1000,
  '["50+ Live Tables", "HD Streaming", "Multi-language Dealers", "Bet Behind", "Side Bets", "Mobile Optimized"]',
  '["/casino/games", "/casino/bet", "/casino/results"]',
  true,
  45,
  'https://api.evolutiongaming.com/v1'
),
(
  'Slots Aggregator API',
  'Access 1000+ slot games from NetEnt, Pragmatic Play, Microgaming, Playtech, and more through a single integration. Includes jackpot networks and bonus features.',
  'Slots',
  29900, -- $299.00 in cents
  500000,
  2000,
  '["1000+ Games", "Jackpot Networks", "Bonus Features", "Free Spins", "Mobile Ready", "Tournament Support"]',
  '["/slots/list", "/slots/spin", "/slots/jackpots"]',
  true,
  128,
  'https://api.pragmaticplay.com/v2'
),
(
  'Certified RNG Engine',
  'GLI-19 v2.0 and eCOGRA certified random number generator for slots, table games, and lottery systems. Provably fair with full audit trail.',
  'RNG',
  19900, -- $199.00 in cents
  1000000,
  5000,
  '["GLI Certified", "eCOGRA Approved", "Provably Fair", "Audit Logs", "SHA-256 Seeds", "Client Verification"]',
  '["/casino/rng", "/rng/verify", "/rng/audit"]',
  true,
  89,
  'https://api.gli-rng.com/v1'
),
(
  'Casino Wallet API',
  'Unified wallet system supporting crypto (BTC, ETH, USDT) and fiat (USD, EUR, GBP) with instant deposits and withdrawals. KYC integration included.',
  'Payments',
  39900, -- $399.00 in cents
  10000000,
  10000,
  '["Crypto Support", "Multi-currency", "Instant Withdrawals", "KYC Integration", "Fraud Detection", "Transaction History"]',
  '["/wallet/balance", "/wallet/deposit", "/wallet/withdraw", "/wallet/history"]',
  true,
  67,
  'https://api.paymentgateway.com/casino'
),
(
  'Tournament Engine',
  'Complete tournament management system with leaderboards, prize pools, automated payouts, and multi-game support. Perfect for casino promotions.',
  'Table Games',
  24900, -- $249.00 in cents
  50000,
  500,
  '["Leaderboards", "Prize Pools", "Auto Payouts", "Multi-game Support", "Scheduled Tournaments", "Real-time Stats"]',
  '["/tournaments/list", "/tournaments/join", "/tournaments/leaderboard"]',
  true,
  34,
  'https://api.tournamentengine.com/v1'
),
(
  'Virtual Sports API',
  '24/7 virtual sports betting with realistic odds and instant results. Includes horse racing, football, tennis, and greyhound racing.',
  'Live Casino',
  34900, -- $349.00 in cents
  200000,
  1500,
  '["24/7 Events", "Realistic Odds", "Instant Results", "Multiple Sports", "Live Commentary", "Bet Builder"]',
  '["/virtual/events", "/virtual/odds", "/virtual/results"]',
  true,
  56,
  'https://api.virtualsports.com/v1'
),
(
  'Sportsbook API',
  'Comprehensive sports betting API covering 30+ sports with live odds, in-play betting, and cash out features. Pre-match and live markets.',
  'Sports',
  44900, -- $449.00 in cents
  300000,
  2000,
  '["30+ Sports", "Live Odds", "In-play Betting", "Cash Out", "Bet Builder", "Streaming Integration"]',
  '["/sports/events", "/sports/odds", "/sports/bet", "/sports/cashout"]',
  true,
  23,
  'https://api.sportsbookprovider.com/v2'
),
(
  'Fraud Detection API',
  'AI-powered fraud detection and player behavior analysis. Identifies collusion, bonus abuse, and suspicious betting patterns in real-time.',
  'Security',
  29900, -- $299.00 in cents
  100000,
  500,
  '["Real-time Detection", "Behavior Analysis", "Collusion Detection", "Bonus Abuse Prevention", "Risk Scoring", "Automated Alerts"]',
  '["/fraud/check", "/fraud/report", "/fraud/risk-score"]',
  true,
  41,
  'https://api.frauddetect.com/v1'
);

-- Insert sample API services for proxy
INSERT INTO api_services (name, slug, base_url, api_key, description, is_active) VALUES
(
  'Evolution Gaming Live Casino',
  'evolution-live',
  'https://api.evolutiongaming.com/v1',
  'enc_evolution_api_key_here',
  'Live dealer games from Evolution Gaming',
  true
),
(
  'Pragmatic Play Slots',
  'pragmatic-slots',
  'https://api.pragmaticplay.com/v2',
  'enc_pragmatic_api_key_here',
  'Slot games from Pragmatic Play',
  true
),
(
  'NetEnt Games',
  'netent-games',
  'https://api.netent.com/v1',
  'enc_netent_api_key_here',
  'Premium slot and table games from NetEnt',
  true
),
(
  'GLI Certified RNG',
  'gli-rng',
  'https://api.gli-rng.com/v1',
  'enc_gli_rng_key_here',
  'Certified random number generator',
  true
);

-- Note: Users and API keys should be created through the application
-- This ensures proper auth integration and key generation
