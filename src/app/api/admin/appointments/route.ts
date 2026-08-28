import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const { results } = await db.prepare('SELECT * FROM appointments ORDER BY created_at DESC').all();
  return NextResponse.json({ appointments: results });
}

export async function PUT(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = getDb();
  await db.prepare('UPDATE appointments SET status = ? WHERE id = ?').bind(status, id).run();
  return NextResponse.json({ ok: true });
}
