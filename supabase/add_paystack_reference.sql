-- Add paystack_reference column to orders table
-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS paystack_reference TEXT;
