'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMode } from '@/contexts/AdminModeContext';
import Button from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, loading: authLoading, user } = useAuth();
  const { isAdmin } = useAdminMode();
  const supabase = createClient();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect admins to admin login
  useEffect(() => {
    async function checkAdminStatus() {
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin/login');
        }
      }
    }
    checkAdminStatus();
  }, [user, router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);

    if (result.success) {
      // Check if user is admin and redirect accordingly
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', authUser.id)
          .single();

        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/account');
        }
      } else {
        router.push('/account');
      }
      router.refresh();
    } else {
      setError(result.error || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="••••••••"
                  required
                  disabled={isLoading || authLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading || authLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/account/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
            
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Are you an admin?
              </p>
              <Link
                href="/admin/login"
                className="text-sm text-primary hover:underline font-medium"
              >
                Admin Login →
              </Link>
            </div>
            
            <Link
              href="/"
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
