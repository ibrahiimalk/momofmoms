import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { results } = await db.prepare('SELECT * FROM categories ORDER BY order_index, created_at').all();
  return NextResponse.json({ categories: results });
}

export async function POST(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name_ar, name_en, order_index } = await req.json();
  if (!name_ar?.trim() || !name_en?.trim()) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO categories (id, name_ar, name_en, order_index) VALUES (?, ?, ?, ?)')
    .bind(id, name_ar.trim(), name_en.trim(), order_index ?? 0)
    .run();
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = getDb();
  await db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').bind(id).run();
  await db.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
  return NextResponse.json({ ok: true });
}
