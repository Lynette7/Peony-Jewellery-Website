'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface AdminModeContextType {
  isAdmin: boolean;
  isCustomerMode: boolean;
  toggleCustomerMode: () => void;
  exitCustomerMode: () => void;
  loading: boolean;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

export function AdminModeProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomerMode, setIsCustomerMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Check if user is admin
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile?.role === 'admin') {
            setIsAdmin(true);
            // Restore customer mode preference from localStorage
            const savedMode = localStorage.getItem('admin_customer_mode');
            if (savedMode === 'true') {
              setIsCustomerMode(true);
            }
          } else {
            setIsAdmin(false);
            setIsCustomerMode(false);
          }
        } else {
          setIsAdmin(false);
          setIsCustomerMode(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsCustomerMode(false);
      } finally {
        setLoading(false);
      }
    }

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role === 'admin') {
          setIsAdmin(true);
          const savedMode = localStorage.getItem('admin_customer_mode');
          if (savedMode === 'true') {
            setIsCustomerMode(true);
          }
        } else {
          setIsAdmin(false);
          setIsCustomerMode(false);
        }
      } else {
        setIsAdmin(false);
        setIsCustomerMode(false);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleCustomerMode = () => {
    const newMode = !isCustomerMode;
    setIsCustomerMode(newMode);
    localStorage.setItem('admin_customer_mode', String(newMode));
  };

  const exitCustomerMode = () => {
    setIsCustomerMode(false);
    localStorage.setItem('admin_customer_mode', 'false');
  };

  const value: AdminModeContextType = {
    isAdmin,
    isCustomerMode,
    toggleCustomerMode,
    exitCustomerMode,
    loading,
  };

  return (
    <AdminModeContext.Provider value={value}>
      {children}
    </AdminModeContext.Provider>
  );
}

export function useAdminMode() {
  const context = useContext(AdminModeContext);
  
  if (context === undefined) {
    throw new Error('useAdminMode must be used within an AdminModeProvider');
  }
  
  return context;
}
