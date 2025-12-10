-- Add diamonds column to users table
-- This column stores the user's diamond balance for the shop system

ALTER TABLE users ADD COLUMN IF NOT EXISTS diamonds INTEGER DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_diamonds ON users(diamonds);

-- Update existing users to have 30 diamonds as a welcome bonus (optional)
-- UPDATE users SET diamonds = 30 WHERE diamonds = 0 OR diamonds IS NULL;
