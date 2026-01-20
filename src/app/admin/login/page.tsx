'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Check if we have both user and session
      if (!data.user || !data.session) {
        setError('Login failed. Please check your credentials.');
        setIsLoading(false);
        return;
      }

      // Check role from database (user_profiles table)
      // Use RPC function to avoid RLS issues, or query with proper error handling
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      // If profile doesn't exist or error, check if it's an RLS issue
      if (profileError) {
        console.error('Profile error:', profileError);
        // If it's a permission error, the user might not have a profile yet
        // Try to create one or show a more helpful error
        if (profileError.code === 'PGRST116' || profileError.message?.includes('permission')) {
          setError('User profile not found. Please contact support.');
        } else {
          setError('Access denied. Admin privileges required.');
        }
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        setError('Access denied. Admin privileges required.');
        setIsLoading(false);
        return;
      }

      // Wait a moment for cookies to be set before navigating
      // This ensures the proxy can read the session on the next request
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push('/admin');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4d0025] to-[#920b4c] flex items-center justify-center p-4">
      <div className="bg-[#5a002d] rounded-2xl shadow-2xl w-full max-w-md p-8 border border-[#920b4c]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#fcfbf9] mb-2">
            Peony Admin
          </h1>
          <p className="text-[#f8dae2]">
            Sign in to manage your store
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-start space-x-3">
            <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent transition-all text-[#fcfbf9] placeholder-[#f8dae2]/50"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#f8dae2] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent transition-all text-[#fcfbf9] placeholder-[#f8dae2]/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#920b4c] hover:bg-[#a80d58] text-[#fcfbf9] py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[#920b4c] text-center">
          <Link
            href="/"
            className="text-sm text-[#f8dae2] hover:text-[#fcfbf9] transition-colors"
          >
            ← Back to Website
          </Link>
        </div>

        {/* Setup Instructions */}
        <div className="mt-6 p-4 bg-[#4d0025] rounded-lg border border-[#920b4c]">
          <p className="text-xs text-[#f8dae2] text-center">
            First time? Create an admin user in your Supabase dashboard under Authentication → Users
          </p>
        </div>
      </div>
    </div>
  );
}
