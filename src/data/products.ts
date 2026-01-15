import { Product, CategoryInfo, Category } from '@/types';

export const categories: CategoryInfo[] = [
  {
    id: 'earrings',
    name: 'Earrings',
    description: 'Elegant earrings to complement any look',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
  },
  {
    id: 'necklaces',
    name: 'Necklaces',
    description: 'Beautiful necklaces for every occasion',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
  },
  {
    id: 'rings',
    name: 'Rings',
    description: 'Stunning rings to make a statement',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
  },
  {
    id: 'bracelets',
    name: 'Bracelets',
    description: 'Charming bracelets for your wrist',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
  },
];

// Static fallback products (used when Supabase is not configured)
export const staticProducts: Product[] = [
  // Earrings
  {
    id: 'ear-001',
    name: 'Rose Gold Hoop Earrings',
    description: 'Classic rose gold hoops that add elegance to any outfit. These lightweight hoops are perfect for everyday wear or special occasions.',
    price: 2500,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    material: 'Rose Gold Plated',
    color: 'Rose Gold',
  },
  {
    id: 'ear-002',
    name: 'Pearl Drop Earrings',
    description: 'Elegant freshwater pearl drops that exude timeless sophistication. Perfect for weddings and formal events.',
    price: 3500,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver with Pearls',
    color: 'White/Silver',
  },
  {
    id: 'ear-003',
    name: 'Crystal Stud Earrings',
    description: 'Sparkling crystal studs that catch the light beautifully. A versatile addition to your jewellery collection.',
    price: 1800,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver with Crystal',
    color: 'Clear/Silver',
  },
  {
    id: 'ear-004',
    name: 'Bohemian Tassel Earrings',
    description: 'Playful tassel earrings with a bohemian flair. Perfect for adding a pop of color to your look.',
    price: 1500,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Gold Plated with Silk',
    color: 'Gold/Multi',
  },
  
  // Necklaces
  {
    id: 'neck-001',
    name: 'Layered Gold Chain Necklace',
    description: 'A stunning layered chain necklace that adds instant glamour. Features three delicate chains at varying lengths.',
    price: 4500,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    material: 'Gold Plated',
    color: 'Gold',
  },
  {
    id: 'neck-002',
    name: 'Heart Pendant Necklace',
    description: 'A romantic heart pendant on a delicate chain. The perfect gift for someone special.',
    price: 3200,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver',
    color: 'Silver',
  },
  {
    id: 'neck-003',
    name: 'Choker with Charm',
    description: 'A modern choker with a dangling charm. Adjustable length for the perfect fit.',
    price: 2800,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Leather and Gold Plated',
    color: 'Black/Gold',
  },
  {
    id: 'neck-004',
    name: 'Beaded Statement Necklace',
    description: 'A bold beaded necklace that makes a statement. Handcrafted with colorful beads.',
    price: 3800,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1601821765780-754fa98637c1?w=400&h=400&fit=crop',
    inStock: false,
    material: 'Glass Beads',
    color: 'Multi',
  },
  
  // Rings
  {
    id: 'ring-001',
    name: 'Stackable Gold Rings Set',
    description: 'A set of three delicate stackable rings. Mix and match for your unique style.',
    price: 2800,
    category: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    material: 'Gold Plated',
    color: 'Gold',
  },
  {
    id: 'ring-002',
    name: 'Vintage Emerald Ring',
    description: 'A stunning vintage-inspired ring with an emerald green stone. Perfect for special occasions.',
    price: 5500,
    category: 'rings',
    image: 'https://images.unsplash.com/photo-1611955167811-4711904bb9f8?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver with Gemstone',
    color: 'Silver/Green',
  },
  {
    id: 'ring-003',
    name: 'Minimalist Band Ring',
    description: 'A simple, elegant band ring for everyday wear. Its understated design goes with everything.',
    price: 1500,
    category: 'rings',
    image: 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver',
    color: 'Silver',
  },
  {
    id: 'ring-004',
    name: 'Rose Quartz Statement Ring',
    description: 'A beautiful rose quartz stone set in a statement ring. Believed to attract love and positive energy.',
    price: 4200,
    category: 'rings',
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Gold Plated with Rose Quartz',
    color: 'Gold/Pink',
  },
  
  // Bracelets
  {
    id: 'brac-001',
    name: 'Charm Bracelet',
    description: 'A delightful charm bracelet with multiple charms. Add your own charms to personalize it.',
    price: 3500,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&fit=crop',
    inStock: true,
    featured: true,
    material: 'Sterling Silver',
    color: 'Silver',
  },
  {
    id: 'brac-002',
    name: 'Tennis Bracelet',
    description: 'A classic tennis bracelet with sparkling crystals. Elegant and timeless.',
    price: 6500,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Sterling Silver with Crystals',
    color: 'Silver/Clear',
  },
  {
    id: 'brac-003',
    name: 'Leather Wrap Bracelet',
    description: 'A stylish leather wrap bracelet with metallic accents. Perfect for a casual, edgy look.',
    price: 2200,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop',
    inStock: true,
    material: 'Genuine Leather with Metal',
    color: 'Brown/Gold',
  },
  {
    id: 'brac-004',
    name: 'Pearl Bangle',
    description: 'An elegant bangle adorned with freshwater pearls. A sophisticated addition to any outfit.',
    price: 4800,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?w=400&h=400&fit=crop',
    inStock: false,
    material: 'Gold Plated with Pearls',
    color: 'Gold/White',
  },
];

// Export products - this can be used as a fallback
export const products = staticProducts;

export const getFeaturedProducts = (): Product[] => {
  return staticProducts.filter(product => product.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return staticProducts.filter(product => product.category === category);
};

export const getProductById = (id: string): Product | undefined => {
  return staticProducts.find(product => product.id === id);
};

export const formatPrice = (price: number): string => {
  return `KES ${price.toLocaleString()}`;
};

// Convert Supabase product to frontend Product type
export const mapSupabaseProduct = (dbProduct: {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  in_stock: boolean;
  created_at: string;
}): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description,
  price: dbProduct.price,
  category: dbProduct.category as Category,
  image: dbProduct.image,
  inStock: dbProduct.in_stock,
});
