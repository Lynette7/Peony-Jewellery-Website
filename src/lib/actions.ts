'use server';

import { createClient } from '@/lib/supabase/server';
import { OrderInsert, ContactMessageInsert, NewsletterSubscriberInsert, ReviewInsert, Review } from '@/types/database';
import { sendEmail, ADMIN_EMAIL } from '@/lib/email';
import React from 'react';
import OrderConfirmation from '@/emails/OrderConfirmation';
import AdminOrderNotification from '@/emails/AdminOrderNotification';
import WelcomeEmail from '@/emails/WelcomeEmail';
import NewsletterConfirmation from '@/emails/NewsletterConfirmation';
import ContactConfirmation from '@/emails/ContactConfirmation';
import AdminContactNotification from '@/emails/AdminContactNotification';

export async function createOrder(orderData: OrderInsert, mpesaCode?: string, shippingFee = 0) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const orderWithUserId = {
      ...orderData,
      user_id: user?.id || null,
    };
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderWithUserId])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }

    // ── Send emails (non-blocking) ──────────────────────────────────────────

    const orderItems: {
      id: string; name: string; price: number; quantity: number;
      image: string; variant?: string | null;
    }[] = Array.isArray(orderData.items) ? (orderData.items as {
      id: string; name: string; price: number; quantity: number;
      image: string; variant?: string | null;
    }[]) : [];

    const shipping = shippingFee;
    const subtotal = orderData.total - shipping;
    const total = orderData.total;

    const customerName = orderData.customer_name;
    const customerEmail = orderData.customer_email;
    const orderId = data.id as string;

    // Auto-save delivery address only for first-time buyers (no existing addresses)
    if (user?.id) {
      void (async () => {
        const { count } = await supabase
          .from('user_addresses')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if ((count ?? 0) === 0) {
          await supabase.from('user_addresses').insert({
            user_id: user.id,
            address: orderData.address,
            city: orderData.city ?? '',
            postal_code: orderData.postal_code || null,
            country: 'Kenya',
            is_default: true,
          });
        }
      })();
    }

    void Promise.all([
      // Customer confirmation
      sendEmail({
        to: customerEmail,
        subject: `Your Peony HQ order #${orderId} is confirmed 🌸`,
        react: React.createElement(OrderConfirmation, {
          customerName,
          customerEmail,
          orderId,
          items: orderItems,
          subtotal,
          shipping,
          total,
          paymentMethod: orderData.payment_method,
          deliveryAddress: orderData.address,
          city: orderData.city ?? '',
        }),
      }),
      // Admin notification
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `🛍️ New order #${orderId} — ${customerName} — KES ${total.toLocaleString()}`,
        react: React.createElement(AdminOrderNotification, {
          orderId,
          customerName,
          customerEmail,
          customerPhone: orderData.customer_phone,
          items: orderItems,
          total,
          paymentMethod: orderData.payment_method,
          deliveryAddress: orderData.address,
          city: orderData.city ?? '',
          mpesaCode,
        }),
      }),
    ]);

    return { success: true, data };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

export async function createContactMessage(messageData: ContactMessageInsert) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([messageData])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact message:', error);
      return { success: false, error: error.message };
    }

    // ── Send emails ─────────────────────────────────────────────────────────
    Promise.all([
      // Confirmation to sender
      sendEmail({
        to: messageData.email,
        subject: `We received your message — Peony HQ Kenya 🌸`,
        react: React.createElement(ContactConfirmation, {
          name: messageData.name,
          email: messageData.email,
          subject: messageData.subject,
          message: messageData.message,
        }),
      }),
      // Admin notification
      sendEmail({
        to: ADMIN_EMAIL,
        subject: `💌 New message from ${messageData.name} — "${messageData.subject}"`,
        react: React.createElement(AdminContactNotification, {
          senderName: messageData.name,
          senderEmail: messageData.email,
          senderPhone: messageData.phone ?? null,
          subject: messageData.subject,
          message: messageData.message,
        }),
      }),
    ]).catch((err) => console.error('[Contact email] Failed to send:', err));

    return { success: true, data };
  } catch (error) {
    console.error('Error creating contact message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

export async function subscribeToNewsletter(subscriberData: NewsletterSubscriberInsert) {
  try {
    const supabase = await createClient();
    
    // Check if email already exists
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', subscriberData.email)
      .single();

    if (existing) {
      // If already subscribed and active
      if (existing.is_active) {
        return { success: false, error: 'Email is already subscribed' };
      }
      // Reactivate if previously unsubscribed
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ is_active: true })
        .eq('id', existing.id);
      
      if (error) {
        console.error('Error reactivating subscription:', error);
        return { success: false, error: error.message };
      }

      // Re-send confirmation for reactivated subscriptions
      void sendEmail({
        to: subscriberData.email,
        subject: `Welcome back to Peony HQ! You're re-subscribed 🌸`,
        react: React.createElement(NewsletterConfirmation, { email: subscriberData.email }),
      });

      return { success: true, message: 'Subscription reactivated' };
    }

    // New subscription
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([subscriberData])
      .select()
      .single();

    if (error) {
      console.error('Error subscribing to newsletter:', error);
      return { success: false, error: error.message };
    }

    // Send confirmation email
    void sendEmail({
      to: subscriberData.email,
      subject: `You're on the list! Welcome to Peony HQ 🌸`,
      react: React.createElement(NewsletterConfirmation, { email: subscriberData.email }),
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}

export async function createReview(reviewData: ReviewInsert) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error creating review:', error);
    return { success: false, error: 'Failed to submit review' };
  }
}

export async function getProductReviews(productId: string): Promise<{ success: boolean; data?: Review[]; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { success: false, error: 'Failed to fetch reviews' };
  }
}

export async function getRelatedProducts(category: string, excludeId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .neq('id', excludeId)
      .limit(4);

    if (error) {
      console.error('Error fetching related products:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export async function getCategoryCoverImages(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const categories = ['earrings', 'necklaces', 'rings', 'bracelets', 'sets'];
    const coverImages: Record<string, string> = {};

    await Promise.all(
      categories.map(async (category) => {
        const { data } = await supabase
          .from('products')
          .select('image')
          .eq('category', category)
          .limit(1)
          .maybeSingle();

        coverImages[category] = data?.image ?? '';
      })
    );

    return coverImages;
  } catch (error) {
    console.error('Error fetching category cover images:', error);
    return {
      earrings: '',
      necklaces: '',
      rings: '',
      bracelets: '',
      sets: '',
    };
  }
}

// ── Email-only actions ────────────────────────────────────────────────────────

/** Called from the signup page after Supabase auth confirms user creation. */
export async function sendWelcomeEmail(email: string, firstName?: string) {
  return sendEmail({
    to: email,
    subject: `Welcome to Peony HQ Kenya 🌸`,
    react: React.createElement(WelcomeEmail, { email, firstName: firstName ?? '' }),
  });
}
