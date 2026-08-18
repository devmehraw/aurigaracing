-- Create a junction table for many-to-many relationship between products and categories
CREATE TABLE IF NOT EXISTS public.product_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
    category_id uuid REFERENCES public.categories(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(product_id, category_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_categories_product_id ON public.product_categories(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category_id ON public.product_categories(category_id);

-- Enable RLS
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view product categories"
    ON public.product_categories FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Admins can manage product categories"
    ON public.product_categories FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role IN ('admin', 'manager')
        )
    );

-- Migrate existing category_id to product_categories table
INSERT INTO public.product_categories (product_id, category_id)
SELECT id, category_id 
FROM public.products 
WHERE category_id IS NOT NULL
ON CONFLICT (product_id, category_id) DO NOTHING;
