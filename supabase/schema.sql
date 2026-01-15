-- Supabase Database Schema for Peony Jewellery
-- Run this SQL in your Supabase project's SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('earrings', 'necklaces', 'rings', 'bracelets')),
  image TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total INTEGER NOT NULL,
  items JSONB NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('mpesa', 'card')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read, only authenticated users can modify
CREATE POLICY "Products are viewable by everyone" ON products
  FOR SELECT USING (true);

CREATE POLICY "Products are insertable by authenticated users only" ON products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Products are updatable by authenticated users only" ON products
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Products are deletable by authenticated users only" ON products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Orders: Anyone can insert (checkout), only authenticated users can view/modify
CREATE POLICY "Orders are insertable by everyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are viewable by authenticated users only" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Orders are updatable by authenticated users only" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Contact messages: Anyone can insert, only authenticated users can view/modify
CREATE POLICY "Contact messages are insertable by everyone" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact messages are viewable by authenticated users only" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Contact messages are updatable by authenticated users only" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Contact messages are deletable by authenticated users only" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Insert sample products (optional - you can remove this if you want to start fresh)
INSERT INTO products (name, description, price, category, image, in_stock) VALUES
  ('Pearl Drop Earrings', 'Elegant freshwater pearl earrings with gold-plated hooks. Perfect for both casual and formal occasions.', 2500, 'earrings', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500', true),
  ('Gold Hoop Earrings', 'Classic gold-plated hoop earrings. A timeless addition to any jewelry collection.', 1800, 'earrings', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=500', true),
  ('Crystal Stud Earrings', 'Sparkling crystal studs set in sterling silver. Simple yet stunning.', 1200, 'earrings', 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500', true),
  ('Layered Gold Necklace', 'Delicate layered necklace with multiple gold chains. Modern and sophisticated.', 3500, 'necklaces', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500', true),
  ('Pearl Pendant Necklace', 'Single pearl pendant on a fine gold chain. Classic elegance redefined.', 2800, 'necklaces', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500', true),
  ('Choker Necklace', 'Trendy velvet choker with gold charm. Perfect for a night out.', 1500, 'necklaces', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500', true),
  ('Minimalist Gold Ring', 'Simple gold band with subtle texture. Perfect for stacking.', 1200, 'rings', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500', true),
  ('Statement Crystal Ring', 'Bold crystal ring set in rose gold. A true conversation starter.', 2200, 'rings', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=500', true),
  ('Signet Ring', 'Classic signet ring with modern twist. Timeless and versatile.', 1800, 'rings', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500', true),
  ('Chain Link Bracelet', 'Chunky gold chain bracelet. Bold and beautiful.', 2800, 'bracelets', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500', true),
  ('Pearl Bracelet', 'Elegant freshwater pearl bracelet with gold clasp.', 2500, 'bracelets', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500', true),
  ('Charm Bracelet', 'Delicate charm bracelet with customizable charms.', 3200, 'bracelets', 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500', true);
