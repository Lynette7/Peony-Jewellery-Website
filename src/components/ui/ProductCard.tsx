'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, calculateDiscountedPrice } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons or links inside
    const target = e.target as HTMLElement;
    if (target.closest('button, a')) {
      return;
    }
    router.push(`/product/${product.id}`);
  };

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden card-hover border border-border">
      {/* Image Container */}
      <div 
        className="relative aspect-square img-zoom bg-muted cursor-pointer"
        onClick={handleImageClick}
      >
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          
          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-foreground text-background px-4 py-2 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {product.featured && product.inStock && (
            <span className="absolute top-3 left-3 bg-primary text-background px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-all duration-200 ${
                isInWishlist(product.id)
                  ? 'bg-primary text-background'
                  : 'bg-background text-foreground hover:bg-primary hover:text-background'
              }`}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
            </button>
            <Link
              href={`/product/${product.id}`}
              className="p-2 bg-background text-foreground rounded-full shadow-md hover:bg-primary hover:text-background transition-all duration-200"
              aria-label="View product"
            >
              <Eye size={18} />
            </Link>
          </div>

          {/* Add to Cart Button - Appears on Hover */}
          {product.inStock && (
            <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                className={`w-full py-3 rounded-full font-medium flex items-center justify-center space-x-2 transition-all duration-200 ${
                  isInCart(product.id)
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-primary text-background hover:opacity-90'
                }`}
              >
                <ShoppingCart size={18} />
                <span>{isInCart(product.id) ? 'In Cart' : 'Add to Cart'}</span>
              </button>
            </div>
          )}
        </div>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/product/${product.id}`}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <h3 className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="mt-2">
            {product.discount_percentage && product.discount_percentage > 0 ? (
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-muted-foreground line-through text-sm">
                  {formatPrice(product.price)}
                </span>
                <span className="text-primary font-semibold">
                  {formatPrice(calculateDiscountedPrice(product.price, product.discount_percentage))}
                </span>
                <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-medium">
                  -{product.discount_percentage}%
                </span>
              </div>
            ) : (
              <p className="text-primary font-semibold">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
