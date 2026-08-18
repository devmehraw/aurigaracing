-- Clear all existing categories and start fresh
-- Delete in correct order to handle foreign key constraints
DELETE FROM public.product_categories;
DELETE FROM public.categories WHERE parent_id IS NOT NULL;
DELETE FROM public.categories WHERE parent_id IS NULL;

-- Insert only the 4 main categories specified
-- Use ON CONFLICT (name) instead of (slug) since name has unique constraint
INSERT INTO public.categories (name, slug, description, image_url, parent_id, is_active) VALUES
  ('Inline Speed Skating', 'inline-speed-skating', 'Complete range of inline speed skating equipment including boots, frames, wheels, and accessories', '/placeholder.svg?height=400&width=600', NULL, true),
  ('Ice Speed Skating', 'ice-speed-skating', 'Professional ice speed skating gear including boots, blades, and clap skates', '/placeholder.svg?height=400&width=600', NULL, true),
  ('Cycling & Triathlon', 'cycling-triathlon', 'High-performance cycling and triathlon equipment for competitive athletes', '/placeholder.svg?height=400&width=600', NULL, true),
  ('Fashion & Apparel', 'fashion-apparel', 'Athletic apparel and fashion for performance and style', '/placeholder.svg?height=400&width=600', NULL, true)
ON CONFLICT (name) DO UPDATE SET 
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  image_url = EXCLUDED.image_url,
  parent_id = EXCLUDED.parent_id,
  is_active = EXCLUDED.is_active;

-- Get the parent category IDs for subcategory insertion
DO $$
DECLARE
  inline_id uuid;
  ice_id uuid;
BEGIN
  -- Get parent IDs
  SELECT id INTO inline_id FROM public.categories WHERE slug = 'inline-speed-skating';
  SELECT id INTO ice_id FROM public.categories WHERE slug = 'ice-speed-skating';

  -- Insert Inline Speed Skating subcategories
  INSERT INTO public.categories (name, slug, description, image_url, parent_id, is_active) VALUES
    ('Skate Packages', 'inline-skate-packages', 'Complete inline speed skating packages ready to race', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Boots', 'inline-boots', 'High-performance inline speed skating boots', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Frames', 'inline-frames', 'Precision inline skating frames for speed and control', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Wheels', 'inline-wheels', 'Premium inline skating wheels for various conditions', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Bearings', 'inline-bearings', 'High-speed bearings for optimal performance', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Accessories', 'inline-accessories', 'Essential inline skating accessories and tools', '/placeholder.svg?height=400&width=600', inline_id, true),
    ('Helmets & Skate Bags', 'inline-helmets-skate-bags', 'Safety helmets and storage solutions for inline skating', '/placeholder.svg?height=400&width=600', inline_id, true)
  ON CONFLICT (name) DO UPDATE SET 
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    parent_id = EXCLUDED.parent_id,
    is_active = EXCLUDED.is_active;

  -- Insert Ice Speed Skating subcategories
  INSERT INTO public.categories (name, slug, description, image_url, parent_id, is_active) VALUES
    ('Ice Skate Packages', 'ice-skate-packages', 'Complete ice speed skating packages', '/placeholder.svg?height=400&width=600', ice_id, true),
    ('Ice Boots', 'ice-boots', 'Professional ice speed skating boots', '/placeholder.svg?height=400&width=600', ice_id, true),
    ('Blades', 'ice-blades', 'High-quality ice skating blades', '/placeholder.svg?height=400&width=600', ice_id, true),
    ('Clap Skates', 'clap-skates', 'Advanced clap skate systems', '/placeholder.svg?height=400&width=600', ice_id, true),
    ('Ice Helmets', 'ice-helmets', 'Ice skating safety helmets', '/placeholder.svg?height=400&width=600', ice_id, true),
    ('Ice Accessories', 'ice-accessories', 'Ice skating tools and accessories', '/placeholder.svg?height=400&width=600', ice_id, true)
  ON CONFLICT (name) DO UPDATE SET 
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url,
    parent_id = EXCLUDED.parent_id,
    is_active = EXCLUDED.is_active;
END $$;
