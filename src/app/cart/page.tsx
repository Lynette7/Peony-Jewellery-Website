'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Looks like you haven&apos;t added any items to your cart yet. 
            Explore our collection and find something you love!
          </p>
          <Link href="/shop">
            <Button size="lg">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            <button
              onClick={clearCart}
              className="mt-4 sm:mt-0 text-muted-foreground hover:text-red-500 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Clear Cart</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-card border border-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                  <div className="relative w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="flex-1 space-y-2">
                  <Link href={`/product/${item.product.id}`}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {item.product.category}
                    </p>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-primary font-semibold">
                    {formatPrice(item.product.price)}
                  </p>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-border rounded-full">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-muted rounded-l-full transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted rounded-r-full transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Subtotal</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-foreground font-semibold">Total</span>
                    <span className="text-primary text-xl font-bold">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button fullWidth size="lg" className="flex items-center justify-center space-x-2">
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={20} />
                </Button>
              </Link>

              <Link
                href="/shop"
                className="block text-center mt-4 text-muted-foreground hover:text-primary transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
