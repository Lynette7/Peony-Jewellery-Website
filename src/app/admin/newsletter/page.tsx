'use client';

import React, { useState, useEffect } from 'react';
import { Search, Mail, Trash2, UserCheck, UserX } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { NewsletterSubscriber } from '@/types/database';

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchSubscribers();
  }, []);

  useEffect(() => {
    let filtered = subscribers;

    if (searchQuery) {
      filtered = filtered.filter((s) =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((s) =>
        statusFilter === 'active' ? s.is_active : !s.is_active
      );
    }

    setFilteredSubscribers(filtered);
  }, [subscribers, searchQuery, statusFilter]);

  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSubscriberStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      setSubscribers(
        subscribers.map((s) =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        )
      );
    } catch (err) {
      console.error('Failed to update subscriber:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSubscribers(subscribers.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete subscriber:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const activeCount = subscribers.filter((s) => s.is_active).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#f8dae2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Newsletter Subscribers</h1>
        <p className="text-[#f8dae2]">
          Manage your newsletter mailing list
          <span className="ml-2 px-2 py-1 bg-[#920b4c] text-[#fcfbf9] text-xs rounded-full">
            {activeCount} active
          </span>
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
          >
            <option value="all">All Subscribers</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] overflow-hidden">
        {filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="mx-auto mb-4 text-[#920b4c]" size={48} />
            <h3 className="text-lg font-medium text-[#fcfbf9] mb-2">No subscribers found</h3>
            <p className="text-[#f8dae2]">
              {subscribers.length === 0
                ? 'Newsletter subscribers will appear here.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#4d0025] border-b border-[#920b4c]">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-[#f8dae2] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#920b4c]">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-[#920b4c]/20">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="text-[#f8dae2]" size={18} />
                        <span className="text-[#fcfbf9]">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#f8dae2]">
                        {formatDate(subscriber.subscribed_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          subscriber.is_active
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-red-900/50 text-red-300'
                        }`}
                      >
                        {subscriber.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => toggleSubscriberStatus(subscriber.id, subscriber.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            subscriber.is_active
                              ? 'text-[#f8dae2] hover:text-red-400 hover:bg-red-900/30'
                              : 'text-[#f8dae2] hover:text-green-400 hover:bg-green-900/30'
                          }`}
                          title={subscriber.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {subscriber.is_active ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        {deleteConfirm === subscriber.id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(subscriber.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-3 py-1 text-sm bg-[#920b4c] text-[#fcfbf9] rounded hover:bg-[#a80d58]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(subscriber.id)}
                            className="p-2 text-[#f8dae2] hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-[#f8dae2]">
        Showing {filteredSubscribers.length} of {subscribers.length} subscribers
      </div>
    </div>
  );
}
