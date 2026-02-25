-- Add public fields to events table
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'modern';

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- Update RLS for public access
-- Allow anyone to view public events (even unauthenticated)
DROP POLICY IF EXISTS "Public viewable events" ON events;
CREATE POLICY "Public viewable events"
ON events FOR SELECT
USING (is_public = true);

-- Allow anyone to view guests for public events? No, guests list usually private or protected.
-- But we need a way for public users to Insert into guests table (RSVP).

-- Allow public insertion into guests table for RSVP
-- This might need a separate function to ensure they can only add to valid public events
-- For now, let's keep it restricted and maybe use a security definer function for RSVP.

-- Security Definer Function for RSVP
CREATE OR REPLACE FUNCTION submit_rsvp(
  p_event_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_plus_one BOOLEAN,
  p_dietary TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_event_exists BOOLEAN;
  v_guest_id UUID;
BEGIN
  -- Check if event exists and is public
  SELECT EXISTS (
    SELECT 1 FROM events WHERE id = p_event_id AND is_public = true
  ) INTO v_event_exists;

  IF NOT v_event_exists THEN
    RETURN jsonb_build_object('success', false, 'error', 'Event not found or not public');
  END IF;

  -- Insert guest
  INSERT INTO guests (event_id, name, email, plus_one, dietary_restrictions, status)
  VALUES (p_event_id, p_name, p_email, p_plus_one, p_dietary, 'confirmed')
  RETURNING id INTO v_guest_id;

  RETURN jsonb_build_object('success', true, 'guest_id', v_guest_id);
END;
$$;
