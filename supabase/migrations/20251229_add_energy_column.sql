-- Add energy and last_energy_update columns to users table
-- These columns store the user's energy balance for cross-device sync

ALTER TABLE users ADD COLUMN IF NOT EXISTS energy INTEGER DEFAULT 5;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_energy_update BIGINT DEFAULT (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_energy ON users(energy);

-- Update existing users to have default energy values
UPDATE users SET energy = 5, last_energy_update = (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT 
WHERE energy IS NULL;
