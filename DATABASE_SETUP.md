# CasinoHub Database Setup Guide

## Overview

This guide walks you through setting up the Supabase database for the CasinoHub iGaming platform.

## Prerequisites

1. **Supabase Account** - Create at [supabase.com](https://supabase.com)
2. **New Project** - Create a new project for CasinoHub
3. **Project URL and API Keys** - Found in Project Settings > API

## Setup Steps

### 1. Create Tables (Run in order)

In your Supabase project's SQL Editor, run these files:

```sql
-- Step 1: Run the main schema
-- File: database/schema.sql
-- Creates: profiles, products, orders, api_keys, api_services, api_logs, subscriptions
```

```sql
-- Step 2: Run casino-specific tables
-- File: database/casino_tables.sql
-- Creates: game_sessions, bets, player_stats, game_providers, jackpots, promotions
```

```sql
-- Step 3: Seed sample data
-- File: database/seed_data.sql
-- Inserts: 8 casino gaming products, 4 API services
```

### 2. Environment Variables

Copy your Supabase credentials to both frontend and backend `.env` files:

**Frontend (`frontend/.env`):**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend (`backend/.env`):**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Create Admin User

1. Register a user through the application at `http://localhost:3000/register`
2. In Supabase SQL Editor, run:

```sql
-- Replace with your admin email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### 4. Verify Setup

Run these queries to verify everything is working:

```sql
-- Check products were created
SELECT name, category, price FROM products;

-- Check RLS policies are enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check indexes
SELECT indexname, indexdef FROM pg_indexes WHERE schemaname = 'public';
```

## Database Schema Overview

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles extending auth.users |
| `products` | Casino API products (Live Dealer, Slots, RNG, etc.) |
| `orders` | Customer purchases and subscriptions |
| `api_keys` | Generated API keys for accessing casino APIs |
| `subscriptions` | Stripe subscription tracking |

### Casino-Specific Tables

| Table | Purpose |
|-------|---------|
| `game_sessions` | Active player gaming sessions |
| `bets` | All casino bets with provably fair data |
| `player_stats` | Aggregated player gaming statistics |
| `game_providers` | Integrated game provider configurations |
| `jackpots` | Progressive jackpot tracking |
| `promotions` | Casino bonuses and promotions |
| `player_promotions` | Claimed player bonuses |

### Security (RLS)

All tables have Row Level Security enabled:
- Users can only see their own data
- Admins can see all data
- Products and jackpots are publicly viewable

## API Endpoints

After setup, these casino API endpoints are available:

```
GET  /api/v1/casino/games              # List available games
POST /api/v1/casino/session           # Create game session
POST /api/v1/casino/bet               # Place a bet
GET  /api/v1/casino/wallet/:player_id # Get player wallet
GET  /api/v1/casino/jackpots          # Get active jackpots
GET  /api/v1/casino/history/:player_id # Get bet history
```

## Sample Products Created

1. **Live Dealer API** - $499/mo (50+ live tables)
2. **Slots Aggregator** - $299/mo (1000+ games)
3. **Certified RNG Engine** - $199/mo (GLI certified)
4. **Casino Wallet API** - $399/mo (Crypto + fiat)
5. **Tournament Engine** - $249/mo (Leaderboards)
6. **Virtual Sports API** - $349/mo (24/7 events)
7. **Sportsbook API** - $449/mo (30+ sports)
8. **Fraud Detection** - $299/mo (AI-powered)

## Troubleshooting

### Issue: Cannot connect to Supabase
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in backend `.env`
- Ensure you're using the **service key** (not anon key) for backend

### Issue: RLS policies blocking access
- Check user is properly authenticated
- Verify `role` column is set to 'admin' for admin access

### Issue: Tables not created
- Run SQL files in correct order: schema → casino_tables → seed_data
- Check for SQL errors in Supabase SQL Editor

## Next Steps

1. ✅ Database setup complete
2. ⏭️ Set up Stripe for payments (see README.md)
3. ⏭️ Configure original casino API providers in backend `.env`
4. ⏭️ Test API endpoints with sample API key

## Support

For database issues, check Supabase logs in the Dashboard → Logs → Postgres.
