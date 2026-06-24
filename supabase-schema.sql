begin;

-- Ensure gen_random_uuid() exists (Postgres extension)
create extension if not exists pgcrypto with schema extensions;

-- Tables
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name_ar text not null,
  name_en text not null,
  price numeric(10,2) not null default 0,
  category text,
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.awake_windows (
  id uuid default gen_random_uuid() primary key,
  label_ar text not null,
  label_en text not null,
  image_url text,
  order_index int default 0,
  created_at timestamptz default now()
);

create table if not exists public.appointments (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text,
  phone text not null,
  date text not null,
  time text not null,
  notes text,
  status text default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.products enable row level security;
alter table public.awake_windows enable row level security;
alter table public.appointments enable row level security;

-- GRANTS (required for PostgREST/Data API)
grant select on public.products to anon;
grant select on public.awake_windows to anon;

grant insert on public.appointments to anon;

-- Storage bucket
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- RLS Policies

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
on public.products
for select
to anon
using (true);

drop policy if exists "Public can read awake_windows" on public.awake_windows;
create policy "Public can read awake_windows"
on public.awake_windows
for select
to anon
using (true);

drop policy if exists "Public can insert appointments" on public.appointments;
create policy "Public can insert appointments"
on public.appointments
for insert
to anon
with check (true);

-- Storage policies:
-- Since bucket is PUBLIC, downloads should work without any SELECT policy on storage.objects.

drop policy if exists "Admin can upload images" on storage.objects;
create policy "Admin can upload images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'images'
  and (auth.jwt() ->> 'role') = 'admin'
);

drop policy if exists "Admin can delete images" on storage.objects;
create policy "Admin can delete images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'images'
  and (auth.jwt() ->> 'role') = 'admin'
);

commit;
