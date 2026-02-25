-- Allow public access to expenses for public events
DROP POLICY IF EXISTS "Public viewable expenses" ON expenses;
CREATE POLICY "Public viewable expenses"
ON expenses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM events 
    WHERE events.id = expenses.event_id 
    AND events.is_public = true
  )
);
