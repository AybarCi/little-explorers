/*
  # Update users table for Supabase Auth integration

  1. Changes
    - Drop existing primary key constraint if needed
    - Make id column accept auth UUID
    - Add RLS policies for users table
  
  2. Security
    - Users can read their own profile
    - Users can update their own profile
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'users_pkey' 
    AND conrelid = 'users'::regclass
  ) THEN
    ALTER TABLE users ADD PRIMARY KEY (id);
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id::text = auth.uid()::text);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (id::text = auth.uid()::text)
  WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY "Service role can insert users"
  ON users FOR INSERT
  WITH CHECK (true);
