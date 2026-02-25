-- Add event_type column to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS event_type TEXT DEFAULT 'personal';

-- Update existing events to have a default type if needed
-- UPDATE events SET event_type = 'wedding' WHERE event_type IS NULL;
