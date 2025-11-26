-- ⚠️ WARNING: This will delete existing warranty data!
-- We are doing this to ensure a clean slate with the correct columns and types.

DROP TABLE IF EXISTS warranties CASCADE;

-- Create a table for storing warranty details
create table warranties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  file_path text not null,
  product_name text,
  purchase_date date,
  warranty_period text, -- Changed to text to handle AI output like "Two and a Half Years"
  expiry_date date,
  serial_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table warranties enable row level security;

-- Create policies for the warranties table
create policy "Users can view their own warranties"
  on warranties for select
  using (auth.uid() = user_id);

create policy "Users can insert their own warranties"
  on warranties for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own warranties"
  on warranties for update
  using (auth.uid() = user_id);

create policy "Users can delete their own warranties"
  on warranties for delete
  using (auth.uid() = user_id);

-- STORAGE POLICIES (Idempotent)
-- Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('warranties', 'warranties', false)
on conflict (id) do nothing;

-- Drop existing storage policies to avoid conflicts when re-running
drop policy if exists "Users can upload their own warranty slips" on storage.objects;
drop policy if exists "Users can view their own warranty slips" on storage.objects;

-- Allow authenticated users to upload files to their own folder
create policy "Users can upload their own warranty slips"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'warranties' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to view their own files
create policy "Users can view their own warranty slips"
on storage.objects for select
to authenticated
using (
  bucket_id = 'warranties' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
