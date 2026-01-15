'use server';

import { createClient } from '@/lib/supabase/server';
import { OrderInsert, ContactMessageInsert } from '@/types/database';

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
