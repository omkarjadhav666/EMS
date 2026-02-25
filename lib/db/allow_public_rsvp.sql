-- Allow public to INSERT into guests table if the event is public
-- This allows anyone to RSVP
DROP POLICY IF EXISTS "Public can RSVP" ON guests;
CREATE POLICY "Public can RSVP"
ON guests
FOR INSERT
WITH CHECK (
  event_id IN (
    SELECT id FROM events WHERE is_public = true
  )
);
