-- Remove all mock/dummy products from the database
DELETE FROM products WHERE slug IN (
  'team-warm-up-jacket',
  'speed-suit-pro',
  'racing-helmet-x1'
);

-- Remove any other sample products that might exist
DELETE FROM products WHERE name LIKE '%Sample%' OR name LIKE '%Test%' OR name LIKE '%Demo%';
