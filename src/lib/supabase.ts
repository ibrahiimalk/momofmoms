import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
});

export type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  quantity: number;
  created_at: string;
};

export type AwakeWindow = {
  id: string;
  label_ar: string;
  label_en: string;
  image_url: string;
  order_index: number;
};

export type Appointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};
