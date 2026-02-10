'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/data/products';

export default function Categories() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium tracking-wider uppercase text-sm mb-2">
            Browse by Category
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Shop Our Collections
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop/${category.id}`}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden card-hover"
            >
              {/* Background Image */}
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {category.name}
                </h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center space-x-2 text-white font-medium">
                  <span>Shop Now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-2xl transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
