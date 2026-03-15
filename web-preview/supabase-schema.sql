-- Run this in Supabase SQL Editor → https://supabase.com/dashboard/project/aaixsytygsjilgvebnfv/sql

-- Chef Applications table
create table if not exists chef_applications (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  phone text not null,
  city text not null,
  area text,
  cuisines text[],
  signature_dishes text,
  experience text,
  daily_capacity text,
  kitchen_type text,
  self_rating int check (self_rating between 1 and 5),
  notes text,
  referral_code text unique,
  referred_by text,
  submitted_at timestamptz default now()
);

-- Add columns if table already exists
alter table chef_applications add column if not exists referral_code text unique;
alter table chef_applications add column if not exists referred_by text;

-- Chef Nominations table
create table if not exists chef_nominations (
  id uuid default gen_random_uuid() primary key,
  nominator_name text,
  cook_name text not null,
  cook_phone text not null,
  reason text,
  submitted_at timestamptz default now()
);

-- Customer Waitlist table
create table if not exists waitlist (
  id uuid default gen_random_uuid() primary key,
  phone text not null,
  city text,
  type text default 'customer',
  joined_at timestamptz default now()
);

-- Enable Row Level Security (allow anonymous inserts / reads)
alter table chef_applications enable row level security;
alter table chef_nominations enable row level security;
alter table waitlist enable row level security;

create policy "Anyone can insert chef_applications"
  on chef_applications for insert to anon with check (true);
create policy "Anyone can read chef_applications count"
  on chef_applications for select to anon using (true);

create policy "Anyone can insert chef_nominations"
  on chef_nominations for insert to anon with check (true);
create policy "Anyone can read chef_nominations count"
  on chef_nominations for select to anon using (true);

create policy "Anyone can insert waitlist"
  on waitlist for insert to anon with check (true);
create policy "Anyone can read waitlist count"
  on waitlist for select to anon using (true);

-- Mother Survey table
create table if not exists mother_surveys (
  id uuid default gen_random_uuid() primary key,
  is_homemaker text,
  cooks_daily text,
  interested_earning text,
  extra_meals_per_day text,
  food_types text,
  ready_time text,
  would_participate text,
  income_usage text,
  delivery_comfort text,
  earning_expectation text,
  wants_to_join text,
  phone text,
  submitted_at timestamptz default now()
);

alter table mother_surveys enable row level security;
create policy "Anyone can insert mother_surveys"
  on mother_surveys for insert to anon with check (true);
create policy "Anyone can read mother_surveys"
  on mother_surveys for select to anon using (true);
