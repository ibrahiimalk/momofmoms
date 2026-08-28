import { getCloudflareContext } from '@opennextjs/cloudflare';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';

export function getDb(): D1Database {
  const { env } = getCloudflareContext();
  return (env as unknown as { DB: D1Database }).DB;
}

export function getBucket(): R2Bucket {
  const { env } = getCloudflareContext();
  return (env as unknown as { IMAGES: R2Bucket }).IMAGES;
}

export function getEnv() {
  return getCloudflareContext().env as unknown as {
    DB: D1Database;
    IMAGES: R2Bucket;
    SESSION_SECRET: string;
    RESEND_API_KEY: string;
    ADMIN_EMAIL?: string;
    PUBLIC_IMAGES_BASE_URL: string;
  };
}

export type Category = {
  id: string;
  name_ar: string;
  name_en: string;
  order_index: number;
  created_at: string;
};

export type Product = {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  price: number;
  category: string | null;
  category_id: string | null;
  categories?: Category;
  image_url: string;
  gallery_images: string[];
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
  email: string | null;
  phone: string;
  date: string;
  time: string;
  notes: string | null;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
};

export type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  area: string;
  block: string;
  street: string;
  avenue: string | null;
  house: string;
  total_price: number;
  status: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  quantity: number;
  image_url: string | null;
};

// Raw product row from D1 has gallery_images as a JSON string and in_stock as 0/1.
// This normalizes it to match the app's expected shape.
export function normalizeProduct(row: Record<string, unknown>): Product {
  return {
    ...(row as unknown as Product),
    in_stock: Boolean(row.in_stock),
    gallery_images: typeof row.gallery_images === 'string' ? JSON.parse(row.gallery_images) : (row.gallery_images ?? []),
  };
}
