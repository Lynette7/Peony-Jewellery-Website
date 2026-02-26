'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const TILL_NUMBER = '3238987';

export default function PaymentMethodsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/account/login');
    }
  }, [user, loading, router]);

  if (loading) return null;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/account"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Payment Methods</h1>
          <p className="text-muted-foreground mt-2">How you can pay for your orders</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">

        {/* M-Pesa — active */}
        <div className="bg-card border-2 border-primary rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-foreground">M-Pesa</h3>
                  <span className="inline-flex items-center space-x-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                    <CheckCircle size={10} />
                    <span>Active</span>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Lipa na M-Pesa · Buy Goods and Services
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-muted/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Business Name</span>
              <span className="font-medium text-foreground">Lynette Wanjiru Mwangi</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Till Number</span>
              <span className="font-bold text-foreground tracking-widest">{TILL_NUMBER}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">How to pay</span>
              <span className="text-foreground">M-Pesa → Lipa na M-Pesa → Buy Goods</span>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
