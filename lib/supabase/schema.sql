-- Schema for MaduraDev Dashboard
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  format TEXT NOT NULL CHECK (format IN ('workshop', 'bincang-bincang', 'bootcamp', 'webinar')),
  description_small TEXT NOT NULL,
  description TEXT DEFAULT '',
  location TEXT DEFAULT '',
  event_date TEXT NOT NULL,
  event_time TEXT NOT NULL,
  url TEXT,
  is_online BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core Team table
CREATE TABLE IF NOT EXISTS core_team (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  description TEXT,
  instagram TEXT,
  linkedin TEXT,
  avatar_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_is_published ON events(is_published);
CREATE INDEX IF NOT EXISTS idx_core_team_order ON core_team(order_index);
CREATE INDEX IF NOT EXISTS idx_core_team_is_active ON core_team(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_team ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read published events
CREATE POLICY "Public can read published events" ON events
  FOR SELECT USING (is_published = true);

-- Policy: Authenticated users can do everything with events
CREATE POLICY "Authenticated users can manage events" ON events
  FOR ALL USING (auth.role() = 'authenticated');

-- Policy: Everyone can read active core team members
CREATE POLICY "Public can read active team members" ON core_team
  FOR SELECT USING (is_active = true);

-- Policy: Authenticated users can do everything with core team
CREATE POLICY "Authenticated users can manage team" ON core_team
  FOR ALL USING (auth.role() = 'authenticated');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_core_team_updated_at ON core_team;
CREATE TRIGGER update_core_team_updated_at
  BEFORE UPDATE ON core_team
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'core_team' CHECK (role IN ('admin', 'core_team')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add user_id to core_team (link member to their auth account)
ALTER TABLE core_team ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES profiles(id);
CREATE INDEX IF NOT EXISTS idx_core_team_user ON core_team(user_id);

-- Profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow INSERT for new user creation (used by trigger)
CREATE POLICY "Allow profile creation" ON profiles
  FOR INSERT WITH CHECK (true);

-- Note: Admin operations (reading all profiles) use service_role client which bypasses RLS

-- Auto-create profile on signup (trigger)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, role) VALUES (NEW.id, 'core_team');
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update events RLS: only admins can manage
DROP POLICY IF EXISTS "Authenticated users can manage events" ON events;
CREATE POLICY "Admins can manage events" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Update core_team RLS: admins manage, members edit own profile
DROP POLICY IF EXISTS "Authenticated users can manage team" ON core_team;
CREATE POLICY "Admins can manage team" ON core_team
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Members can update own team profile" ON core_team
  FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Members can read own team profile" ON core_team
  FOR SELECT USING (user_id = auth.uid());

-- Storage bucket for images (run separately in Storage settings)
-- Create a bucket named 'images' with public access
