-- Add all new product fields
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS short_description text,
ADD COLUMN IF NOT EXISTS feature_description text,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS video_url text,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
ADD COLUMN IF NOT EXISTS product_type text CHECK (product_type IN ('boot', 'frame', 'wheel', 'bearing', 'helmet', 'accessory', 'package')),
ADD COLUMN IF NOT EXISTS product_type_details jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;

-- Create product_gallery table for multiple images
CREATE TABLE IF NOT EXISTS public.product_gallery (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create product_tags table for better tag management
CREATE TABLE IF NOT EXISTS public.product_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  tag text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_product_gallery_product ON public.product_gallery(product_id);
CREATE INDEX IF NOT EXISTS idx_product_tags_product ON public.product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);

-- RLS Policies for product_gallery
ALTER TABLE public.product_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product gallery"
  ON public.product_gallery FOR SELECT
  USING (true);

CREATE POLICY "Admins and managers can insert gallery images"
  ON public.product_gallery FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can delete gallery images"
  ON public.product_gallery FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for product_tags
ALTER TABLE public.product_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view product tags"
  ON public.product_tags FOR SELECT
  USING (true);

CREATE POLICY "Admins and managers can manage tags"
  ON public.product_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- Update products table RLS to include status
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;

CREATE POLICY "Anyone can view published products"
  ON public.products FOR SELECT
  USING (
    (status = 'published' AND is_active = true) 
    OR 
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );
