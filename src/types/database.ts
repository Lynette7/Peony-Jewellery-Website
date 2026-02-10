export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'sets';
          image: string;
          images: string[];
          in_stock: boolean;
          featured: boolean;
          specifications: Json | null;
          variants: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          category: 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'sets';
          image: string;
          images?: string[];
          in_stock?: boolean;
          featured?: boolean;
          specifications?: Json | null;
          variants?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: 'earrings' | 'necklaces' | 'rings' | 'bracelets' | 'sets';
          image?: string;
          images?: string[];
          in_stock?: boolean;
          featured?: boolean;
          specifications?: Json | null;
          variants?: Json | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          postal_code: string;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total: number;
          items: Json;
          payment_method: 'mpesa' | 'card';
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          address: string;
          city: string;
          postal_code: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total: number;
          items: Json;
          payment_method: 'mpesa' | 'card';
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          address?: string;
          city?: string;
          postal_code?: string;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          total?: number;
          items?: Json;
          payment_method?: 'mpesa' | 'card';
          user_id?: string | null;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          subject: string;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          subject: string;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          subject?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          subscribed_at: string;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          subscribed_at?: string;
          is_active?: boolean;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          customer_name: string;
          customer_email: string;
          rating: number;
          title: string | null;
          review_text: string;
          verified_purchase: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          customer_name: string;
          customer_email: string;
          rating: number;
          title?: string | null;
          review_text: string;
          verified_purchase?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          customer_name?: string;
          customer_email?: string;
          rating?: number;
          title?: string | null;
          review_text?: string;
          verified_purchase?: boolean;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_addresses: {
        Row: {
          id: string;
          user_id: string;
          address: string;
          city: string;
          postal_code: string | null;
          country: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          address: string;
          city: string;
          postal_code?: string | null;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          address?: string;
          city?: string;
          postal_code?: string | null;
          country?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_payment_methods: {
        Row: {
          id: string;
          user_id: string;
          type: 'mpesa' | 'card';
          last_four: string | null;
          phone: string | null;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'mpesa' | 'card';
          last_four?: string | null;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'mpesa' | 'card';
          last_four?: string | null;
          phone?: string | null;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_wishlists: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          created_at?: string;
        };
      };
      user_carts: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Helper types for easier usage
export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
export type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];
export type ContactMessageUpdate = Database['public']['Tables']['contact_messages']['Update'];

export type NewsletterSubscriber = Database['public']['Tables']['newsletter_subscribers']['Row'];
export type NewsletterSubscriberInsert = Database['public']['Tables']['newsletter_subscribers']['Insert'];
export type NewsletterSubscriberUpdate = Database['public']['Tables']['newsletter_subscribers']['Update'];

export type Review = Database['public']['Tables']['reviews']['Row'];
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert'];
export type ReviewUpdate = Database['public']['Tables']['reviews']['Update'];

export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
export type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export type UserAddress = Database['public']['Tables']['user_addresses']['Row'];
export type UserAddressInsert = Database['public']['Tables']['user_addresses']['Insert'];
export type UserAddressUpdate = Database['public']['Tables']['user_addresses']['Update'];

export type UserPaymentMethod = Database['public']['Tables']['user_payment_methods']['Row'];
export type UserPaymentMethodInsert = Database['public']['Tables']['user_payment_methods']['Insert'];
export type UserPaymentMethodUpdate = Database['public']['Tables']['user_payment_methods']['Update'];

export type UserWishlist = Database['public']['Tables']['user_wishlists']['Row'];
export type UserWishlistInsert = Database['public']['Tables']['user_wishlists']['Insert'];
export type UserWishlistUpdate = Database['public']['Tables']['user_wishlists']['Update'];

export type UserCart = Database['public']['Tables']['user_carts']['Row'];
export type UserCartInsert = Database['public']['Tables']['user_carts']['Insert'];
export type UserCartUpdate = Database['public']['Tables']['user_carts']['Update'];
