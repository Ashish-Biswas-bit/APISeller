-- Migration: Add Reseller/Middleman Pricing Support
-- This enables the business model where you markup APIs from original providers

-- 1. Add new columns for reseller pricing
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS original_price INTEGER, -- Original provider price in cents
ADD COLUMN IF NOT EXISTS original_provider_name TEXT, -- Name of original API provider
ADD COLUMN IF NOT EXISTS original_product_id TEXT, -- Product ID from original provider
ADD COLUMN IF NOT EXISTS profit_margin INTEGER GENERATED ALWAYS AS (price - COALESCE(original_price, 0)) STORED;

-- 2. Update orders table to track profit
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS original_amount INTEGER, -- What we pay to provider
ADD COLUMN IF NOT EXISTS profit_amount INTEGER GENERATED ALWAYS AS (amount - COALESCE(original_amount, 0)) STORED,
ADD COLUMN IF NOT EXISTS provider_paid BOOLEAN DEFAULT FALSE; -- Track if we paid the original provider

-- 3. Create profit tracking table for detailed reporting
CREATE TABLE IF NOT EXISTS profit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  our_price INTEGER NOT NULL, -- What customer paid
  original_price INTEGER, -- What we pay to provider
  profit INTEGER NOT NULL, -- our_price - original_price
  provider_name TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_to_provider BOOLEAN DEFAULT FALSE,
  paid_date TIMESTAMP WITH TIME ZONE
);

-- 4. Create view for profit summary
CREATE OR REPLACE VIEW profit_summary AS
SELECT 
  p.id as product_id,
  p.name as product_name,
  p.original_provider_name,
  p.price as our_price,
  p.original_price,
  p.profit_margin,
  COUNT(o.id) as total_sales,
  SUM(o.amount) as total_revenue,
  SUM(o.original_amount) as total_provider_cost,
  SUM(o.profit_amount) as total_profit,
  ROUND(AVG(o.profit_amount), 2) as avg_profit_per_sale
FROM products p
LEFT JOIN orders o ON p.id = o.product_id AND o.status = 'completed'
WHERE p.original_price IS NOT NULL
GROUP BY p.id, p.name, p.original_provider_name, p.price, p.original_price, p.profit_margin;

-- 5. Sample data update (for testing)
-- Update existing products to show reseller model
UPDATE products 
SET 
  original_price = price * 0.7, -- 70% of our price goes to provider (30% profit)
  original_provider_name = CASE 
    WHEN category = 'Live Casino' THEN 'Evolution Gaming'
    WHEN category = 'Slots' THEN 'Pragmatic Play'
    WHEN category = 'RNG' THEN 'GLI Certified Labs'
    WHEN category = 'Payments' THEN 'Stripe Connect'
    ELSE 'External Provider'
  END
WHERE original_price IS NULL;

-- Verify the migration
SELECT 
  name,
  category,
  price as our_price,
  original_price,
  profit_margin,
  original_provider_name,
  ROUND((profit_margin::numeric / price * 100), 1) as profit_percentage
FROM products 
WHERE original_price IS NOT NULL
LIMIT 5;
