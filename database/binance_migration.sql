-- Migration: Add Binance Pay Support
-- Run this in Supabase SQL Editor

-- Add Binance-specific columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS binance_prepay_id TEXT,
ADD COLUMN IF NOT EXISTS binance_merchant_trade_no TEXT,
ADD COLUMN IF NOT EXISTS binance_transaction_id TEXT,
ADD COLUMN IF NOT EXISTS paid_amount NUMERIC,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMP WITH TIME ZONE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_binance_merchant_trade_no 
ON orders(binance_merchant_trade_no);

CREATE INDEX IF NOT EXISTS idx_orders_binance_transaction_id 
ON orders(binance_transaction_id);

-- Create function to increment product sales count
CREATE OR REPLACE FUNCTION increment_product_sales(product_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE products 
  SET sales_count = COALESCE(sales_count, 0) + 1,
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Verify migration
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'orders' 
AND column_name IN (
  'binance_prepay_id',
  'binance_merchant_trade_no', 
  'binance_transaction_id',
  'paid_amount',
  'completed_at',
  'refunded_at',
  'original_amount',
  'provider_paid'
)
ORDER BY column_name;
