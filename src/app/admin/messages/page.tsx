'use client';

import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, Mail, Phone, Trash2, Check, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { ContactMessage } from '@/types/database';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [readFilter, setReadFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    let filtered = messages;

    if (searchQuery) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.message.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (readFilter === 'unread') {
      filtered = filtered.filter((m) => !m.read);
    } else if (readFilter === 'read') {
      filtered = filtered.filter((m) => m.read);
    }

    setFilteredMessages(filtered);
  }, [messages, searchQuery, readFilter]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string, read: boolean) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read })
        .eq('id', id);

      if (error) throw error;

      setMessages(
        messages.map((m) => (m.id === id ? { ...m, read } : m))
      );

      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read });
      }
    } catch (err) {
      console.error('Failed to update message:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMessages(messages.filter((m) => m.id !== id));
      setDeleteConfirm(null);

      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  const openMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.id, true);
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

  const unreadCount = messages.filter((m) => !m.read).length;

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
        <h1 className="text-2xl font-bold text-[#fcfbf9]">Messages</h1>
        <p className="text-[#f8dae2]">
          View and manage contact form submissions
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-[#920b4c] text-[#fcfbf9] text-xs rounded-full">
              {unreadCount} unread
            </span>
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#f8dae2]" size={20} />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9] placeholder-[#f8dae2]/50"
            />
          </div>
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-4 py-2 bg-[#4d0025] border border-[#920b4c] rounded-lg focus:ring-2 focus:ring-[#f8dae2] focus:border-transparent text-[#fcfbf9]"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-[#5a002d] rounded-xl shadow-sm border border-[#920b4c] overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="mx-auto mb-4 text-[#920b4c]" size={48} />
            <h3 className="text-lg font-medium text-[#fcfbf9] mb-2">No messages found</h3>
            <p className="text-[#f8dae2]">
              {messages.length === 0
                ? 'Messages from your contact form will appear here.'
                : 'Try adjusting your search or filter.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#920b4c]">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-4 hover:bg-[#920b4c]/20 cursor-pointer transition-colors ${
                  !message.read ? 'bg-[#920b4c]/30' : ''
                }`}
                onClick={() => openMessage(message)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {!message.read && (
                        <span className="w-2 h-2 bg-[#f8dae2] rounded-full flex-shrink-0"></span>
                      )}
                      <p className={`font-medium truncate ${!message.read ? 'text-[#fcfbf9]' : 'text-[#f8dae2]'}`}>
                        {message.name}
                      </p>
                      <span className="text-[#920b4c]">•</span>
                      <p className="text-sm text-[#f8dae2] truncate">{message.email}</p>
                    </div>
                    <p className={`font-medium mb-1 ${!message.read ? 'text-[#fcfbf9]' : 'text-[#f8dae2]'}`}>
                      {message.subject}
                    </p>
                    <p className="text-sm text-[#f8dae2]/70 line-clamp-2">{message.message}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                    <p className="text-xs text-[#f8dae2]/70">{formatDate(message.created_at)}</p>
                    <div className="flex items-center space-x-1">
                      {deleteConfirm === message.id ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(message.id);
                            }}
                            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(null);
                            }}
                            className="px-2 py-1 text-xs bg-[#920b4c] text-[#fcfbf9] rounded hover:bg-[#a80d58]"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(message.id);
                          }}
                          className="p-1 text-[#f8dae2] hover:text-red-400 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-sm text-[#f8dae2]">
        Showing {filteredMessages.length} of {messages.length} messages
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#5a002d] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#920b4c]">
            <div className="p-6 border-b border-[#920b4c] flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#fcfbf9]">{selectedMessage.subject}</h2>
                <p className="text-sm text-[#f8dae2] mt-1">
                  {formatDate(selectedMessage.created_at)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                  className={`p-2 rounded-lg transition-colors ${
                    selectedMessage.read
                      ? 'text-[#f8dae2] hover:bg-[#920b4c]/50'
                      : 'text-[#fcfbf9] bg-[#920b4c] hover:bg-[#a80d58]'
                  }`}
                  title={selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="p-2 hover:bg-[#920b4c]/50 rounded-lg text-[#f8dae2]"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="bg-[#4d0025] rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-[#920b4c] rounded-full flex items-center justify-center text-[#fcfbf9] font-medium">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-[#fcfbf9]">{selectedMessage.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-[#f8dae2]">
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="flex items-center hover:text-[#fcfbf9]"
                      >
                        <Mail size={14} className="mr-1" />
                        {selectedMessage.email}
                      </a>
                      {selectedMessage.phone && (
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="flex items-center hover:text-[#fcfbf9]"
                        >
                          <Phone size={14} className="mr-1" />
                          {selectedMessage.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h3 className="text-sm font-medium text-[#f8dae2] mb-2">Message</h3>
                <div className="bg-[#4d0025] rounded-lg p-4">
                  <p className="text-[#f8dae2] whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[#920b4c]">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-[#920b4c] text-[#fcfbf9] rounded-lg hover:bg-[#a80d58] transition-colors"
                >
                  <Mail size={18} />
                  <span>Reply via Email</span>
                </a>
                {selectedMessage.phone && (
                  <a
                    href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
                  >
                    <Phone size={18} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
