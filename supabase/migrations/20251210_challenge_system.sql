-- Challenge Reward System Tables
-- Track claimed challenge rewards and user challenge levels

-- Create challenge_claims table
CREATE TABLE IF NOT EXISTS challenge_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id TEXT NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('daily', 'weekly', 'special')),
  reward_points INTEGER NOT NULL,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  challenge_round INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id, challenge_round)
);

-- Create user_challenge_levels table
CREATE TABLE IF NOT EXISTS user_challenge_levels (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  daily_level INTEGER DEFAULT 1,
  weekly_level INTEGER DEFAULT 1,
  special_level INTEGER DEFAULT 1,
  daily_round INTEGER DEFAULT 1,
  weekly_round INTEGER DEFAULT 1,
  special_round INTEGER DEFAULT 1,
  last_daily_reset TIMESTAMPTZ DEFAULT NOW(),
  last_weekly_reset TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_challenge_claims_user_id ON challenge_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_challenge_claims_user_round ON challenge_claims(user_id, challenge_round);

-- Enable RLS
ALTER TABLE challenge_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_levels ENABLE ROW LEVEL SECURITY;

-- RLS Policies for challenge_claims
CREATE POLICY "Users can view own claims" ON challenge_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own claims" ON challenge_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_challenge_levels
CREATE POLICY "Users can view own levels" ON user_challenge_levels
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own levels" ON user_challenge_levels
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own levels" ON user_challenge_levels
  FOR UPDATE USING (auth.uid() = user_id);
