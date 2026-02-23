-- Add discount_percentage column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS discount_percentage INTEGER DEFAULT NULL 
CHECK (discount_percentage IS NULL OR (discount_percentage >= 0 AND discount_percentage <= 100));

-- Add index for better query performance on discounted products
CREATE INDEX IF NOT EXISTS idx_products_discount_percentage ON products(discount_percentage) 
WHERE discount_percentage IS NOT NULL;
