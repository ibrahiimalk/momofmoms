import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv, normalizeProduct } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { results } = await db.prepare(`
    SELECT p.*, c.id as cat_id, c.name_ar as cat_name_ar, c.name_en as cat_name_en
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.category_id, p.created_at DESC
  `).all<Record<string, unknown>>();

  const products = (results || []).map((row: Record<string, unknown>) => {
    const p = normalizeProduct(row);
    if (row.cat_id) {
      p.categories = { id: row.cat_id as string, name_ar: row.cat_name_ar as string, name_en: row.cat_name_en as string, order_index: 0, created_at: '' };
    }
    return p;
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name_ar, name_en, description_ar, description_en, price, quantity, category_id, image_url, gallery_images, in_stock } = body;
  if (!name_ar || !name_en || !category_id) return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO products (id, name_ar, name_en, description_ar, description_en, price, quantity, category_id, image_url, gallery_images, in_stock)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id, name_ar, name_en, description_ar || '', description_en || '',
    price || 0, quantity || 0, category_id, image_url || null,
    JSON.stringify(gallery_images || []), in_stock ? 1 : 0
  ).run();

  return NextResponse.json({ ok: true, id });
}

export async function PUT(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { id, name_ar, name_en, description_ar, description_en, price, quantity, category_id, image_url, gallery_images, in_stock } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = getDb();
  await db.prepare(`
    UPDATE products SET name_ar=?, name_en=?, description_ar=?, description_en=?, price=?, quantity=?, category_id=?, image_url=?, gallery_images=?, in_stock=?
    WHERE id=?
  `).bind(
    name_ar, name_en, description_ar || '', description_en || '',
    price || 0, quantity || 0, category_id, image_url || null,
    JSON.stringify(gallery_images || []), in_stock ? 1 : 0, id
  ).run();

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = getDb();
  await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  return NextResponse.json({ ok: true });
}
