import { createClient } from '@/lib/supabase/server';
import { Product } from '@/types';
import { mapSupabaseProduct, staticProducts } from '@/data/products';

// Fetch all products from Supabase
export async function getProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      return staticProducts; // Fallback to static products
    }

    if (!data || data.length === 0) {
      return staticProducts; // Fallback if no products in database
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching products:', error);
    return staticProducts;
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products by category:', error);
      return staticProducts.filter(p => p.category === category);
    }

    if (!data || data.length === 0) {
      return staticProducts.filter(p => p.category === category);
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return staticProducts.filter(p => p.category === category);
  }
}

// Fetch a single product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      // Try static products as fallback
      const staticProduct = staticProducts.find(p => p.id === id);
      return staticProduct || null;
    }

    if (!data) {
      return staticProducts.find(p => p.id === id) || null;
    }

    return mapSupabaseProduct(data);
  } catch (error) {
    console.error('Error fetching product:', error);
    return staticProducts.find(p => p.id === id) || null;
  }
}

// Fetch featured products (first 4 in stock)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return staticProducts.filter(p => p.featured).slice(0, 4);
    }

    if (!data || data.length === 0) {
      return staticProducts.filter(p => p.featured).slice(0, 4);
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return staticProducts.filter(p => p.featured).slice(0, 4);
  }
}
