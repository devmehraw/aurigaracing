-- Back in Stock Notifications
CREATE TABLE IF NOT EXISTS public.stock_notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    is_notified BOOLEAN DEFAULT false,
    notified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Order Tracking
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_number TEXT,
    carrier TEXT,
    status TEXT NOT NULL DEFAULT 'processing',
    location TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Bundles
CREATE TABLE IF NOT EXISTS public.product_bundles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    discount_percentage INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bundle_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bundle_id UUID NOT NULL REFERENCES public.product_bundles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Newsletter Subscribers
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Low Stock Alerts
CREATE TABLE IF NOT EXISTS public.low_stock_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    threshold INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT true,
    last_alerted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Size Guides
CREATE TABLE IF NOT EXISTS public.size_guides (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    product_type TEXT,
    title TEXT NOT NULL,
    image_url TEXT,
    content JSONB, -- Store size chart data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abandoned Carts
CREATE TABLE IF NOT EXISTS public.abandoned_carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT,
    cart_data JSONB NOT NULL,
    total_value_in_cents INTEGER,
    email_sent BOOLEAN DEFAULT false,
    recovered BOOLEAN DEFAULT false,
    abandoned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recovered_at TIMESTAMP WITH TIME ZONE
);

-- Product Shares
CREATE TABLE IF NOT EXISTS public.product_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    platform TEXT NOT NULL, -- facebook, twitter, pinterest, etc
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.stock_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.low_stock_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Stock Notifications
CREATE POLICY "Users can view their stock notifications"
    ON public.stock_notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their stock notifications"
    ON public.stock_notifications FOR ALL
    USING (auth.uid() = user_id);

-- Order Tracking
CREATE POLICY "Users can view tracking for their orders"
    ON public.order_tracking FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.orders
        WHERE orders.id = order_tracking.order_id
        AND orders.user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage order tracking"
    ON public.order_tracking FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Product Bundles
CREATE POLICY "Anyone can view active bundles"
    ON public.product_bundles FOR SELECT
    USING (is_active = true OR EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

CREATE POLICY "Admins can manage bundles"
    ON public.product_bundles FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Bundle Products
CREATE POLICY "Anyone can view bundle products"
    ON public.bundle_products FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage bundle products"
    ON public.bundle_products FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Newsletter
CREATE POLICY "Anyone can subscribe to newsletter"
    ON public.newsletter_subscribers FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view subscribers"
    ON public.newsletter_subscribers FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Size Guides
CREATE POLICY "Anyone can view size guides"
    ON public.size_guides FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage size guides"
    ON public.size_guides FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Abandoned Carts
CREATE POLICY "Users can view their abandoned carts"
    ON public.abandoned_carts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can create abandoned carts"
    ON public.abandoned_carts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view all abandoned carts"
    ON public.abandoned_carts FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role IN ('admin', 'manager')
    ));

-- Product Shares
CREATE POLICY "Anyone can view product shares"
    ON public.product_shares FOR SELECT
    USING (true);

CREATE POLICY "Anyone can increment shares"
    ON public.product_shares FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can update share count"
    ON public.product_shares FOR UPDATE
    USING (true);
