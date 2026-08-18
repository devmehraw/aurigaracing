-- Create addresses table for shipping and billing
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  address_type text not null check (address_type in ('billing', 'shipping', 'both')),
  first_name text not null,
  last_name text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'USA',
  phone text,
  is_default boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create tickets table for customer support
create table if not exists public.tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create ticket_replies table for conversations
create table if not exists public.ticket_replies (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid references public.tickets(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  message text not null,
  is_staff boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Create front_pages table for content management
create table if not exists public.front_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  content text not null,
  meta_title text,
  meta_description text,
  og_title text,
  og_description text,
  og_image text,
  is_published boolean not null default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.addresses enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_replies enable row level security;
alter table public.front_pages enable row level security;

-- RLS Policies for addresses
create policy "Users can view their own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- RLS Policies for tickets
create policy "Users can view their own tickets"
  on public.tickets for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tickets"
  on public.tickets for insert
  with check (auth.uid() = user_id);

create policy "Admins and managers can view all tickets"
  on public.tickets for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can update tickets"
  on public.tickets for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- RLS Policies for ticket_replies
create policy "Users can view replies to their tickets"
  on public.ticket_replies for select
  using (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_replies.ticket_id and tickets.user_id = auth.uid()
    )
  );

create policy "Users can insert replies to their tickets"
  on public.ticket_replies for insert
  with check (
    exists (
      select 1 from public.tickets
      where tickets.id = ticket_replies.ticket_id and tickets.user_id = auth.uid()
    )
  );

create policy "Admins and managers can view all ticket replies"
  on public.ticket_replies for select
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can insert ticket replies"
  on public.ticket_replies for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

-- RLS Policies for front_pages
create policy "Anyone can view published pages"
  on public.front_pages for select
  using (is_published = true or exists (
    select 1 from public.users
    where id = auth.uid() and role in ('admin', 'manager')
  ));

create policy "Admins and managers can insert pages"
  on public.front_pages for insert
  with check (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins and managers can update pages"
  on public.front_pages for update
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role in ('admin', 'manager')
    )
  );

create policy "Admins can delete pages"
  on public.front_pages for delete
  using (
    exists (
      select 1 from public.users
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create indexes
create index if not exists idx_addresses_user on public.addresses(user_id);
create index if not exists idx_tickets_user on public.tickets(user_id);
create index if not exists idx_ticket_replies_ticket on public.ticket_replies(ticket_id);
create index if not exists idx_front_pages_slug on public.front_pages(slug);
