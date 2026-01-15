'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Minus, Plus, ArrowLeft, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getProductsByCategory } from '@/data/products';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/ui/ProductCard';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <span className="bg-foreground text-background px-6 py-3 rounded-full font-medium">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.featured && product.inStock && (
                <span className="absolute top-4 left-4 bg-primary text-background px-4 py-2 rounded-full text-sm font-medium">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Details */}
            {(product.material || product.color) && (
              <div className="space-y-2 border-t border-b border-border py-4">
                {product.material && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Material:</span>
                    <span className="text-foreground font-medium">{product.material}</span>
                  </div>
                )}
                {product.color && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color:</span>
                    <span className="text-foreground font-medium">{product.color}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability:</span>
                  <span className={product.inStock ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            {product.inStock && (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-foreground font-medium">Quantity:</span>
                  <div className="flex items-center border border-border rounded-full">
                    <button
                      onClick={decrementQuantity}
                      className="p-3 hover:bg-muted rounded-l-full transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 font-medium text-foreground">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="p-3 hover:bg-muted rounded-r-full transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    fullWidth
                    className="flex items-center justify-center space-x-2"
                  >
                    {addedToCart ? (
                      <>
                        <Check size={20} />
                        <span>Added to Cart!</span>
                      </>
                    ) : isInCart(product.id) ? (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add More to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => toggleWishlist(product)}
                    variant={isInWishlist(product.id) ? 'primary' : 'outline'}
                    size="lg"
                    className="flex items-center justify-center space-x-2"
                  >
                    <Heart size={20} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                    <span>{isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <Truck size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <Shield size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Secure Payment</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 mx-auto bg-accent rounded-full flex items-center justify-center mb-2">
                  <RotateCcw size={18} className="text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
