-- Add more emoji avatars and premium avatars
-- Emoji avatars: 25 total (14 new)
-- Premium avatars: 15 total (10 new)

-- =====================================================
-- NEW EMOJI AVATARS (14 new ones)
-- =====================================================
INSERT INTO avatars (name, emoji, category, rarity, price, sort_order, is_default) VALUES
  ('Fil', '🐘', 'emoji', 'common', 50, 12, false),
  ('Maymun', '🐵', 'emoji', 'common', 50, 13, false),
  ('Fare', '🐭', 'emoji', 'common', 50, 14, false),
  ('Hamster', '🐹', 'emoji', 'common', 50, 15, false),
  ('Penguen', '🐧', 'emoji', 'rare', 100, 16, false),
  ('Baykuş', '🦉', 'emoji', 'rare', 100, 17, false),
  ('Kurbağa', '🐸', 'emoji', 'rare', 100, 18, false),
  ('Arı', '🐝', 'emoji', 'rare', 100, 19, false),
  ('Kelebek', '🦋', 'emoji', 'epic', 200, 20, false),
  ('Yunus', '🐬', 'emoji', 'epic', 200, 21, false),
  ('Köpekbalığı', '🦈', 'emoji', 'epic', 200, 22, false),
  ('Ahtapot', '🐙', 'emoji', 'legendary', 300, 23, false),
  ('Dinozor', '🦖', 'emoji', 'legendary', 300, 24, false),
  ('Anka Kuşu', '🦅', 'emoji', 'legendary', 350, 25, false);

-- =====================================================
-- NEW PREMIUM AVATARS (10 new ones)
-- =====================================================
INSERT INTO avatars (name, image_key, category, rarity, price, sort_order) VALUES
  ('Korsan', 'pirate', 'premium', 'epic', 400, 25),
  ('Prenses', 'princess', 'premium', 'epic', 400, 26),
  ('Şövalye', 'knight', 'premium', 'epic', 450, 27),
  ('Vampir', 'vampire', 'premium', 'epic', 450, 28),
  ('Zombi', 'zombie', 'premium', 'legendary', 500, 29),
  ('Peri', 'fairy', 'premium', 'legendary', 550, 30),
  ('Uzaylı', 'alien', 'premium', 'legendary', 600, 31),
  ('Denizci', 'sailor', 'premium', 'legendary', 650, 32),
  ('Pilot', 'pilot', 'premium', 'legendary', 700, 33),
  ('Kral', 'king', 'premium', 'legendary', 800, 34);
