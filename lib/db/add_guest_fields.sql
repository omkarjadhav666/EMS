-- Add phone and message columns to guests table
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS message TEXT;
