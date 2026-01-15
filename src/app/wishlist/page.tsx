'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();

  const handleAddToCart = (product: typeof items[0]) => {
    addToCart(product);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Save items you love by clicking the heart icon on any product. 
            They&apos;ll appear here for easy access later.
          </p>
          <Link href="/shop">
            <Button size="lg">
              Explore Products
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
              <h1 className="text-3xl font-bold text-foreground mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <button
              onClick={clearWishlist}
              className="mt-4 sm:mt-0 text-muted-foreground hover:text-red-500 transition-colors flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Clear Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-2xl overflow-hidden group"
            >
              {/* Image */}
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <span className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium">
                        Out of Stock
                      </span>
                    </div>
                  )}
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-background rounded-full shadow-md hover:bg-red-500 hover:text-white transition-all duration-200"
                    aria-label="Remove from wishlist"
                  >
                    <X size={18} />
                  </button>
                </div>
              </Link>

              {/* Content */}
              <div className="p-4 space-y-3">
                <Link href={`/product/${product.id}`}>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-primary font-semibold">
                    {formatPrice(product.price)}
                  </p>
                </Link>

                {/* Add to Cart Button */}
                {product.inStock && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`w-full py-2.5 rounded-full font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
                      isInCart(product.id)
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-primary text-background hover:opacity-90'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
