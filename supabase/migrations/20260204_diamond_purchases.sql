-- Diamond Purchases Logging Table
-- Created: 2026-02-04

-- =====================================================
-- DIAMOND PURCHASES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS diamond_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,         -- '100_diamonds', '500_diamonds', '1000_diamonds'
  diamond_amount INTEGER NOT NULL,  -- 100, 500, 1000
  price_amount DECIMAL(10,2),       -- Fiyat (store'dan gelen)
  price_currency TEXT,              -- Para birimi (TRY, USD, etc.)
  transaction_id TEXT,              -- Apple/Google transaction ID
  platform TEXT NOT NULL,           -- 'ios' veya 'android'
  status TEXT DEFAULT 'completed',  -- 'completed', 'refunded'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_diamond_purchases_user_id ON diamond_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_diamond_purchases_created_at ON diamond_purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_diamond_purchases_platform ON diamond_purchases(platform);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE diamond_purchases ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
CREATE POLICY "Users can view own purchases" ON diamond_purchases 
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own purchases
CREATE POLICY "Users can insert own purchases" ON diamond_purchases 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
