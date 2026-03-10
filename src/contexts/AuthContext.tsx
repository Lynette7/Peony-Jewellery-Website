'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    async function getInitialSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user?: { id: string; email?: string } } | null) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          });
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    firstName?: string, 
    lastName?: string
  ): Promise<{ success: boolean; error?: string; needsConfirmation?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/account` : undefined,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user && !data.session) {
        return { success: true, needsConfirmation: true };
      }

      return { success: true, needsConfirmation: false };
    } catch {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [supabase]);

  const signIn = useCallback(async (
    email: string, 
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch {
      return { success: false, error: 'An unexpected error occurred' };
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    // Clear local state immediately so the UI responds right away
    setUser(null);
    // Invalidate the server session in the background
    supabase.auth.signOut().catch((err: unknown) => console.error('Error signing out:', err));
  }, [supabase]);

  const updateProfile = useCallback(async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string
  }) => {
    if (!user) return;

    // Update local state immediately so the UI reflects changes right away
    setUser({
      ...user,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    });

    // Sync auth metadata in the background — don't block the caller
    supabase.auth.updateUser({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    }).catch((err: unknown) => console.error('Auth metadata sync failed:', err));
  }, [supabase, user]);

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
