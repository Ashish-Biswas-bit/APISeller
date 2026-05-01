-- Complete Database Setup Script for CasinoHub
-- Run this in Supabase SQL Editor in order:

-- 1. First, run the main schema
\i schema.sql

-- 2. Run casino-specific tables
\i casino_tables.sql

-- 3. Seed with sample data
\i seed_data.sql

-- 4. Create a default admin user (run this after creating a user in the app)
-- Update the email to match your registered admin email
-- UPDATE profiles SET role = 'admin' WHERE email = 'admin@casinohub.com';

-- 5. Verify setup
SELECT 'Tables created successfully' as status;
SELECT COUNT(*) as product_count FROM products;
SELECT COUNT(*) as service_count FROM api_services;
