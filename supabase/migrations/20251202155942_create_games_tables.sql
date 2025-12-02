/*
  # Create games and game progress tables

  1. New Tables
    - `games`
      - `id` (uuid, primary key)
      - `title` (text) - Game title
      - `description` (text) - Game description
      - `category` (text) - Category (math, language, logic, memory, science)
      - `difficulty` (text) - Difficulty level (easy, medium, hard)
      - `min_age` (integer) - Minimum age
      - `max_age` (integer) - Maximum age
      - `points` (integer) - Points awarded for completion
      - `image_url` (text) - Game thumbnail image
      - `game_data` (jsonb) - Game-specific configuration data
      - `is_active` (boolean) - Whether game is active
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `game_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `game_id` (uuid, foreign key to games)
      - `score` (integer) - User score
      - `completed` (boolean) - Whether game is completed
      - `time_spent` (integer) - Time spent in seconds
      - `progress_data` (jsonb) - Game-specific progress data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Anyone can read active games
    - Users can only read/write their own progress
*/

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

CREATE POLICY "Anyone can read active games"
  ON games FOR SELECT
  USING (is_active = true);

CREATE POLICY "Users can read own progress"
  ON game_progress FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own progress"
  ON game_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own progress"
  ON game_progress FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_games_difficulty ON games(difficulty);
CREATE INDEX idx_game_progress_user ON game_progress(user_id);
CREATE INDEX idx_game_progress_game ON game_progress(game_id);
