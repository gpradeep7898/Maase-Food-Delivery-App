-- ============================================================
-- MAASE DATABASE SCHEMA v1.0
-- Run this in Supabase SQL Editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- Profiles (auto-created on phone signup)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  phone text unique,
  diet_preferences text[] default '{}',
  created_at timestamptz default now()
);

-- Home cooks
create table public.cooks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  name text not null,
  initials text,
  avatar_color text default '#E8825A',
  cook_story text,
  cuisine_speciality text,
  rating decimal(3,2) default 5.0,
  total_orders integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Meals
create table public.meals (
  id uuid primary key default uuid_generate_v4(),
  cook_id uuid references public.cooks(id),
  name text not null,
  description text,
  price integer not null,
  cuisine text,
  tags text[] default '{}',
  items text[] default '{}',
  emoji text default '🍱',
  batch_total integer default 5,
  batch_remaining integer default 5,
  cooked_at text,
  eta_minutes integer default 30,
  distance_km decimal(4,2) default 1.0,
  is_available boolean default true,
  is_tomorrow boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id text primary key default ('MAS' || floor(random()*9000+1000)::text),
  user_id uuid references auth.users(id),
  meal_id uuid references public.meals(id),
  cook_id uuid references public.cooks(id),
  quantity integer default 1,
  status text default 'placed'
    check (status in ('placed','accepted','preparing','out_for_delivery','delivered','cancelled','reserved')),
  subtotal integer,
  platform_fee integer default 10,
  delivery_fee integer default 25,
  gst integer,
  total integer,
  delivery_address text,
  scheduled_for date,
  is_feed_neighbour boolean default false,
  placed_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.cooks enable row level security;
alter table public.meals enable row level security;
alter table public.orders enable row level security;

-- Policies
create policy "Meals are public" on public.meals for select using (true);
create policy "Cooks are public" on public.cooks for select using (true);
create policy "Own profile read" on public.profiles for select using (auth.uid() = id);
create policy "Own profile insert" on public.profiles for insert with check (auth.uid() = id);
create policy "Own profile update" on public.profiles for update using (auth.uid() = id);
create policy "Own orders read" on public.orders for select using (auth.uid() = user_id);
create policy "Own orders insert" on public.orders for insert with check (auth.uid() = user_id);

-- Auto-create profile when user signs up via OTP
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, phone)
  values (new.id, new.phone);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable Realtime for live order status tracking
alter publication supabase_realtime add table public.orders;

-- Seed: demo cooks
insert into public.cooks (name, initials, avatar_color, cuisine_speciality, cook_story, rating, total_orders) values
  ('Sunita Aunty', 'SA', '#E8825A', 'Punjabi',      'Made this with my mother''s recipe from Ludhiana. Always use full cream!', 4.9, 84),
  ('Lakshmi Amma', 'LA', '#C45C26', 'Andhra',       'My grandmother''s Guntur spice blend. The secret is roasting the masala fresh.', 4.8, 112),
  ('Heena Ben',    'HB', '#7B5EA7', 'Gujarati',     'Jain recipe — completely no-onion no-garlic. Pure and simple.', 5.0, 63),
  ('Mary Chechi',  'MC', '#1B6CA8', 'Kerala',       'Netholi fish from the market this morning. Coconut oil, raw mango — the real way.', 4.7, 45),
  ('Priya Didi',   'PD', '#388E3C', 'North Indian', 'Soaked the rajma overnight. No shortcuts — that''s how maa taught me.', 4.6, 77);
