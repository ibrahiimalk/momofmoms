import { NextRequest, NextResponse } from 'next/server';
import { getDb, getEnv } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = getDb();
  const [{ results: orders }, { results: items }] = await Promise.all([
    db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all<Record<string, unknown>>(),
    db.prepare('SELECT * FROM order_items').all<Record<string, unknown>>(),
  ]);

  const itemsByOrder = new Map<string, unknown[]>();
  for (const item of items || []) {
    const orderId = item.order_id as string;
    if (!itemsByOrder.has(orderId)) itemsByOrder.set(orderId, []);
    itemsByOrder.get(orderId)!.push(item);
  }

  const enriched = (orders || []).map((o: Record<string, unknown>) => ({ ...o, order_items: itemsByOrder.get(o.id as string) || [] }));
  return NextResponse.json({ orders: enriched });
}

export async function PUT(req: NextRequest) {
  const { SESSION_SECRET } = getEnv();
  if (!(await requireAdmin(req, SESSION_SECRET))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const db = getDb();
  await db.prepare('UPDATE orders SET status = ? WHERE id = ?').bind(status, id).run();
  return NextResponse.json({ ok: true });
}
