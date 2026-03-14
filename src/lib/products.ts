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

// Search products by query (matches name, description, or category)
export async function searchProducts(query: string): Promise<Product[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const lower = trimmed.toLowerCase();
  const allCategories: string[] = ['earrings', 'necklaces', 'rings', 'bracelets', 'sets'];
  const matchedCategory = allCategories.find(c => c === lower);

  try {
    const supabase = await createClient();

    if (matchedCategory) {
      // Exact category match — return only that category
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', matchedCategory)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching products:', error);
        return staticProducts.filter(p => p.category === matchedCategory);
      }
      return (data || []).map(mapSupabaseProduct);
    }

    // General search — match name or description only (not category, to avoid substring issues)
    const pattern = `%${trimmed}%`;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.${pattern},description.ilike.${pattern}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching products:', error);
      return staticProducts.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
      );
    }

    return (data || []).map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error searching products:', error);
    if (matchedCategory) {
      return staticProducts.filter(p => p.category === matchedCategory);
    }
    return staticProducts.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
    );
  }
}

// Fetch featured products (products marked as featured and in stock)
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured products:', error);
      return staticProducts.filter(p => p.featured).slice(0, 4);
    }

    if (!data || data.length === 0) {
      // If no featured products, fall back to static or return empty
      return staticProducts.filter(p => p.featured).slice(0, 4);
    }

    return data.map(mapSupabaseProduct);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return staticProducts.filter(p => p.featured).slice(0, 4);
  }
}
