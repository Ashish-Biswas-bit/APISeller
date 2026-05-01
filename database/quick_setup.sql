-- Quick Setup - Run this if you get "already exists" errors

-- 1. Check what tables exist (run this first to verify)
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Insert sample products (only if products table exists)
INSERT INTO products (name, description, category, price, requests_included, rate_limit, features, endpoints, is_active, sales_count) 
SELECT name, description, category, price, requests_included, rate_limit, 
       features::jsonb, endpoints::jsonb, is_active, sales_count 
FROM (VALUES
  ('Live Dealer API', 'Real-time streaming of Blackjack, Roulette, Baccarat, and Poker with professional dealers. HD video with sub-100ms latency.', 'Live Casino', 49900, 100000, 1000, '["50+ Live Tables", "HD Streaming", "Multi-language Dealers", "Bet Behind", "Side Bets"]', '["/casino/games", "/casino/bet", "/casino/results"]', true, 45),
  ('Slots Aggregator API', 'Access 1000+ slot games from NetEnt, Pragmatic Play, Microgaming through a single integration.', 'Slots', 29900, 500000, 2000, '["1000+ Games", "Jackpot Networks", "Bonus Features", "Free Spins", "Mobile Ready"]', '["/slots/list", "/slots/spin", "/slots/jackpots"]', true, 128),
  ('Certified RNG Engine', 'GLI-19 v2.0 and eCOGRA certified random number generator for slots and table games.', 'RNG', 19900, 1000000, 5000, '["GLI Certified", "eCOGRA Approved", "Provably Fair", "Audit Logs", "SHA-256 Seeds"]', '["/casino/rng", "/rng/verify", "/rng/audit"]', true, 89),
  ('Casino Wallet API', 'Unified wallet system supporting crypto and fiat with instant deposits and withdrawals.', 'Payments', 39900, 10000000, 10000, '["Crypto Support", "Multi-currency", "Instant Withdrawals", "KYC Integration", "Fraud Detection"]', '["/wallet/balance", "/wallet/deposit", "/wallet/withdraw"]', true, 67),
  ('Tournament Engine', 'Complete tournament management system with leaderboards, prize pools, automated payouts.', 'Table Games', 24900, 50000, 500, '["Leaderboards", "Prize Pools", "Auto Payouts", "Multi-game Support", "Real-time Stats"]', '["/tournaments/list", "/tournaments/join", "/tournaments/leaderboard"]', true, 34),
  ('Virtual Sports API', '24/7 virtual sports betting with realistic odds and instant results.', 'Live Casino', 34900, 200000, 1500, '["24/7 Events", "Realistic Odds", "Instant Results", "Multiple Sports", "Bet Builder"]', '["/virtual/events", "/virtual/odds", "/virtual/results"]', true, 56)
) AS v(name, description, category, price, requests_included, rate_limit, features, endpoints, is_active, sales_count)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = v.name);

-- 3. Verify data was inserted
SELECT COUNT(*) as total_products FROM products;
SELECT name, category, price/100 as price_usd FROM products LIMIT 5;
