'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, MapPin, CreditCard, Heart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">My Account</h1>
          <p className="text-muted-foreground mt-2">
            {user.email}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/account/orders"
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Package className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Order History</h3>
                <p className="text-sm text-muted-foreground">View your orders</p>
              </div>
            </div>
          </Link>

          <Link
            href="/wishlist"
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Heart className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Wishlist</h3>
                <p className="text-sm text-muted-foreground">Saved items</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MapPin className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Addresses</h3>
                <p className="text-sm text-muted-foreground">Manage addresses</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/payment-methods"
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <CreditCard className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Payment Methods</h3>
                <p className="text-sm text-muted-foreground">Manage payment info</p>
              </div>
            </div>
          </Link>

          <Link
            href="/account/profile"
            className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <User className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Profile</h3>
                <p className="text-sm text-muted-foreground">Edit profile info</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center space-x-2"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
