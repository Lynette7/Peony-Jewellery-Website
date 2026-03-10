'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Package, MapPin, CreditCard, Heart, LogOut,
  ChevronRight, ShoppingBag, Loader2, Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const supabase = useMemo(() => createClient(), []);

  const [orderCount, setOrderCount] = useState<number | null>(null);
  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    memberSince: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  // Fetch order count and profile data
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const [ordersRes, profileRes, sessionRes] = await Promise.all([
        supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id),
        supabase
          .from('user_profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single(),
        supabase.auth.getSession(),
      ]);

      setOrderCount(ordersRes.count ?? 0);

      const meta = sessionRes.data?.session?.user?.user_metadata;
      const firstName =
        profileRes.data?.first_name ||
        meta?.first_name ||
        meta?.firstName ||
        '';
      const lastName =
        profileRes.data?.last_name ||
        meta?.last_name ||
        meta?.lastName ||
        '';
      const createdAt =
        sessionRes.data?.session?.user?.created_at || '';

      setProfile({ firstName, lastName, memberSince: createdAt });
    }

    if (user) fetchData();
  }, [user, supabase]);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    profile?.firstName || profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : null;

  const initials =
    profile?.firstName || profile?.lastName
      ? `${(profile.firstName?.[0] || '').toUpperCase()}${(profile.lastName?.[0] || '').toUpperCase()}`
      : user.email?.[0]?.toUpperCase() || '?';

  const memberSince = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString('en-KE', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  const navItems = [
    {
      href: '/account/orders',
      icon: Package,
      label: 'Orders',
      description: 'Track and view order history',
      stat: orderCount !== null ? `${orderCount} order${orderCount !== 1 ? 's' : ''}` : undefined,
    },
    {
      href: '/wishlist',
      icon: Heart,
      label: 'Wishlist',
      description: 'Your saved items',
      stat: `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''}`,
    },
    {
      href: '/account/addresses',
      icon: MapPin,
      label: 'Addresses',
      description: 'Manage delivery addresses',
    },
    {
      href: '/account/payment-methods',
      icon: CreditCard,
      label: 'Payment',
      description: 'View payment information',
    },
    {
      href: '/account/profile',
      icon: Settings,
      label: 'Profile Settings',
      description: 'Edit personal information',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-primary text-background flex items-center justify-center text-2xl font-bold flex-shrink-0 shadow-lg">
              {initials}
            </div>
            {/* Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              {displayName ? (
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {displayName}
                </h1>
              ) : (
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  My Account
                </h1>
              )}
              <p className="text-muted-foreground mt-1 truncate">{user.email}</p>
              {memberSince && (
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {memberSince}
                </p>
              )}
            </div>
            {/* Sign Out - desktop */}
            <div className="hidden sm:block flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <Link
            href="/account/orders"
            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <ShoppingBag className="mx-auto text-primary mb-2" size={22} />
            <p className="text-2xl font-bold text-foreground">
              {orderCount ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">Orders</p>
          </Link>
          <Link
            href="/wishlist"
            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <Heart className="mx-auto text-primary mb-2" size={22} />
            <p className="text-2xl font-bold text-foreground">
              {wishlistItems.length}
            </p>
            <p className="text-xs text-muted-foreground">Wishlist</p>
          </Link>
          <Link
            href="/shop"
            className="bg-card border border-border rounded-xl p-4 text-center hover:shadow-md transition-shadow col-span-2 sm:col-span-1"
          >
            <Package className="mx-auto text-primary mb-2" size={22} />
            <p className="text-sm font-semibold text-primary">Browse</p>
            <p className="text-xs text-muted-foreground">Continue Shopping</p>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Account Settings
        </h2>
        <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <item.icon className="text-primary" size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.label}</span>
                  {item.stat && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      {item.stat}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
              />
            </Link>
          ))}
        </div>

        {/* Sign Out - mobile */}
        <div className="mt-6 sm:hidden">
          <Button
            variant="outline"
            fullWidth
            onClick={handleSignOut}
            className="flex items-center justify-center space-x-2"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
