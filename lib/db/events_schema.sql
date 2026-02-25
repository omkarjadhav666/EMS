-- =====================================================
-- EventFlow Events Schema
-- =====================================================

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  budget DECIMAL(10, 2),
  guest_count INTEGER,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_client ON events(client_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Clients can manage their own events
DROP POLICY IF EXISTS "Clients manage their own events" ON events;
CREATE POLICY "Clients manage their own events"
ON events FOR ALL
USING (client_id = auth.uid())
WITH CHECK (client_id = auth.uid());

-- Policy: Admins can view all events
DROP POLICY IF EXISTS "Admins view all events" ON events;
CREATE POLICY "Admins view all events"
ON events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);
