-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create users table that references auth.users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  role text not null default 'customer' check (role in ('customer', 'manager', 'admin')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create products table
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  price_in_cents integer not null check (price_in_cents >= 0),
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create product_images table for additional images
create table if not exists public.product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Create reviews table
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references public.products(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create orders table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  total_amount_in_cents integer not null check (total_amount_in_cents >= 0),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  stripe_payment_intent_id text,
  shipping_address jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create order_items table
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  price_in_cents integer not null check (price_in_cents >= 0),
  created_at timestamp with time zone default now()
);

-- Create cart_items table (for logged-in users)
create table if not exists public.cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Enable Row Level Security
alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.reviews enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.cart_items enable row level security;

-- RLS Policies for users table
create policy "Users can view their own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Admins can view all users"
  on public.users for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for categories (public read, admin write)
create policy "Anyone can view categories"
  on public.categories for select
  using (true);

create policy "Admins can insert categories"
  on public.categories for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update categories"
  on public.categories for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete categories"
  on public.categories for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for products (public read, admin/manager write)
create policy "Anyone can view active products"
  on public.products for select
  using (is_active = true or exists (
    select 1 from public.users
    where id = auth.uid() and role in ('admin', 'manager')
  ));

create policy "Admins and managers can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- RLS Policies for product_images (public read, admin/manager write)
create policy "Anyone can view product images"
  on public.product_images for select
  using (true);

create policy "Admins and managers can insert product images"
  on public.product_images for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can delete product images"
  on public.product_images for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- RLS Policies for reviews
create policy "Anyone can view reviews"
  on public.reviews for select
  using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews"
  on public.reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- RLS Policies for orders
create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Admins and managers can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can update orders"
  on public.orders for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- RLS Policies for order_items
create policy "Users can view their own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert order items for their orders"
  on public.order_items for insert
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Admins and managers can view all order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- RLS Policies for cart_items
create policy "Users can view their own cart items"
  on public.cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
  on public.cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
  on public.cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
  on public.cart_items for delete
  using (auth.uid() = user_id);

-- Create indexes for performance
create index if not exists idx_products_category on public.products(category_id);
create index if not exists idx_products_slug on public.products(slug);
create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_cart_items_user on public.cart_items(user_id);
create index if not exists idx_reviews_product on public.reviews(product_id);
