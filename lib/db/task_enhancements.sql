-- Add new columns to event_tasks table
ALTER TABLE event_tasks 
ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS assigned_to TEXT;

-- Create index for public tasks query
CREATE INDEX IF NOT EXISTS idx_tasks_public ON event_tasks(event_id, is_public);
