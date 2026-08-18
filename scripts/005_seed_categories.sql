-- Insert main categories based on specification
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Inline Speed Skating', 'inline-speed-skating', 'Complete range of inline speed skating equipment including boots, frames, wheels, and accessories', '/placeholder.svg?height=400&width=600'),
  ('Ice Speed Skating', 'ice-speed-skating', 'Professional ice speed skating gear including boots, blades, and clap skates', '/placeholder.svg?height=400&width=600'),
  ('Cycling & Triathlon', 'cycling-triathlon', 'High-performance cycling and triathlon equipment for competitive athletes', '/placeholder.svg?height=400&width=600'),
  ('Fashion & Apparel', 'fashion-apparel', 'Athletic apparel and fashion for performance and style', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;

-- Insert inline speed skating subcategories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Skate Packages - Inline', 'inline-skate-packages', 'Complete inline speed skating packages ready to race', '/placeholder.svg?height=400&width=600'),
  ('Boots - Inline', 'inline-boots', 'High-performance inline speed skating boots', '/placeholder.svg?height=400&width=600'),
  ('Frames - Inline', 'inline-frames', 'Precision inline skating frames for speed and control', '/placeholder.svg?height=400&width=600'),
  ('Wheels - Inline', 'inline-wheels', 'Premium inline skating wheels for various conditions', '/placeholder.svg?height=400&width=600'),
  ('Bearings - Inline', 'inline-bearings', 'High-speed bearings for optimal performance', '/placeholder.svg?height=400&width=600'),
  ('Accessories - Inline', 'inline-accessories', 'Essential inline skating accessories and tools', '/placeholder.svg?height=400&width=600'),
  ('Helmets & Skate Bags', 'helmets-skate-bags', 'Safety helmets and storage solutions', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;

-- Insert ice speed skating subcategories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
  ('Skate Packages - Ice', 'ice-skate-packages', 'Complete ice speed skating packages', '/placeholder.svg?height=400&width=600'),
  ('Boots - Ice', 'ice-boots', 'Professional ice speed skating boots', '/placeholder.svg?height=400&width=600'),
  ('Blades', 'ice-blades', 'High-quality ice skating blades', '/placeholder.svg?height=400&width=600'),
  ('Clap Skates', 'clap-skates', 'Advanced clap skate systems', '/placeholder.svg?height=400&width=600'),
  ('Helmets - Ice', 'ice-helmets', 'Ice skating safety helmets', '/placeholder.svg?height=400&width=600'),
  ('Accessories - Ice', 'ice-accessories', 'Ice skating tools and accessories', '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;
