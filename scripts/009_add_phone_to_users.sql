-- Add phone number field to users table
alter table public.users add column if not exists phone text;

-- Add parent_id to categories for subcategories
alter table public.categories add column if not exists parent_id uuid references public.categories(id) on delete cascade;
alter table public.categories add column if not exists is_active boolean default true;

-- Add index for performance
create index if not exists idx_categories_parent on public.categories(parent_id);
