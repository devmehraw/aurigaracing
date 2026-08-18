-- Get category IDs for sample products
DO $$
DECLARE
  inline_cat_id UUID;
  ice_cat_id UUID;
  cycling_cat_id UUID;
  apparel_cat_id UUID;
  inline_boots_id UUID;
  inline_wheels_id UUID;
BEGIN
  -- Get main category IDs
  SELECT id INTO inline_cat_id FROM public.categories WHERE slug = 'inline-speed-skating' LIMIT 1;
  SELECT id INTO ice_cat_id FROM public.categories WHERE slug = 'ice-speed-skating' LIMIT 1;
  SELECT id INTO cycling_cat_id FROM public.categories WHERE slug = 'cycling-triathlon' LIMIT 1;
  SELECT id INTO apparel_cat_id FROM public.categories WHERE slug = 'fashion-apparel' LIMIT 1;
  SELECT id INTO inline_boots_id FROM public.categories WHERE slug = 'inline-boots' LIMIT 1;
  SELECT id INTO inline_wheels_id FROM public.categories WHERE slug = 'inline-wheels' LIMIT 1;

  -- Insert sample inline skating products
  -- /** rest of code here **/

  -- Insert sample ice skating products
  -- /** rest of code here **/

  -- Insert sample cycling products
  -- /** rest of code here **/

  -- Insert sample apparel products
  -- /** rest of code here **/

END $$;
