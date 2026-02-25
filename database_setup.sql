-- Create Expenses Table
create table if not exists expenses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  title text not null,
  amount numeric not null,
  category text, -- 'venue', 'catering', 'flowers', 'music', 'other'
  status text default 'pending', -- 'pending', 'paid'
  due_date timestamptz,
  paid_date timestamptz
);

-- Enable RLS
alter table expenses enable row level security;

-- Create Policy
drop policy if exists "Users can manage their own expenses" on expenses;
create policy "Users can manage their own expenses"
on expenses for all
using (auth.uid() = user_id);

-- Create Index for Performance
create index if not exists expenses_event_id_idx on expenses(event_id);


-- Add Subtype to Events (if running migration later)
alter table events add column if not exists subtype text;

-- Create Guests Table
create table if not exists guests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  full_name text not null,
  email text,
  status text default 'pending', -- 'pending', 'confirmed', 'declined'
  plus_ones int default 0,
  dietary_restrictions text,
  table_assigned text
);

-- Enable RLS
alter table guests enable row level security;

drop policy if exists "Users can manage their own guests" on guests;
create policy "Users can manage their own guests"
on guests for all
using (auth.uid() = user_id);

create index if not exists guests_event_id_idx on guests(event_id);

-- Create Tasks Table (if not exists)
-- Create Tasks Table (if not exists)
-- Renaming to event_tasks to avoid conflicts with reserved words or existing tables
create table if not exists event_tasks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  event_id uuid references events(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  status text default 'pending', -- 'pending', 'in_progress', 'completed'
  priority text default 'medium',
  position int default 0,
  due_date timestamptz
);

-- Enable RLS for Tasks
alter table event_tasks enable row level security;

drop policy if exists "Users can manage their own tasks" on event_tasks;
create policy "Users can manage their own tasks"
on event_tasks for all
using (auth.uid() = user_id);

create index if not exists event_tasks_event_id_idx on event_tasks(event_id);

-- Add Columns to Tasks (if running migration later)
alter table event_tasks add column if not exists priority text default 'medium';
alter table event_tasks add column if not exists position int default 0;
