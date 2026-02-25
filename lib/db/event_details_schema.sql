-- =====================================================
-- Event Details Schema (Guests, Tasks, Budget)
-- =====================================================

-- 1. Guests Table
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'declined')),
  plus_one BOOLEAN DEFAULT false,
  dietary_restrictions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guests_event ON guests(event_id);
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can manage guests for their events
DROP POLICY IF EXISTS "Clients manage guests" ON guests;
CREATE POLICY "Clients manage guests"
ON guests FOR ALL
USING (
  event_id IN (
    SELECT id FROM events WHERE client_id = auth.uid()
  )
);

-- 2. Event Tasks Table
CREATE TABLE IF NOT EXISTS event_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_event ON event_tasks(event_id);
ALTER TABLE event_tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can manage tasks for their events
DROP POLICY IF EXISTS "Clients manage tasks" ON event_tasks;
CREATE POLICY "Clients manage tasks"
ON event_tasks FOR ALL
USING (
  event_id IN (
    SELECT id FROM events WHERE client_id = auth.uid()
  )
);

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT,
  date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_event ON expenses(event_id);
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can manage expenses for their events
DROP POLICY IF EXISTS "Clients manage expenses" ON expenses;
CREATE POLICY "Clients manage expenses"
ON expenses FOR ALL
USING (
  event_id IN (
    SELECT id FROM events WHERE client_id = auth.uid()
  )
);
