/*
  # Add user statistics columns to users table

  1. New Columns
    - `total_points` (integer) - Total points earned by user
    - `completed_games_count` (integer) - Number of games completed
    - `last_game_played_at` (timestamptz) - Last game activity timestamp

  2. Security
    - Users can read own stats
    - Service role can update stats
*/

-- Add new columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_games_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_game_played_at timestamptz;

-- Update existing users with current data
UPDATE users 
SET total_points = COALESCE((
  SELECT SUM(score) 
  FROM game_progress 
  WHERE game_progress.user_id = users.id 
  AND completed = true
), 0),
completed_games_count = COALESCE((
  SELECT COUNT(*) 
  FROM game_progress 
  WHERE game_progress.user_id = users.id 
  AND completed = true
), 0),
last_game_played_at = (
  SELECT MAX(updated_at) 
  FROM game_progress 
  WHERE game_progress.user_id = users.id
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points);
CREATE INDEX IF NOT EXISTS idx_users_completed_games_count ON users(completed_games_count);
CREATE INDEX IF NOT EXISTS idx_users_last_game_played_at ON users(last_game_played_at);

-- Update RLS policies to allow users to read their own stats
DROP POLICY IF EXISTS "Users can read own stats" ON users;
CREATE POLICY "Users can read own stats"
  ON users FOR SELECT
  TO authenticated
  USING (id::text = auth.uid()::text);

-- Allow service role to update user stats
DROP POLICY IF EXISTS "Service role can update user stats" ON users;
CREATE POLICY "Service role can update user stats"
  ON users FOR UPDATE
  USING (true)
  WITH CHECK (true);