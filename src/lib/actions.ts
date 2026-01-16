'use server';

import { createClient } from '@/lib/supabase/server';
import { OrderInsert, ContactMessageInsert, NewsletterSubscriberInsert } from '@/types/database';

export async function createOrder(orderData: OrderInsert) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }

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

    return { success: true, data };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: 'Failed to subscribe' };
  }
}
