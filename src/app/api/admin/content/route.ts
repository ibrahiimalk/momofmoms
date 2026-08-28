import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { key, ar, en } = await req.json();
  if (!key) return NextResponse.json({ error: 'Missing key' }, { status: 400 });

  const db = getDb();
  await db.prepare('INSERT INTO site_content (key, ar, en) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET ar=excluded.ar, en=excluded.en')
    .bind(key, ar || '', en || '')
    .run();

  return NextResponse.json({ ok: true });
}
