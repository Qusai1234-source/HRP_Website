-- Add image_url column to notices table
ALTER TABLE notices ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT NULL;
