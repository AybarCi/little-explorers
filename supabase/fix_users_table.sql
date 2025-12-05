-- ===========================================
-- USERS TABLOSU GÜNCELLEME
-- ===========================================

-- Eksik kolonları ekle
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age_group text DEFAULT '8-10';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS completed_games_count integer DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_game_played_at timestamptz;

-- RLS politikalarını güncelle
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Service role can manage users" ON users;

CREATE POLICY "Users can read own profile" 
  ON users FOR SELECT 
  TO authenticated 
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" 
  ON users FOR UPDATE 
  TO authenticated 
  USING (id = auth.uid());

CREATE POLICY "Service role can manage users" 
  ON users FOR ALL 
  TO service_role 
  USING (true);

-- Kolonları kontrol et
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users';
