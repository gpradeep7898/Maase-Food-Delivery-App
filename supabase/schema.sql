-- ============================================================
-- MAASE MVP — Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users(id) primary key,
  name text,
  phone text unique,
  diet_preferences text[] default '{}',
  created_at timestamptz default now()
);

-- Cooks
create table public.cooks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  name text not null,
  bio text,
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
  batch_total integer default 5,
  batch_remaining integer default 5,
  cooked_at text,
  eta_minutes integer default 30,
  is_available boolean default true,
  cook_story text,
  created_at timestamptz default now()
);

-- Orders
create table public.orders (
  id text primary key default 'MAS' || floor(random()*9000+1000)::text,
  user_id uuid references auth.users(id),
  meal_id uuid references public.meals(id),
  cook_id uuid references public.cooks(id),
  quantity integer default 1,
  status text default 'placed' check (status in ('placed','accepted','preparing','out_for_delivery','delivered','cancelled')),
  subtotal integer,
  platform_fee integer default 10,
  delivery_fee integer default 25,
  gst integer,
  total integer,
  delivery_address text,
  order_type text default 'regular' check (order_type in ('regular','neighbour_feed','pre_book')),
  placed_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tomorrow's pre-bookings (Feature B)
create table public.pre_bookings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  meal_id uuid references public.meals(id),
  cook_id uuid references public.cooks(id),
  quantity integer default 1,
  status text default 'reserved' check (status in ('reserved','confirmed','cancelled')),
  delivery_date date not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.meals enable row level security;
alter table public.orders enable row level security;
alter table public.pre_bookings enable row level security;

-- Basic RLS policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Meals are viewable by all" on public.meals for select using (true);
create policy "Users can view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users can create orders" on public.orders for insert with check (auth.uid() = user_id);
create policy "Users can view own pre-bookings" on public.pre_bookings for select using (auth.uid() = user_id);
create policy "Users can create pre-bookings" on public.pre_bookings for insert with check (auth.uid() = user_id);

-- Enable Realtime for live order tracking
alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.meals;

-- Seed data: Cooks
insert into public.cooks (name, bio, cuisine_speciality, rating, total_orders) values
  ('Sunita Aunty', 'Making dal makhani for 20 years. Always use full cream!', 'Punjabi', 4.9, 84),
  ('Lakshmi Amma', 'Guntur spice blend from grandmother. The secret is roasting the masala fresh.', 'Andhra', 4.8, 112),
  ('Heena Ben', 'Jain recipes — no onion, no garlic. Pure and simple.', 'Gujarati', 5.0, 63),
  ('Mary Chechi', 'Netholi fish from the market this morning. Coconut oil, raw mango — the real way.', 'Kerala', 4.7, 45),
  ('Priya Didi', 'Soaked the rajma overnight. No shortcuts — that''s how maa taught me.', 'North Indian', 4.6, 77);
