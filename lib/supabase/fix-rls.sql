-- Fix untuk "Database error creating new user"
-- Jalankan ini di Supabase SQL Editor

-- 1. Drop recursive policy (jika ada)
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;

-- 2. Add INSERT policy untuk profiles
DROP POLICY IF EXISTS "Allow profile creation" ON profiles;
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (true);

-- 3. OPTIONAL: Disable trigger jika masih bermasalah
-- (Kita sekarang create profile manual di server action)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
