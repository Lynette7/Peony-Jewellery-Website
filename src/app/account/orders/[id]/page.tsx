'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, Package, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/data/products';
import Button from '@/components/ui/Button';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  postal_code: string;
  total: number;
  status: string;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchOrder() {
      if (!user || !orderId) {
        setLoading(false);
        return;
      }

      const supabase = createClient();

      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching order:', error);
          setLoading(false);
          return;
        }

        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }

    if (!authLoading) {
      fetchOrder();
    }
  }, [user, orderId, authLoading]);

  if (authLoading || loading) {
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

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-8">
            We couldn&apos;t find this order.
          </p>
          <Link href="/account/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'shipped':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'processing':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const orderItems = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-muted/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/account/orders"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Orders</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mt-4">
            Order #{order.id.slice(0, 8)}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Order Items</h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Shipping Address</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-muted-foreground shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-foreground">{order.customer_name}</p>
                    <p className="text-muted-foreground">{order.address}</p>
                    <p className="text-muted-foreground">
                      {order.city} {order.postal_code && `, ${order.postal_code}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="text-muted-foreground" size={18} />
                  <p className="text-muted-foreground">{order.customer_phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="text-muted-foreground" size={18} />
                  <p className="text-muted-foreground">{order.customer_email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar size={16} />
                  <span>{orderDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Package size={16} />
                  <span>{orderItems.length} {orderItems.length === 1 ? 'item' : 'items'}</span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">{formatPrice(order.total)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">KES 300</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(order.total + 300)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-medium text-foreground">
                    {order.payment_method === 'mpesa' ? 'M-Pesa' : 'Card'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
