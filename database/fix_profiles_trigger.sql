-- Fix: Auto-create profiles when users sign up
-- Run this in Supabase SQL Editor

-- 1. First, create the missing profiles for existing users
INSERT INTO profiles (id, email, full_name, role, created_at)
SELECT 
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)) as full_name,
  'user' as role,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- 2. Create a function to auto-insert profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'user',
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger (drop if exists first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verify all users now have profiles
SELECT 
  'Total auth users' as metric, 
  COUNT(*) as count 
FROM auth.users
UNION ALL
SELECT 
  'Total profiles' as metric, 
  COUNT(*) as count 
FROM profiles;

-- 5. Show all profiles with their roles
SELECT email, full_name, role, created_at 
FROM profiles 
ORDER BY created_at DESC;
