# 🚀 Projeyi Localde Çalıştırma

## 1️⃣ Supabase Projesi Oluştur

1. https://supabase.com → Yeni proje oluştur
2. Settings > API → Şu değerleri kopyala:
   - **Project URL**
   - **anon public** key

## 2️⃣ .env Dosyalarını Doldur

### Root dizinde `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### `landing-page/.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 3️⃣ Database Setup

Supabase Dashboard → SQL Editor → Yeni query → Aşağıdaki SQL'i çalıştır:

```sql
-- Users tablosu
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  age integer,
  points integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Games tablosu
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text CHECK (category IN ('math', 'language', 'logic', 'memory', 'science')) NOT NULL,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'easy',
  min_age integer DEFAULT 5,
  max_age integer DEFAULT 14,
  points integer DEFAULT 10,
  image_url text,
  game_data jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Game progress tablosu
CREATE TABLE IF NOT EXISTS game_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id uuid NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  score integer DEFAULT 0,
  completed boolean DEFAULT false,
  time_spent integer DEFAULT 0,
  progress_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, game_id)
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read active games" ON games FOR SELECT USING (is_active = true);

CREATE POLICY "Users can read own profile" ON users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Service role can insert users" ON users FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can read own progress" ON game_progress FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own progress" ON game_progress FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own progress" ON game_progress FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_games_difficulty ON games(difficulty);
CREATE INDEX idx_game_progress_user ON game_progress(user_id);
CREATE INDEX idx_game_progress_game ON game_progress(game_id);

-- Test verisi (opsiyonel)
INSERT INTO games (title, description, category, difficulty, min_age, max_age, points, image_url)
VALUES
  ('Toplama İşlemi', 'Basit toplama soruları çöz!', 'math', 'easy', 5, 8, 10, 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg'),
  ('Kelime Bulmaca', 'Harflerden kelimeler oluştur', 'language', 'medium', 7, 12, 20, 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg'),
  ('Hafıza Oyunu', 'Kartları eşleştir', 'memory', 'easy', 5, 10, 15, 'https://images.pexels.com/photos/8471831/pexels-photo-8471831.jpeg');
```

## 4️⃣ Edge Functions Deploy

```bash
# Supabase CLI kur
npm install -g supabase

# Login
supabase login

# Proje bağla (project-ref'i Supabase dashboard'dan al)
supabase link --project-ref xxxxxxxxxxxx

# Deploy
supabase functions deploy auth-signin
supabase functions deploy auth-signup
supabase functions deploy games-list
supabase functions deploy games-progress
```

## 5️⃣ Projeyi Çalıştır

```bash
# Root dizinde (mobil app)
npm install
npm run dev

# Landing page
cd landing-page
npm install
npm run dev
```

## ✅ Test Et

- Mobil: http://localhost:8081
- Web: http://localhost:5173

## 🆘 Sorun mu var?

- Network hatası alıyorsan: `.env` dosyalarını kontrol et
- Auth çalışmıyorsa: Edge functions deploy edildi mi?
- Database hatası: SQL'i doğru çalıştırdın mı?
