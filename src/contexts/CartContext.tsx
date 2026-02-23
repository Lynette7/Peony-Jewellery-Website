'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Product, CartItem, ProductVariant } from '@/types';
import { calculateDiscountedPrice } from '@/data/products';

// Generate a unique key for a cart item based on product ID + variant
function cartItemKey(productId: string, variant?: ProductVariant): string {
  return variant ? `${productId}::${variant.name}` : productId;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeFromCart: (productId: string, variant?: ProductVariant) => void;
  updateQuantity: (productId: string, quantity: number, variant?: ProductVariant) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  isInCart: (productId: string, variant?: ProductVariant) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'peony-cart';

function getInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const isInitialized = useRef(false);

  // Hydrate from localStorage on mount - this is a valid pattern for client-side hydration
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      const initialItems = getInitialCart();
      if (initialItems.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(initialItems);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (after initialization)
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items]);

  const addToCart = useCallback((product: Product, quantity: number = 1, variant?: ProductVariant) => {
    setItems(currentItems => {
      const key = cartItemKey(product.id, variant);
      const existingItem = currentItems.find(
        item => cartItemKey(item.product.id, item.selectedVariant) === key
      );
      
      if (existingItem) {
        return currentItems.map(item =>
          cartItemKey(item.product.id, item.selectedVariant) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...currentItems, { product, quantity, selectedVariant: variant }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, variant?: ProductVariant) => {
    const key = cartItemKey(productId, variant);
    setItems(currentItems =>
      currentItems.filter(item => cartItemKey(item.product.id, item.selectedVariant) !== key)
    );
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number, variant?: ProductVariant) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    
    const key = cartItemKey(productId, variant);
    setItems(currentItems =>
      currentItems.map(item =>
        cartItemKey(item.product.id, item.selectedVariant) === key
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemPrice = calculateDiscountedPrice(item.product.price, item.product.discount_percentage);
      return total + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  const getCartCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const isInCart = useCallback((productId: string, variant?: ProductVariant) => {
    const key = cartItemKey(productId, variant);
    return items.some(item => cartItemKey(item.product.id, item.selectedVariant) === key);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
