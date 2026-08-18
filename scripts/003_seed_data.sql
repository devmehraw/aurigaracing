-- Insert sample categories
insert into public.categories (id, name, slug, description) values
  ('11111111-1111-1111-1111-111111111111', 'Speed Skating', 'speed-skating', 'Premium speed skating equipment and gear'),
  ('22222222-2222-2222-2222-222222222222', 'Cycling', 'cycling', 'High-performance cycling equipment'),
  ('33333333-3333-3333-3333-333333333333', 'Accessories', 'accessories', 'Essential sports accessories')
on conflict (id) do nothing;

-- Insert sample products
insert into public.products (id, name, slug, description, price_in_cents, category_id, stock_quantity, is_active) values
  (
    '44444444-4444-4444-4444-444444444444',
    'Pro Speed Skates',
    'pro-speed-skates',
    'Professional grade speed skates with carbon fiber boot and premium bearings',
    49999,
    '11111111-1111-1111-1111-111111111111',
    25,
    true
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'Racing Helmet',
    'racing-helmet',
    'Aerodynamic racing helmet with ventilation system',
    15999,
    '11111111-1111-1111-1111-111111111111',
    50,
    true
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Carbon Road Bike',
    'carbon-road-bike',
    'Lightweight carbon frame road bike for competitive racing',
    249999,
    '22222222-2222-2222-2222-222222222222',
    10,
    true
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'Performance Wheels',
    'performance-wheels',
    'Professional grade carbon wheelset',
    89999,
    '22222222-2222-2222-2222-222222222222',
    15,
    true
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'Sports Water Bottle',
    'sports-water-bottle',
    'Insulated sports water bottle with ergonomic grip',
    2999,
    '33333333-3333-3333-3333-333333333333',
    100,
    true
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'Training Gloves',
    'training-gloves',
    'Breathable training gloves with grip technology',
    3999,
    '33333333-3333-3333-3333-333333333333',
    75,
    true
  )
on conflict (id) do nothing;
