-- Drop the existing check constraint
ALTER TABLE games DROP CONSTRAINT games_category_check;

-- Add the new check constraint including 'fun'
ALTER TABLE games ADD CONSTRAINT games_category_check 
CHECK (category IN ('math', 'language', 'logic', 'memory', 'science', 'fun'));
