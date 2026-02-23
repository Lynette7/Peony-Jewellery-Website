export type Category = 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'sets';

export interface ProductSpecifications {
  material?: string;
  color?: string;
  design?: string;
  properties?: string;
  style?: string;
}

export interface ProductVariant {
  name: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  images?: string[];
  inStock: boolean;
  featured?: boolean;
  discount_percentage?: number | null;
  specifications?: ProductSpecifications;
  variants?: ProductVariant[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
}

export interface WishlistItem {
  product: Product;
  addedAt: Date;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerInfo;
  total: number;
  paymentMethod: 'mpesa' | 'card';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  image: string;
}

// User Account Types
export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface Address {
  id: string;
  address: string;
  city: string;
  postalCode?: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'mpesa' | 'card';
  lastFour?: string;
  phone?: string;
  isDefault: boolean;
}
