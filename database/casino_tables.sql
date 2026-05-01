-- Additional Casino Gaming Specific Tables
-- Run this after schema.sql for extended casino functionality

-- Game Sessions table - Track active player sessions
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  game_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'suspended')),
  ip_address TEXT,
  user_agent TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  total_bets INTEGER DEFAULT 0,
  total_wagered DECIMAL(15,2) DEFAULT 0,
  total_won DECIMAL(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bets table - Track all casino bets
CREATE TABLE IF NOT EXISTS bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES game_sessions(id) ON DELETE SET NULL,
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  game_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  bet_id TEXT UNIQUE NOT NULL,
  bet_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  bet_type TEXT,
  odds DECIMAL(10,4),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'won', 'lost', 'cancelled')),
  result TEXT,
  win_amount DECIMAL(15,2) DEFAULT 0,
  server_seed TEXT,
  client_seed TEXT,
  nonce INTEGER,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player Stats table - Aggregated player gaming statistics
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_bets INTEGER DEFAULT 0,
  total_wagered DECIMAL(15,2) DEFAULT 0,
  total_won DECIMAL(15,2) DEFAULT 0,
  total_deposits DECIMAL(15,2) DEFAULT 0,
  total_withdrawals DECIMAL(15,2) DEFAULT 0,
  favorite_game_type TEXT,
  last_session_at TIMESTAMP WITH TIME ZONE,
  vip_level TEXT DEFAULT 'bronze' CHECK (vip_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  loyalty_points INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Game Providers table - Track integrated game providers
CREATE TABLE IF NOT EXISTS game_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  api_base_url TEXT NOT NULL,
  api_key TEXT NOT NULL, -- encrypted
  provider_type TEXT NOT NULL CHECK (provider_type IN ('live', 'slots', 'table', 'virtual', 'sports')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  game_count INTEGER DEFAULT 0,
  popular_games JSONB DEFAULT '[]',
  rtp_average DECIMAL(5,2),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jackpots table - Track progressive jackpots
CREATE TABLE IF NOT EXISTS jackpots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  game_ids JSONB NOT NULL, -- array of game IDs contributing to jackpot
  jackpot_type TEXT NOT NULL CHECK (jackpot_type IN ('daily', 'weekly', 'progressive', 'must_drop')),
  seed_amount DECIMAL(15,2) NOT NULL,
  current_amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  last_won_at TIMESTAMP WITH TIME ZONE,
  last_won_by UUID REFERENCES profiles(id),
  last_won_amount DECIMAL(15,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'reset')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promotions table - Casino bonuses and promotions
CREATE TABLE IF NOT EXISTS promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  promotion_type TEXT NOT NULL CHECK (promotion_type IN ('welcome_bonus', 'deposit_bonus', 'free_spins', 'cashback', 'tournament', 'loyalty')),
  bonus_amount DECIMAL(15,2),
  bonus_percentage INTEGER,
  max_bonus DECIMAL(15,2),
  wagering_requirements INTEGER, -- x times
  min_deposit DECIMAL(15,2),
  eligible_games JSONB DEFAULT '[]',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player Promotions table - Track claimed bonuses
CREATE TABLE IF NOT EXISTS player_promotions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE NOT NULL,
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bonus_amount DECIMAL(15,2),
  wagering_required DECIMAL(15,2),
  wagering_completed DECIMAL(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(player_id, promotion_id)
);

-- RLS Policies for new tables

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sessions" 
  ON game_sessions FOR SELECT USING (
    player_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bets" 
  ON bets FOR SELECT USING (
    player_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own stats" 
  ON player_stats FOR SELECT USING (
    player_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE game_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Providers viewable by everyone" 
  ON game_providers FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can modify providers" 
  ON game_providers FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE jackpots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jackpots viewable by everyone" 
  ON jackpots FOR SELECT USING (TRUE);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Promotions viewable by everyone" 
  ON promotions FOR SELECT USING (TRUE);
CREATE POLICY "Only admins can modify promotions" 
  ON promotions FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

ALTER TABLE player_promotions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own promotions" 
  ON player_promotions FOR SELECT USING (
    player_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Functions for casino operations

-- Function to update player stats after bet
CREATE OR REPLACE FUNCTION update_player_stats_after_bet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_stats (player_id, total_bets, total_wagered, total_won, favorite_game_type)
  VALUES (NEW.player_id, 1, NEW.bet_amount, NEW.win_amount, NEW.game_type)
  ON CONFLICT (player_id) 
  DO UPDATE SET
    total_bets = player_stats.total_bets + 1,
    total_wagered = player_stats.total_wagered + NEW.bet_amount,
    total_won = player_stats.total_won + NEW.win_amount,
    favorite_game_type = CASE 
      WHEN player_stats.favorite_game_type IS NULL THEN NEW.game_type
      ELSE player_stats.favorite_game_type 
    END,
    last_session_at = NOW(),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update player stats
CREATE TRIGGER update_player_stats_trigger
  AFTER INSERT ON bets
  FOR EACH ROW EXECUTE FUNCTION update_player_stats_after_bet();

-- Function to calculate VIP level based on wagering
CREATE OR REPLACE FUNCTION calculate_vip_level(player_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  total_wagered DECIMAL;
BEGIN
  SELECT COALESCE(total_wagered, 0) INTO total_wagered
  FROM player_stats WHERE player_id = player_uuid;
  
  RETURN CASE
    WHEN total_wagered >= 1000000 THEN 'diamond'
    WHEN total_wagered >= 500000 THEN 'platinum'
    WHEN total_wagered >= 100000 THEN 'gold'
    WHEN total_wagered >= 10000 THEN 'silver'
    ELSE 'bronze'
  END;
END;
$$ LANGUAGE plpgsql;

-- Indexes for casino tables
CREATE INDEX idx_game_sessions_player_id ON game_sessions(player_id);
CREATE INDEX idx_game_sessions_status ON game_sessions(status);
CREATE INDEX idx_bets_player_id ON bets(player_id);
CREATE INDEX idx_bets_session_id ON bets(session_id);
CREATE INDEX idx_bets_status ON bets(status);
CREATE INDEX idx_bets_placed_at ON bets(placed_at);
CREATE INDEX idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX idx_player_stats_vip ON player_stats(vip_level);
