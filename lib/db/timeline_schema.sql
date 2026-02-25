-- Timeline Items Table
CREATE TABLE IF NOT EXISTS timeline_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  "order" INTEGER DEFAULT 0,
  icon TEXT, -- e.g. "ring", "cake", "dance", etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timeline_event ON timeline_items(event_id);
ALTER TABLE timeline_items ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view timeline if event is public
DROP POLICY IF EXISTS "Public can view timeline" ON timeline_items;
CREATE POLICY "Public can view timeline"
ON timeline_items FOR SELECT
USING (
  event_id IN (
    SELECT id FROM events WHERE is_public = true
  )
);

-- Policy: Clients can manage timeline for their events
DROP POLICY IF EXISTS "Clients manage timeline" ON timeline_items;
CREATE POLICY "Clients manage timeline"
ON timeline_items FOR ALL
USING (
  event_id IN (
    SELECT id FROM events WHERE user_id = auth.uid()
  )
);
