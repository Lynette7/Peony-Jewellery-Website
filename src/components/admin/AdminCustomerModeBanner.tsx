'use client';

import React from 'react';
import { useAdminMode } from '@/contexts/AdminModeContext';
import { useRouter } from 'next/navigation';
import { X, LayoutDashboard } from 'lucide-react';

export default function AdminCustomerModeBanner() {
  const { isAdmin, isCustomerMode, exitCustomerMode } = useAdminMode();
  const router = useRouter();

  // Only show if admin is in customer mode
  if (!isAdmin || !isCustomerMode) {
    return null;
  }

  const handleExitCustomerMode = () => {
    exitCustomerMode();
    router.push('/admin');
  };

  return (
    <div className="bg-yellow-600 border-b border-yellow-500 text-white px-4 py-2 z-50 sticky top-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <LayoutDashboard size={18} />
          <span className="text-sm font-medium">
            You are viewing the site as a customer. 
            <button
              onClick={handleExitCustomerMode}
              className="ml-2 underline hover:no-underline font-semibold"
            >
              Return to Admin Dashboard
            </button>
          </span>
        </div>
        <button
          onClick={handleExitCustomerMode}
          className="p-1 hover:bg-yellow-700 rounded transition-colors"
          aria-label="Exit customer mode"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
