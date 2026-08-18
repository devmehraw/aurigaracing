-- Add new columns to products table for enhanced product details
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS brand text,
ADD COLUMN IF NOT EXISTS sku text,
ADD COLUMN IF NOT EXISTS discount_percentage integer DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
ADD COLUMN IF NOT EXISTS original_price_in_cents integer,
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS variants jsonb DEFAULT '[]',
ADD COLUMN IF NOT EXISTS additional_images jsonb DEFAULT '[]';

-- Create index for SKU
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku);

-- Update existing products to have original_price_in_cents if not set
UPDATE public.products 
SET original_price_in_cents = price_in_cents 
WHERE original_price_in_cents IS NULL;
