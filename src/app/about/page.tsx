'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Sparkles, Users, Award } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-muted/30 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary font-medium tracking-wider uppercase text-sm mb-4">
                Our Story
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                Bringing Elegance to Your Everyday
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Peony HQ Kenya was born from a passion for beautiful jewellery and a desire to make 
                elegant accessories accessible to everyone. We believe that the right piece of jewellery 
                can transform not just an outfit, but how you feel about yourself.
              </p>
              <Link href="/shop">
                <Button size="lg">Explore Our Collection</Button>
              </Link>
            </div>
            <div className="flex justify-center">
              {/* Larger logo container */}
              <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px]">
                <div className="absolute inset-0 bg-accent rounded-full" />
                <div className="absolute inset-4 flex items-center justify-center">
                  <Image
                    src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
                    alt="Peony HQ Kenya"
                    width={340}
                    height={340}
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do, from selecting our pieces to serving our customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                <Heart className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Passion</h3>
              <p className="text-muted-foreground">
                Every piece is selected with love and care, ensuring only the best reaches you.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                <Sparkles className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Quality</h3>
              <p className="text-muted-foreground">
                We never compromise on quality. Our jewellery is crafted to last and shine.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                <Users className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">
                Building a community of jewellery lovers who appreciate beauty and elegance.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto bg-accent rounded-full flex items-center justify-center mb-4">
                <Award className="text-primary" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Trust</h3>
              <p className="text-muted-foreground">
                Transparency and honesty in everything we do, from pricing to customer service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=600&fit=crop"
                  alt="Jewellery collection"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                From Nairobi, With Love
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Based in the heart of Nairobi, Kenya, Peony HQ started as a small passion project. 
                  What began as sharing beautiful pieces with friends and family quickly grew into 
                  something much bigger.
                </p>
                <p>
                  Today, we serve customers across Kenya, bringing them carefully curated jewellery 
                  that combines elegance with affordability. Each piece in our collection is handpicked 
                  to ensure it meets our high standards of quality and style.
                </p>
                <p>
                  We&apos;re more than just a jewellery shop - we&apos;re a community of people who 
                  believe that everyone deserves to feel beautiful. Whether you&apos;re looking for 
                  everyday elegance or something special for a big occasion, we&apos;ve got you covered.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-background mb-4">
            Ready to Find Your Perfect Piece?
          </h2>
          <p className="text-background/80 mb-8 max-w-2xl mx-auto">
            Explore our collection and discover jewellery that speaks to you. 
            From classic elegance to modern trends, we have something for everyone.
          </p>
          <Link href="/shop">
            <button className="px-8 py-4 bg-background text-primary rounded-full font-medium hover:opacity-90 transition-opacity">
              Shop Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
