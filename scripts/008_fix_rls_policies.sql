-- Drop all existing policies that cause infinite recursion
drop policy if exists "Admins can view all users" on public.users;
drop policy if exists "Admins can insert categories" on public.categories;
drop policy if exists "Admins can update categories" on public.categories;
drop policy if exists "Admins can delete categories" on public.categories;
drop policy if exists "Anyone can view active products" on public.products;
drop policy if exists "Admins and managers can insert products" on public.products;
drop policy if exists "Admins and managers can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;
drop policy if exists "Admins and managers can insert product images" on public.product_images;
drop policy if exists "Admins and managers can delete product images" on public.product_images;
drop policy if exists "Admins and managers can view all orders" on public.orders;
drop policy if exists "Admins and managers can update orders" on public.orders;
drop policy if exists "Admins and managers can view all order items" on public.order_items;

-- Create a function to get user role that bypasses RLS
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
stable
as $$
  select role from public.users where id = user_id;
$$;

-- Recreate policies using the function to avoid recursion
create policy "Admins can view all users"
  on public.users for select
  using (public.get_user_role(auth.uid()) = 'admin');

-- Categories policies
create policy "Admins can insert categories"
  on public.categories for insert
  with check (public.get_user_role(auth.uid()) = 'admin');

create policy "Admins can update categories"
  on public.categories for update
  using (public.get_user_role(auth.uid()) = 'admin');

create policy "Admins can delete categories"
  on public.categories for delete
  using (public.get_user_role(auth.uid()) = 'admin');

-- Products policies
create policy "Anyone can view active products"
  on public.products for select
  using (
    is_active = true 
    or public.get_user_role(auth.uid()) in ('admin', 'manager')
  );

create policy "Admins and managers can insert products"
  on public.products for insert
  with check (public.get_user_role(auth.uid()) in ('admin', 'manager'));

create policy "Admins and managers can update products"
  on public.products for update
  using (public.get_user_role(auth.uid()) in ('admin', 'manager'));

create policy "Admins can delete products"
  on public.products for delete
  using (public.get_user_role(auth.uid()) = 'admin');

-- Product images policies
create policy "Admins and managers can insert product images"
  on public.product_images for insert
  with check (public.get_user_role(auth.uid()) in ('admin', 'manager'));

create policy "Admins and managers can delete product images"
  on public.product_images for delete
  using (public.get_user_role(auth.uid()) in ('admin', 'manager'));

-- Orders policies
create policy "Admins and managers can view all orders"
  on public.orders for select
  using (public.get_user_role(auth.uid()) in ('admin', 'manager'));

create policy "Admins and managers can update orders"
  on public.orders for update
  using (public.get_user_role(auth.uid()) in ('admin', 'manager'));

-- Order items policies
create policy "Admins and managers can view all order items"
  on public.order_items for select
  using (public.get_user_role(auth.uid()) in ('admin', 'manager'));
