import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { getFeaturedProducts } from '@/lib/products';

export default async function FeaturedProducts() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <p className="text-primary font-medium tracking-wider uppercase text-sm mb-2">
              Handpicked for You
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Featured Collection
            </h2>
          </div>
          <Link
            href="/shop"
            className="group flex items-center space-x-2 text-primary font-medium hover:opacity-80 transition-opacity"
          >
            <span>View All Products</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Featured products coming soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
