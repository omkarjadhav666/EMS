-- =====================================================
-- EventFlow Multi-Role System Migration
-- =====================================================
-- This migration adds support for three user roles:
-- - client: Event planners
-- - vendor: Service providers
-- - admin: Platform managers
-- =====================================================

BEGIN;

-- =====================================================
-- 1. UPDATE PROFILES TABLE
-- =====================================================

-- Add role column with default 'client'
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client' 
CHECK (role IN ('client', 'vendor', 'admin'));

-- Add vendor reference for vendor users
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL;

-- Create index for role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- =====================================================
-- 2. UPDATE VENDORS TABLE
-- =====================================================

-- Add owner_id to link vendor to user account
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add status for vendor approval workflow
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' 
CHECK (status IN ('pending', 'approved', 'rejected', 'suspended'));

-- Add updated_at timestamp
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add business details
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS business_hours JSONB;

-- Add services array (JSON array of service offerings)
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS services JSONB;

-- Add portfolio images
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[];

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vendors_owner ON vendors(owner_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- Update existing vendors to 'approved' status (backward compatibility)
UPDATE vendors SET status = 'approved' WHERE status IS NULL;

-- =====================================================
-- 3. CREATE VENDOR_AVAILABILITY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS vendor_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vendor_id, date)
);

-- Enable RLS
ALTER TABLE vendor_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Vendors can manage their own availability
DROP POLICY IF EXISTS "Vendors manage their availability" ON vendor_availability;
CREATE POLICY "Vendors manage their availability"
ON vendor_availability FOR ALL
USING (
  vendor_id IN (
    SELECT vendor_id FROM profiles WHERE id = auth.uid()
  )
);

-- RLS Policy: Public can view availability
DROP POLICY IF EXISTS "Public can view availability" ON vendor_availability;
CREATE POLICY "Public can view availability"
ON vendor_availability FOR SELECT
USING (true);

-- =====================================================
-- 4. CREATE MESSAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at DESC);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view messages for their bookings
DROP POLICY IF EXISTS "Users can view messages for their bookings" ON messages;
CREATE POLICY "Users can view messages for their bookings"
ON messages FOR SELECT
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() 
    OR vendor_id IN (SELECT vendor_id FROM profiles WHERE id = auth.uid())
  )
);

-- RLS Policy: Users can send messages for their bookings
DROP POLICY IF EXISTS "Users can send messages for their bookings" ON messages;
CREATE POLICY "Users can send messages for their bookings"
ON messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() 
    OR vendor_id IN (SELECT vendor_id FROM profiles WHERE id = auth.uid())
  )
);

-- RLS Policy: Users can mark their messages as read
DROP POLICY IF EXISTS "Users can update message read status" ON messages;
CREATE POLICY "Users can update message read status"
ON messages FOR UPDATE
USING (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() 
    OR vendor_id IN (SELECT vendor_id FROM profiles WHERE id = auth.uid())
  )
)
WITH CHECK (
  booking_id IN (
    SELECT id FROM bookings 
    WHERE user_id = auth.uid() 
    OR vendor_id IN (SELECT vendor_id FROM profiles WHERE id = auth.uid())
  )
);

-- =====================================================
-- 5. UPDATE BOOKINGS RLS POLICIES
-- =====================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own bookings" ON bookings;
DROP POLICY IF EXISTS "Public read access" ON bookings;

-- Policy: Clients can manage their own bookings
DROP POLICY IF EXISTS "Clients manage their bookings" ON bookings;
CREATE POLICY "Clients manage their bookings"
ON bookings FOR ALL
USING (auth.uid() = user_id);

-- Policy: Vendors can view bookings for their services
DROP POLICY IF EXISTS "Vendors view their bookings" ON bookings;
CREATE POLICY "Vendors view their bookings"
ON bookings FOR SELECT
USING (
  vendor_id IN (
    SELECT vendor_id FROM profiles WHERE id = auth.uid()
  )
);

-- Policy: Vendors can update booking status
DROP POLICY IF EXISTS "Vendors update booking status" ON bookings;
CREATE POLICY "Vendors update booking status"
ON bookings FOR UPDATE
USING (
  vendor_id IN (
    SELECT vendor_id FROM profiles WHERE id = auth.uid()
  )
)
WITH CHECK (
  vendor_id IN (
    SELECT vendor_id FROM profiles WHERE id = auth.uid()
  )
);

-- Policy: Admins can view all bookings
DROP POLICY IF EXISTS "Admins view all bookings" ON bookings;
CREATE POLICY "Admins view all bookings"
ON bookings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Policy: Admins can update all bookings
DROP POLICY IF EXISTS "Admins update all bookings" ON bookings;
CREATE POLICY "Admins update all bookings"
ON bookings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 6. UPDATE VENDORS RLS POLICIES
-- =====================================================

-- Policy: Vendors can update their own vendor profile
DROP POLICY IF EXISTS "Vendors manage their profile" ON vendors;
CREATE POLICY "Vendors manage their profile"
ON vendors FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Policy: Vendors can insert their own vendor profile
DROP POLICY IF EXISTS "Vendors create their profile" ON vendors;
CREATE POLICY "Vendors create their profile"
ON vendors FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Policy: Admins can manage all vendors
DROP POLICY IF EXISTS "Admins manage all vendors" ON vendors;
CREATE POLICY "Admins manage all vendors"
ON vendors FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 7. CREATE TRANSACTIONS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  vendor_id UUID REFERENCES vendors(id) NOT NULL,
  
  -- Financial details
  amount DECIMAL(10, 2) NOT NULL,
  platform_fee_percentage DECIMAL(5, 2) DEFAULT 10.00,
  platform_fee_amount DECIMAL(10, 2) NOT NULL,
  vendor_payout DECIMAL(10, 2) NOT NULL,
  
  -- Transaction status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'refunded', 'disputed')),
  payment_method TEXT,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Payment gateway references
  payment_intent_id TEXT,
  payout_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_client ON transactions(client_id);
CREATE INDEX IF NOT EXISTS idx_transactions_vendor ON transactions(vendor_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Clients can view their own transactions
DROP POLICY IF EXISTS "Clients view their transactions" ON transactions;
CREATE POLICY "Clients view their transactions"
ON transactions FOR SELECT
USING (client_id = auth.uid());

-- Vendors can view transactions for their services
DROP POLICY IF EXISTS "Vendors view their transactions" ON transactions;
CREATE POLICY "Vendors view their transactions"
ON transactions FOR SELECT
USING (
  vendor_id IN (
    SELECT vendor_id FROM profiles WHERE id = auth.uid()
  )
);

-- Admins can manage all transactions
DROP POLICY IF EXISTS "Admins manage all transactions" ON transactions;
CREATE POLICY "Admins manage all transactions"
ON transactions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 8. CREATE PLATFORM_REVENUE TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS platform_revenue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  year INT NOT NULL,
  month INT NOT NULL,
  UNIQUE(transaction_id)
);

CREATE INDEX IF NOT EXISTS idx_revenue_year_month ON platform_revenue(year, month);
CREATE INDEX IF NOT EXISTS idx_revenue_category ON platform_revenue(category);

ALTER TABLE platform_revenue ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins only" ON platform_revenue;
CREATE POLICY "Admins only"
ON platform_revenue FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 9. CREATE DISPUTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS disputes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE NOT NULL,
  transaction_id UUID REFERENCES transactions(id),
  raised_by UUID REFERENCES auth.users(id) NOT NULL,
  against_user UUID REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  resolution TEXT,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disputes_booking ON disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON disputes(status);
CREATE INDEX IF NOT EXISTS idx_disputes_raised_by ON disputes(raised_by);

ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Users can view disputes they're involved in
DROP POLICY IF EXISTS "Users view their disputes" ON disputes;
CREATE POLICY "Users view their disputes"
ON disputes FOR SELECT
USING (raised_by = auth.uid() OR against_user = auth.uid());

-- Users can create disputes
DROP POLICY IF EXISTS "Users create disputes" ON disputes;
CREATE POLICY "Users create disputes"
ON disputes FOR INSERT
WITH CHECK (raised_by = auth.uid());

-- Admins can manage all disputes
DROP POLICY IF EXISTS "Admins manage disputes" ON disputes;
CREATE POLICY "Admins manage disputes"
ON disputes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 10. CREATE ADMIN_NOTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('user', 'vendor', 'booking', 'transaction', 'dispute')),
  entity_id UUID NOT NULL,
  note TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_admin ON admin_notes(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_flagged ON admin_notes(is_flagged) WHERE is_flagged = true;

ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins only" ON admin_notes;
CREATE POLICY "Admins only"
ON admin_notes FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- =====================================================
-- 11. CREATE AUDIT_LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
DROP POLICY IF EXISTS "Admins view audit logs" ON audit_logs;
CREATE POLICY "Admins view audit logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can insert audit logs
DROP POLICY IF EXISTS "System inserts audit logs" ON audit_logs;
CREATE POLICY "System inserts audit logs"
ON audit_logs FOR INSERT
WITH CHECK (true);

-- =====================================================
-- 12. UPDATE MESSAGES TABLE FOR ADMIN OVERSIGHT
-- =====================================================

-- Add admin oversight columns
ALTER TABLE messages ADD COLUMN IF NOT EXISTS flagged_by_admin BOOLEAN DEFAULT false;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS admin_note TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS is_system_message BOOLEAN DEFAULT false;

-- Admin can view ALL messages
DROP POLICY IF EXISTS "Admins view all messages" ON messages;
CREATE POLICY "Admins view all messages"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Admin can update messages (flag, add notes)
DROP POLICY IF EXISTS "Admins update messages" ON messages;
CREATE POLICY "Admins update messages"
ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
);

-- System can send messages
DROP POLICY IF EXISTS "System sends messages" ON messages;
CREATE POLICY "System sends messages"
ON messages FOR INSERT
WITH CHECK (is_system_message = true);

-- =====================================================
-- 13. CREATE ADMIN USER (OPTIONAL - RUN MANUALLY)
-- =====================================================

-- To create an admin user, run this after the migration:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

COMMIT;

-- =====================================================
-- ROLLBACK SCRIPT (if needed)
-- =====================================================
-- BEGIN;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
-- DROP TABLE IF EXISTS admin_notes CASCADE;
-- DROP TABLE IF EXISTS disputes CASCADE;
-- DROP TABLE IF EXISTS platform_revenue CASCADE;
-- DROP TABLE IF EXISTS transactions CASCADE;
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS vendor_availability CASCADE;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS owner_id;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS status;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS updated_at;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS business_hours;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS services;
-- ALTER TABLE vendors DROP COLUMN IF EXISTS portfolio_images;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS role;
-- ALTER TABLE profiles DROP COLUMN IF EXISTS vendor_id;
-- COMMIT;

