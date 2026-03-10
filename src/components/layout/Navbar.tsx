'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Menu, X, Search, Sun, Moon, User, LogOut } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, loading: authLoading, signOut } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  const isDark = mounted ? resolvedTheme === 'dark' : false;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md'
          : 'bg-background'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo - increased size */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src={isDark ? '/logo-dark.svg' : '/logo-light.svg'}
              alt="Peony HQ Kenya"
              width={90}
              height={90}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 text-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun size={22} /> : <Moon size={22} />}
              </button>
            )}

            {/* Search - hidden on mobile */}
            <button
              className="hidden sm:flex p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Search"
            >
              <Search size={22} />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Wishlist"
            >
              <Heart size={22} />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-background text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Account / Login */}
            {mounted && !authLoading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                      className="p-2 text-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
                      aria-label="Account"
                    >
                      <User size={22} />
                    </button>
                    {isAccountMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsAccountMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                          <Link
                            href="/account"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setIsAccountMenuOpen(false)}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            Orders
                          </Link>
                          <button
                            onClick={async () => {
                              await signOut();
                              setIsAccountMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                          >
                            <LogOut size={16} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account/login"
                    className="p-2 text-foreground hover:text-primary transition-colors rounded-full hover:bg-muted"
                    aria-label="Login"
                  >
                    <User size={22} />
                  </Link>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-foreground hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
