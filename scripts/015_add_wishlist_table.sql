-- Create wishlist table
create table if not exists public.wishlist (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Enable Row Level Security
alter table public.wishlist enable row level security;

-- RLS Policies for wishlist
create policy "Users can view their own wishlist"
  on public.wishlist for select
  using (auth.uid() = user_id);

create policy "Users can insert to their own wishlist"
  on public.wishlist for insert
  with check (auth.uid() = user_id);

create policy "Users can delete from their own wishlist"
  on public.wishlist for delete
  using (auth.uid() = user_id);

-- Create index for performance
create index if not exists idx_wishlist_user on public.wishlist(user_id);
create index if not exists idx_wishlist_product on public.wishlist(product_id);
