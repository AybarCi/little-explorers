-- Supervisors table for admin panel authentication
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS supervisors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create initial admin user
-- Username: admin
-- Email: admin@kucuk-kasif.com
-- Password: Ca1122335544 (stored as plain text for simplicity, in production use proper hashing)
INSERT INTO supervisors (email, username, password_hash, is_active)
VALUES ('admin@kucuk-kasif.com', 'admin', 'Ca1122335544', true)
ON CONFLICT (email) DO NOTHING;

-- Enable RLS
ALTER TABLE supervisors ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated users (anon key can read)
CREATE POLICY "Allow read access for supervisors" ON supervisors
    FOR SELECT USING (true);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_supervisors_username ON supervisors(username);
CREATE INDEX IF NOT EXISTS idx_supervisors_email ON supervisors(email);
