-- Create Vendors Table
create table if not exists vendors (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  category text not null, -- 'Venue', 'Catering', 'Photography', etc.
  description text,
  price_range text, -- '$', '$$', '$$$'
  rating numeric default 0,
  image_url text,
  location text
);

-- Enable RLS for Vendors (Public Read)
alter table vendors enable row level security;

create policy "Vendors are viewable by everyone"
on vendors for select
using (true);

-- Create Bookings Table
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  user_id uuid references auth.users(id) not null,
  event_id uuid references events(id) on delete cascade not null,
  vendor_id uuid references vendors(id) on delete cascade not null,
  booking_date date not null,
  notes text,
  status text default 'pending' -- 'pending', 'confirmed', 'rejected'
);

-- Enable RLS for Bookings
alter table bookings enable row level security;

create policy "Users can manage their own bookings"
on bookings for all
using (auth.uid() = user_id);

-- Seed Data for Vendors
insert into vendors (name, category, description, price_range, rating, location) values
('Grand Ballroom Hotel', 'Venue', 'Luxurious ballroom with capacity for 500 guests.', '$$$', 4.8, 'Downtown'),
('Rustic Barn Estate', 'Venue', 'Charming countryside barn perfect for weddings.', '$$', 4.5, 'Countryside'),
('Gourmet Bites Catering', 'Catering', 'Exquisite culinary experiences for any event.', '$$$', 4.9, 'Metro Area'),
('Lens & Light Photography', 'Photography', 'Capturing your precious moments with style.', '$$', 4.7, 'City Center'),
('DJ Spin Master', 'Music', 'High energy DJ to keep the party going.', '$', 4.6, 'Local'),
('Elegant Blooms', 'Florist', 'Custom floral arrangements for weddings and events.', '$$', 4.8, 'Uptown');
