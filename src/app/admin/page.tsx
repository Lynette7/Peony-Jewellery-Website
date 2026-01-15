'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Order, ContactMessage } from '@/types/database';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  unreadMessages: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Fetch orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch unread messages count
      const { count: unreadCount, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      // Fetch recent messages
      const { data: messages, error: recentMessagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (productsError || ordersError || messagesError || recentMessagesError) {
        throw new Error('Failed to fetch dashboard data');
      }

      const pendingOrders = orders?.filter((o: Order) => o.status === 'pending').length || 0;
      const totalRevenue = orders?.reduce((sum: number, o: Order) => sum + o.total, 0) || 0;

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: orders?.length || 0,
        pendingOrders,
        unreadMessages: unreadCount || 0,
        totalRevenue,
      });

      setRecentOrders(orders?.slice(0, 5) || []);
      setRecentMessages(messages || []);
    } catch (err) {
      setError('Failed to load dashboard data. Make sure your Supabase is set up correctly.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'processing':
        return 'bg-blue-900/50 text-blue-300';
      case 'shipped':
        return 'bg-purple-900/50 text-purple-300';
      case 'delivered':
        return 'bg-green-900/50 text-green-300';
      case 'cancelled':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8dae2]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#5a002d] border border-[#920b4c] rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-[#f8dae2] flex-shrink-0 mt-0.5" size={24} />
          <div>
            <h3 className="font-semibold text-[#fcfbf9]">Setup Required</h3>
            <p className="text-[#f8dae2] mt-1">{error}</p>
            <div className="mt-4 space-y-2 text-sm text-[#f8dae2]">
              <p><strong>To get started:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Create a Supabase project at supabase.com</li>
                <li>Run the SQL schema from <code className="bg-[#920b4c] px-1 rounded">supabase/schema.sql</code></li>
                <li>Add your credentials to <code className="bg-[#920b4c] px-1 rounded">.env.local</code></li>
                <li>Create an admin user in Supabase Authentication</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Dashboard</h1>
        <p className="text-[#f8dae2]">Welcome back! Here&apos;s an overview of your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#5a002d] rounded-xl shadow-sm p-6 border border-[#920b4c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f8dae2]">Total Products</p>
              <p className="text-2xl font-bold text-[#fcfbf9] mt-1">{stats.totalProducts}</p>
            </div>
            <div className="p-3 bg-[#920b4c]/50 rounded-lg">
              <Package className="text-[#f8dae2]" size={24} />
            </div>
          </div>
          <Link href="/admin/products" className="text-sm text-[#f8dae2] hover:text-[#fcfbf9] mt-3 inline-flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="bg-[#5a002d] rounded-xl shadow-sm p-6 border border-[#920b4c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f8dae2]">Total Orders</p>
              <p className="text-2xl font-bold text-[#fcfbf9] mt-1">{stats.totalOrders}</p>
              {stats.pendingOrders > 0 && (
                <p className="text-sm text-yellow-400 mt-1">{stats.pendingOrders} pending</p>
              )}
            </div>
            <div className="p-3 bg-[#920b4c]/50 rounded-lg">
              <ShoppingCart className="text-[#f8dae2]" size={24} />
            </div>
          </div>
          <Link href="/admin/orders" className="text-sm text-[#f8dae2] hover:text-[#fcfbf9] mt-3 inline-flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="bg-[#5a002d] rounded-xl shadow-sm p-6 border border-[#920b4c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f8dae2]">Messages</p>
              <p className="text-2xl font-bold text-[#fcfbf9] mt-1">{stats.unreadMessages}</p>
              <p className="text-sm text-[#f8dae2] mt-1">unread</p>
            </div>
            <div className="p-3 bg-[#920b4c]/50 rounded-lg">
              <MessageSquare className="text-[#f8dae2]" size={24} />
            </div>
          </div>
          <Link href="/admin/messages" className="text-sm text-[#f8dae2] hover:text-[#fcfbf9] mt-3 inline-flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>

        <div className="bg-[#5a002d] rounded-xl shadow-sm p-6 border border-[#920b4c]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#f8dae2]">Total Revenue</p>
              <p className="text-2xl font-bold text-[#fcfbf9] mt-1">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-[#920b4c]/50 rounded-lg">
              <TrendingUp className="text-[#f8dae2]" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c]">
          <div className="p-4 border-b border-[#920b4c] flex items-center justify-between">
            <h2 className="font-semibold text-[#fcfbf9]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#f8dae2] hover:text-[#fcfbf9]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#920b4c]">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-[#f8dae2]">
                <ShoppingCart className="mx-auto mb-2 text-[#920b4c]" size={32} />
                <p>No orders yet</p>
              </div>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-[#920b4c]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-[#fcfbf9]">{order.customer_name}</p>
                      <p className="text-sm text-[#f8dae2] flex items-center mt-1">
                        <Clock size={14} className="mr-1" />
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#fcfbf9]">{formatPrice(order.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c]">
          <div className="p-4 border-b border-[#920b4c] flex items-center justify-between">
            <h2 className="font-semibold text-[#fcfbf9]">Recent Messages</h2>
            <Link href="/admin/messages" className="text-sm text-[#f8dae2] hover:text-[#fcfbf9]">
              View all
            </Link>
          </div>
          <div className="divide-y divide-[#920b4c]">
            {recentMessages.length === 0 ? (
              <div className="p-8 text-center text-[#f8dae2]">
                <MessageSquare className="mx-auto mb-2 text-[#920b4c]" size={32} />
                <p>No messages yet</p>
              </div>
            ) : (
              recentMessages.map((message) => (
                <div key={message.id} className="p-4 hover:bg-[#920b4c]/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-[#fcfbf9] truncate">{message.name}</p>
                        {!message.read && (
                          <span className="w-2 h-2 bg-[#f8dae2] rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-[#f8dae2] mt-1 truncate">{message.subject}</p>
                      <p className="text-xs text-[#f8dae2]/70 mt-1">{formatDate(message.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
