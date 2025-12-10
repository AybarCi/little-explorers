-- Avatar Shop System Migration
-- Created: 2024-12-10

-- =====================================================
-- AVATARS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT,                    -- For emoji avatars
  image_key TEXT,                -- For premium image avatars (asset key)
  category TEXT NOT NULL,        -- 'emoji', 'premium', 'seasonal'
  rarity TEXT DEFAULT 'common',  -- 'common', 'rare', 'epic', 'legendary'
  price INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- FRAMES TABLE  
-- =====================================================
CREATE TABLE IF NOT EXISTS frames (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color_primary TEXT NOT NULL,   -- Primary color
  color_secondary TEXT,          -- Secondary color for gradients
  style TEXT DEFAULT 'solid',    -- 'solid', 'gradient'
  rarity TEXT DEFAULT 'common',
  price INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BADGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT,
  rarity TEXT DEFAULT 'common',
  price INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- USER INVENTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL,       -- 'avatar', 'frame', 'badge'
  item_id UUID NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_type, item_id)
);

-- =====================================================
-- ADD COLUMNS TO USERS TABLE
-- =====================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_avatar_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_frame_id UUID;
ALTER TABLE users ADD COLUMN IF NOT EXISTS current_badge_id UUID;

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_inventory_user_id ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_avatars_category ON avatars(category);
CREATE INDEX IF NOT EXISTS idx_avatars_rarity ON avatars(rarity);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE frames ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;

-- Avatars, frames, badges are readable by all authenticated users
CREATE POLICY "Anyone can view avatars" ON avatars FOR SELECT USING (true);
CREATE POLICY "Anyone can view frames" ON frames FOR SELECT USING (true);
CREATE POLICY "Anyone can view badges" ON badges FOR SELECT USING (true);

-- User inventory policies
CREATE POLICY "Users can view own inventory" ON user_inventory FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own inventory" ON user_inventory FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- SEED DATA: EMOJI AVATARS
-- =====================================================
INSERT INTO avatars (name, emoji, category, rarity, price, sort_order, is_default) VALUES
  ('Kedi', '🐱', 'emoji', 'common', 0, 1, true),
  ('Köpek', '🐶', 'emoji', 'common', 50, 2, false),
  ('Tavşan', '🐰', 'emoji', 'common', 50, 3, false),
  ('Ayı', '🐻', 'emoji', 'common', 50, 4, false),
  ('Tilki', '🦊', 'emoji', 'rare', 100, 5, false),
  ('Panda', '🐼', 'emoji', 'rare', 100, 6, false),
  ('Koala', '🐨', 'emoji', 'rare', 100, 7, false),
  ('Aslan', '🦁', 'emoji', 'epic', 200, 8, false),
  ('Kaplan', '🐯', 'emoji', 'epic', 200, 9, false),
  ('Ejderha', '🐉', 'emoji', 'legendary', 300, 10, false),
  ('Unicorn', '🦄', 'emoji', 'legendary', 300, 11, false);

-- =====================================================
-- SEED DATA: PREMIUM AVATARS
-- =====================================================
INSERT INTO avatars (name, image_key, category, rarity, price, sort_order) VALUES
  ('Astronot', 'astronaut', 'premium', 'epic', 400, 20),
  ('Ninja', 'ninja', 'premium', 'epic', 400, 21),
  ('Robot', 'robot', 'premium', 'legendary', 600, 22),
  ('Süper Kahraman', 'superhero', 'premium', 'legendary', 600, 23),
  ('Büyücü', 'wizard', 'premium', 'legendary', 800, 24);

-- =====================================================
-- SEED DATA: FRAMES
-- =====================================================
INSERT INTO frames (name, color_primary, color_secondary, style, rarity, price, sort_order) VALUES
  ('Mavi', '#3182CE', NULL, 'solid', 'common', 100, 1),
  ('Yeşil', '#38A169', NULL, 'solid', 'common', 100, 2),
  ('Kırmızı', '#E53E3E', NULL, 'solid', 'common', 100, 3),
  ('Mor', '#805AD5', NULL, 'solid', 'rare', 150, 4),
  ('Altın', '#D69E2E', '#F6E05E', 'gradient', 'epic', 300, 5),
  ('Gökkuşağı', '#FF6B6B', '#4ECDC4', 'gradient', 'epic', 500, 6),
  ('Ateş', '#F56565', '#ED8936', 'gradient', 'legendary', 750, 7);

-- =====================================================
-- SEED DATA: BADGES
-- =====================================================
INSERT INTO badges (name, emoji, description, rarity, price, sort_order) VALUES
  ('Yıldız', '⭐', 'Parlayan bir yıldız!', 'common', 200, 1),
  ('Ateş', '🔥', 'Ateş gibi sıcak!', 'rare', 300, 2),
  ('Şimşek', '⚡', 'Işık hızında!', 'rare', 300, 3),
  ('Kral', '👑', 'Kralların kralı!', 'epic', 400, 4),
  ('Elmas', '💎', 'Nadir ve değerli!', 'epic', 500, 5),
  ('Süper Yıldız', '🌟', 'Efsanevi parlaklık!', 'legendary', 600, 6);
