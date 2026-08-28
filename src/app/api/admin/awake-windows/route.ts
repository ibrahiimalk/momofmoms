import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { results } = await db.prepare('SELECT * FROM awake_windows ORDER BY order_index').all();
  return NextResponse.json({ items: results });
}

export async function POST(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { label_ar, label_en, image_url, order_index } = await req.json();
  if (!label_ar || !label_en) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = getDb();
  const id = crypto.randomUUID();
  await db.prepare('INSERT INTO awake_windows (id, label_ar, label_en, image_url, order_index) VALUES (?, ?, ?, ?, ?)')
    .bind(id, label_ar, label_en, image_url || null, order_index ?? 0)
    .run();
  return NextResponse.json({ ok: true, id });
}

export async function PUT(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, label_ar, label_en, image_url, order_index } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = getDb();
  await db.prepare('UPDATE awake_windows SET label_ar=?, label_en=?, image_url=?, order_index=? WHERE id=?')
    .bind(label_ar, label_en, image_url || null, order_index ?? 0, id)
    .run();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const db = getDb();
  await db.prepare('DELETE FROM awake_windows WHERE id = ?').bind(id).run();
  return NextResponse.json({ ok: true });
}
