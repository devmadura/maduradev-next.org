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

-- Storage bucket for images (run separately in Storage settings)
-- Create a bucket named 'images' with public access
