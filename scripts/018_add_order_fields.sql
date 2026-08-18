-- Add payment status and delivery date to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS delivery_date TIMESTAMP WITH TIME ZONE;

-- Add check constraint for payment status
DO $$ BEGIN
  ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check 
  CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
