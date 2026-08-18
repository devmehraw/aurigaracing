-- Add new tables for enhanced e-commerce features

-- Recently Viewed Products
CREATE TABLE IF NOT EXISTS recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Product Comparisons
CREATE TABLE IF NOT EXISTS product_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Price Drop Alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price_in_cents INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, product_id)
);

-- Product Q&A
CREATE TABLE IF NOT EXISTS product_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES product_questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  answer TEXT NOT NULL,
  is_staff BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loyalty Points
CREATE TABLE IF NOT EXISTS loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earned', 'redeemed', 'expired')),
  description TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vouchers and Gift Cards
CREATE TABLE IF NOT EXISTS vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL,
  min_purchase_in_cents INTEGER DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS voucher_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voucher_id UUID REFERENCES vouchers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  discount_applied_in_cents INTEGER NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bulk Discounts
CREATE TABLE IF NOT EXISTS bulk_discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INTEGER NOT NULL,
  discount_percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, min_quantity)
);

-- Enable RLS
ALTER TABLE recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE voucher_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_discounts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Recently Viewed
CREATE POLICY "Users can view their recently viewed" ON recently_viewed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their recently viewed" ON recently_viewed FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their recently viewed" ON recently_viewed FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Product Comparisons
CREATE POLICY "Users can view their comparisons" ON product_comparisons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their comparisons" ON product_comparisons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their comparisons" ON product_comparisons FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Price Alerts
CREATE POLICY "Users can view their price alerts" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their price alerts" ON price_alerts FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Product Q&A
CREATE POLICY "Anyone can view questions" ON product_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can ask questions" ON product_questions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their questions" ON product_questions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can update any question" ON product_questions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Anyone can view answers" ON product_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can answer" ON product_answers FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Staff can manage answers" ON product_answers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- RLS Policies for Loyalty Points
CREATE POLICY "Users can view their points" ON loyalty_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage points" ON loyalty_points FOR ALL USING (true);

CREATE POLICY "Users can view their transactions" ON points_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create transactions" ON points_transactions FOR INSERT WITH CHECK (true);

-- RLS Policies for Vouchers
CREATE POLICY "Anyone can view active vouchers" ON vouchers FOR SELECT USING (is_active = true AND valid_until > NOW());
CREATE POLICY "Admins can manage vouchers" ON vouchers FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

CREATE POLICY "Users can view their voucher usage" ON voucher_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can track voucher usage" ON voucher_usage FOR INSERT WITH CHECK (true);

-- RLS Policies for Bulk Discounts
CREATE POLICY "Anyone can view bulk discounts" ON bulk_discounts FOR SELECT USING (true);
CREATE POLICY "Admins can manage bulk discounts" ON bulk_discounts FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'manager'))
);

-- Create indexes for performance
CREATE INDEX idx_recently_viewed_user ON recently_viewed(user_id, viewed_at DESC);
CREATE INDEX idx_product_comparisons_user ON product_comparisons(user_id);
CREATE INDEX idx_price_alerts_product ON price_alerts(product_id, is_active);
CREATE INDEX idx_product_questions_product ON product_questions(product_id, created_at DESC);
CREATE INDEX idx_loyalty_points_user ON loyalty_points(user_id);
CREATE INDEX idx_vouchers_code ON vouchers(code);
CREATE INDEX idx_bulk_discounts_product ON bulk_discounts(product_id, min_quantity);
