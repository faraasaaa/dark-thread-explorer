-- Create a table for public profiles
create table public.profiles (
  id uuid references auth.users on delete cascade,
  username text unique,
  email text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policy to allow public read access
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

-- Create policy to allow users to update their own profile
create policy "Users can update their own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Create policy to allow authenticated users to insert their profile
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Function to handle updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to automatically update updated_at
create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();