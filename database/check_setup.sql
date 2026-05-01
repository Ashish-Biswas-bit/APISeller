-- Verify database setup - Run this in Supabase SQL Editor

-- 1. Check if tables exist
SELECT 
  table_name,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as profiles_exists,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products'
  ) as products_exists;

-- 2. Check if seed data was inserted
SELECT COUNT(*) as product_count FROM products;

-- 3. Check your profile role
SELECT email, role FROM profiles WHERE email = 'ashish44502@gmail.com';

-- 4. List all tables in public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
