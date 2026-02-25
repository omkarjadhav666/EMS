-- POLICY: Tasks
DROP POLICY IF EXISTS "Users can manage their own tasks" ON event_tasks;
CREATE POLICY "Users can manage their own tasks"
ON event_tasks FOR ALL
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM events WHERE id = event_tasks.event_id AND user_id = auth.uid())
);

-- POLICY: Guests
DROP POLICY IF EXISTS "Users can manage their own guests" ON guests;
CREATE POLICY "Users can manage their own guests"
ON guests FOR ALL
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM events WHERE id = guests.event_id AND user_id = auth.uid())
);

-- POLICY: Expenses
DROP POLICY IF EXISTS "Users can manage their own expenses" ON expenses;
CREATE POLICY "Users can manage their own expenses"
ON expenses FOR ALL
USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM events WHERE id = expenses.event_id AND user_id = auth.uid())
);
