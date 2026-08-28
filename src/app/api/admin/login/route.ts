import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { verifyPassword, createSessionCookie } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  const db = getDb();
  const row = await db
    .prepare('SELECT id, password_hash FROM admin_users WHERE email = ?')
    .bind(email.trim().toLowerCase())
    .first<{ id: string; password_hash: string }>();

  if (!row) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
  }

  const { SESSION_SECRET } = getEnv();
  const cookie = await createSessionCookie(row.id, SESSION_SECRET);

  const res = NextResponse.json({ ok: true });
  res.headers.set('Set-Cookie', cookie);
  return res;
}
