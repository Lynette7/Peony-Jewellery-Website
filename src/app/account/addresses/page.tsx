'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, MapPin, Edit2, Trash2, Star, Loader2,
  CheckCircle, AlertCircle, Plus, Save, X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import CityDropdown from '@/components/ui/CityDropdown';
import { UserAddress } from '@/types/database';

type AddressForm = { address: string; city: string; postal_code: string };
const emptyForm: AddressForm = { address: '', city: '', postal_code: '' };

export default function AddressesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<AddressForm>(emptyForm);
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<AddressForm>(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchAddresses() {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });
      if (!error) setAddresses(data || []);
      setIsLoading(false);
    }
    if (user) fetchAddresses();
  }, [user, supabase]);

  const flash = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleStartEdit = (addr: UserAddress) => {
    setEditingId(addr.id);
    setEditForm({
      address: addr.address,
      city: addr.city,
      postal_code: addr.postal_code || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.address || !editForm.city) return;
    setError('');
    const { error } = await supabase
      .from('user_addresses')
      .update({
        address: editForm.address,
        city: editForm.city,
        postal_code: editForm.postal_code || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId);
    if (error) { setError('Failed to update address.'); return; }
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === editingId
          ? { ...a, address: editForm.address, city: editForm.city, postal_code: editForm.postal_code || null }
          : a
      )
    );
    setEditingId(null);
    flash('Address updated.');
  };

  const handleDelete = async (id: string) => {
    setError('');
    const { error } = await supabase.from('user_addresses').delete().eq('id', id);
    if (error) { setError('Failed to delete address.'); return; }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    flash('Address deleted.');
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    setError('');
    await supabase
      .from('user_addresses')
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id);
    const { error } = await supabase
      .from('user_addresses')
      .update({ is_default: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) { setError('Failed to set default address.'); return; }
    setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    flash('Default address updated.');
  };

  const handleAdd = async () => {
    if (!user || !addForm.address || !addForm.city) return;
    setError('');
    const isFirst = addresses.length === 0;
    const { data, error } = await supabase
      .from('user_addresses')
      .insert({
        user_id: user.id,
        address: addForm.address,
        city: addForm.city,
        postal_code: addForm.postal_code || null,
        country: 'Kenya',
        is_default: isFirst,
      })
      .select()
      .single();
    if (error) { setError('Failed to add address.'); return; }
    setAddresses((prev) => [...prev, data]);
    setIsAdding(false);
    setAddForm(emptyForm);
    flash('Address added.');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading addresses...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-foreground">My Addresses</h1>
          <p className="text-muted-foreground mt-2">Manage your delivery addresses</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

        {/* Feedback banners */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center space-x-2 text-red-700 dark:text-red-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-lg flex items-center space-x-2 text-green-700 dark:text-green-300">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Address list */}
        {addresses.length === 0 && !isAdding && (
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <MapPin className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No saved addresses yet.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Addresses are saved automatically after you place an order.
            </p>
          </div>
        )}

        {addresses.map((addr) => (
          <div key={addr.id} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            {editingId === addr.id ? (
              /* ── Edit form ── */
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Edit Address</h3>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City / Town *</label>
                  <CityDropdown
                    value={editForm.city}
                    onChange={(city) => setEditForm((f) => ({ ...f, city }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
                  <input
                    type="text"
                    value={editForm.postal_code}
                    onChange={(e) => setEditForm((f) => ({ ...f, postal_code: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Postal code (optional)"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={!editForm.address || !editForm.city}
                    className="flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* ── Display view ── */
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="text-primary mt-0.5 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-foreground font-medium">{addr.address}</p>
                    <p className="text-muted-foreground text-sm">{addr.city}{addr.postal_code ? `, ${addr.postal_code}` : ''}</p>
                    <p className="text-muted-foreground text-sm">{addr.country}</p>
                    {addr.is_default && (
                      <span className="inline-flex items-center space-x-1 mt-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        <Star size={10} fill="currentColor" />
                        <span>Default</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      title="Set as default"
                      className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Star size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => handleStartEdit(addr)}
                    title="Edit address"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    title="Delete address"
                    className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add new address */}
        {isAdding ? (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-foreground">New Address</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Street Address *</label>
              <input
                type="text"
                value={addForm.address}
                onChange={(e) => setAddForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">City / Town *</label>
              <CityDropdown
                value={addForm.city}
                onChange={(city) => setAddForm((f) => ({ ...f, city }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Postal Code</label>
              <input
                type="text"
                value={addForm.postal_code}
                onChange={(e) => setAddForm((f) => ({ ...f, postal_code: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Postal code (optional)"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => { setIsAdding(false); setAddForm(emptyForm); }}
                className="flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </Button>
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!addForm.address || !addForm.city}
                className="flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Address</span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 w-full justify-center"
          >
            <Plus size={18} />
            <span>Add New Address</span>
          </Button>
        )}
      </div>
    </div>
  );
}
