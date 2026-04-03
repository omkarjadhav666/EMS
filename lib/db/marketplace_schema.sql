-- Marketplace Schema

-- 1. Vendors Table
create table if not exists vendors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  category text not null, -- 'Venue', 'Catering', 'Photography', 'Music', 'Decor'
  description text,
  price_range text, -- '₹', '₹₹', '₹₹₹', '₹₹₹₹'
  location text,
  rating numeric default 0,
  tags text[],
  image_url text,
  contact_email text
);

-- Enable RLS
alter table vendors enable row level security;

-- Policy: Everyone can read vendors
drop policy if exists "Public read access" on vendors;
create policy "Public read access"
on vendors for select
using (true);

-- 2. Bookings Table
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) not null,
  event_id uuid references events(id) on delete cascade not null,
  vendor_id uuid references vendors(id) not null,
  status text default 'pending', -- 'pending', 'confirmed', 'rejected'
  booking_date date,
  notes text
);

-- Enable RLS
alter table bookings enable row level security;

-- Policy: Users can manage their own bookings
drop policy if exists "Users can manage their own bookings" on bookings;
create policy "Users can manage their own bookings"
on bookings for all
using (auth.uid() = user_id);

-- 3. Seed Data (Mock Vendors)
insert into vendors (name, category, description, price_range, location, rating, tags, image_url)
values
('Oberoi Udaivilas', 'Venue', 'A royal palace hotel on the banks of Lake Pichola.', '₹₹₹₹', 'Udaipur, Rajasthan', 4.9, ARRAY['Royal', 'Palace', 'Luxury'], 'https://picsum.photos/seed/venue1/800/600'),
('Goa Beach Shacks', 'Venue', 'Breezy beachside venue for a relaxed wedding.', '₹₹', 'Goa', 4.5, ARRAY['Beach', 'Outdoor', 'Casual'], 'https://picsum.photos/seed/venue2/800/600'),
('Spice Route Catering', 'Catering', 'Authentic Indian regional cuisines and fusion live counters.', '₹₹₹', 'Mumbai, MH', 4.8, ARRAY['Buffet', 'Live Counters', 'Fusion'], 'https://picsum.photos/seed/catering1/800/600'),
('Candid Tales', 'Photography', 'Preserving your wedding memories with cinematic storytelling.', '₹₹', 'Delhi, NCR', 4.7, ARRAY['Candid', 'Cinematic', 'Drone'], 'https://picsum.photos/seed/photo1/800/600'),
('DJ NYK', 'Music', 'Bollywood and EDM mixes to keep the party going.', '₹', 'Mumbai, MH', 4.6, ARRAY['DJ', 'Bollywood', 'EDM'], 'https://picsum.photos/seed/music1/800/600'),
('Ferns & Petals Decor', 'Decor', 'Traditional marigold themes to modern pastel florals.', '₹₹₹', 'Bangalore, KA', 4.8, ARRAY['Floral', 'Traditional', 'Modern'], 'https://picsum.photos/seed/decor1/800/600');
