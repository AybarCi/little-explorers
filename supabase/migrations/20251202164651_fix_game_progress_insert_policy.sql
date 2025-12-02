/*
  # Fix game_progress INSERT policy

  1. Changes
    - Add WITH CHECK to INSERT policy for game_progress
    - Ensures users can only insert their own progress
  
  2. Security
    - Prevents users from creating progress for other users
*/

DROP POLICY IF EXISTS "Users can insert own progress" ON game_progress;

CREATE POLICY "Users can insert own progress"
  ON game_progress FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
