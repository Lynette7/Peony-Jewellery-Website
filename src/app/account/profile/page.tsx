'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Mail, Phone, Loader2, CheckCircle,
  AlertCircle, Camera, Shield, Clock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { saveUserProfile } from '@/lib/actions';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [savedField, setSavedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const lastSavedRef = useRef({ firstName: '', lastName: '', phone: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/account/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user?.email]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      try {
        const [{ data: { session } }, { data: profile, error: profileError }] = await Promise.all([
          supabase.auth.getSession(),
          supabase.from('user_profiles').select('*').eq('id', user.id).single(),
        ]);

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        const rawMetaData = session?.user?.user_metadata || {};
        const createdAt = session?.user?.created_at || '';

        const fetched = {
          firstName: profile?.first_name || rawMetaData.first_name || rawMetaData.firstName || user.firstName || '',
          lastName: profile?.last_name || rawMetaData.last_name || rawMetaData.lastName || user.lastName || '',
          email: user.email || '',
          phone: profile?.phone || user.phone || '',
        };

        setFormData(fetched);
        lastSavedRef.current = { firstName: fetched.firstName, lastName: fetched.lastName, phone: fetched.phone };
        if (createdAt) {
          setMemberSince(
            new Date(createdAt).toLocaleDateString('en-KE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })
          );
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      }
    }

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id, supabase]);

  const saveProfile = useCallback(async (
    data: { firstName: string; lastName: string; phone: string },
    fieldName?: string,
  ) => {
    if (!user) return;

    const unchanged =
      data.firstName === lastSavedRef.current.firstName &&
      data.lastName === lastSavedRef.current.lastName &&
      data.phone === lastSavedRef.current.phone;
    if (unchanged) return;

    setIsSaving(true);
    setError('');
    setSavedField(null);

    try {
      updateProfile({
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });

      const result = await saveUserProfile(user.id, {
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        phone: data.phone || undefined,
      });

      if (!result.success) throw new Error(result.error);

      lastSavedRef.current = { ...data };
      if (fieldName) {
        setSavedField(fieldName);
        setTimeout(() => setSavedField(null), 2000);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  }, [user, updateProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setSavedField(null);
  };

  const handleBlur = (fieldName: string) => {
    saveProfile(
      { firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone },
      fieldName,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile(
      { firstName: formData.firstName, lastName: formData.lastName, phone: formData.phone },
      'all',
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    formData.firstName || formData.lastName
      ? `${formData.firstName} ${formData.lastName}`.trim()
      : null;

  const initials =
    formData.firstName || formData.lastName
      ? `${(formData.firstName?.[0] || '').toUpperCase()}${(formData.lastName?.[0] || '').toUpperCase()}`
      : formData.email?.[0]?.toUpperCase() || '?';

  const inputClasses =
    'w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/account"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Account</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Avatar Card */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-primary text-background flex items-center justify-center text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-default">
                <Camera size={22} className="text-white" />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground">
                {displayName || 'Set up your name'}
              </h2>
              <p className="text-muted-foreground text-sm">{formData.email}</p>
              {memberSince && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground justify-center sm:justify-start">
                  <Clock size={12} />
                  <span>Member since {memberSince}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl flex items-center space-x-2 text-red-700 dark:text-red-300">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Personal Info Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <User size={18} className="text-primary" />
                Personal Information
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Changes are saved automatically when you leave a field
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Name Row */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('firstName')}
                      className={inputClasses}
                      placeholder="First name"
                    />
                    {savedField === 'firstName' && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1.5">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('lastName')}
                      className={inputClasses}
                      placeholder="Last name"
                    />
                    {savedField === 'lastName' && (
                      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                    )}
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phone')}
                    className={inputClasses}
                    placeholder="0712 345 678"
                  />
                  {savedField === 'phone' && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" size={18} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Email Section */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden mt-6">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Account
              </h3>
            </div>

            <div className="p-6">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Email is tied to your account and cannot be changed here.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6">
            <div className="text-sm text-muted-foreground flex items-center gap-1.5">
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={14} />
                  <span>Saving...</span>
                </>
              ) : savedField === 'all' ? (
                <>
                  <CheckCircle className="text-green-500" size={14} />
                  <span className="text-green-600 dark:text-green-400">All changes saved</span>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/account">
                <Button type="button" variant="ghost" size="sm">
                  Back
                </Button>
              </Link>
              <Button type="submit" size="sm" disabled={isSaving}>
                Save All Changes
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
