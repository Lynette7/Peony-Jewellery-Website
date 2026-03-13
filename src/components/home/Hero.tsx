"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { useTheme } from "@/contexts/ThemeContext";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-background to-background" />

      {/* Decorative Circles */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <p className="text-primary font-medium tracking-wider uppercase text-sm">
                Welcome to Peony HQ Kenya
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Discover Your
                <span className="text-primary block">Perfect Jewellery</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto lg:mx-0">
                Explore our curated collection of elegant earrings, necklaces,
                rings, and bracelets. Each piece is designed to make you feel
                beautiful and confident.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/shop">
                <Button size="lg">Shop Collection</Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Our Story
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex justify-center lg:justify-start gap-8 pt-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">5★</p>
                <p className="text-muted-foreground text-sm">Customer Rated</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">5</p>
                <p className="text-muted-foreground text-sm">Categories</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">KE</p>
                <p className="text-muted-foreground text-sm">Locally Curated</p>
              </div>
            </div>
          </div>

          {/* Image/Logo Section - increased logo size */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px]">
              {/* Decorative ring */}
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 border border-accent rounded-full" />

              {/* Logo - larger size */}
              <div className="absolute inset-6 flex items-center justify-center">
                <Image
                  src={isDark ? "/logo-dark.svg" : "/logo-light.svg"}
                  alt="Peony HQ Kenya"
                  width={450}
                  height={450}
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-sm text-center leading-tight">
                  New
                  <br />
                  Arrivals
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
