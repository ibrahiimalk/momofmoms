import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDb, getEnv } from '@/lib/db';

export const dynamic = 'force-dynamic';

const FROM = 'MomOfMoms <noreply@momofmomskw.com>';

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

type OrderItem = { id: string; name_ar: string; name_en: string; price: number; quantity: number; image_url: string; stock_quantity: number };

function itemsTableEn(items: OrderItem[]) {
  const rows = items.map(i =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;">${esc(i.name_en)}</td><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;text-align:center;">${i.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;text-align:right;">${(i.price * i.quantity).toFixed(3)} KWD</td></tr>`
  ).join('');
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>`;
}

function itemsTableAr(items: OrderItem[]) {
  const rows = items.map(i =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;">${esc(i.name_ar)}</td><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;text-align:center;">${i.quantity}</td><td style="padding:8px 12px;border-bottom:1px solid #F0E8EC;">${(i.price * i.quantity).toFixed(3)} د.ك</td></tr>`
  ).join('');
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;" dir="rtl">${rows}</table>`;
}

function customerEmailHtml(name: string, items: OrderItem[], total: number, address: { area: string; block: string; street: string; avenue?: string; house: string }) {
  return `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDF8F4;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(187,94,134,.1);">
    <div style="background:linear-gradient(135deg,#BB5E86,#9B6BC4);padding:40px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:22px;">شكراً لك، ${esc(name)}! 🛍️</h1>
      <p style="color:rgba(255,255,255,.85);margin:8px 0 0;font-size:14px;">تم استلام طلبك بنجاح</p>
    </div>
    <div style="padding:32px;">
      <p style="color:#5C4048;font-size:15px;">سنتواصل معك قريباً لتأكيد موعد التوصيل.</p>
      <div style="background:#FDF0EC;border-radius:14px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 12px;color:#BB5E86;font-weight:700;font-size:14px;">المنتجات</p>
        ${itemsTableAr(items)}
        <p style="margin:12px 0 0;font-weight:700;color:#2D1B20;font-size:15px;text-align:left;">المجموع: ${total.toFixed(3)} د.ك</p>
      </div>
      <div style="background:#F5F0FA;border-radius:14px;padding:16px 20px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#BB5E86;font-weight:700;font-size:14px;">عنوان التوصيل</p>
        <p style="margin:0;color:#2D1B20;font-size:14px;line-height:1.8;">
          المنطقة: ${esc(address.area)}<br>
          القطعة: ${esc(address.block)}<br>
          الشارع: ${esc(address.street)}<br>
          ${address.avenue ? `الجادة: ${esc(address.avenue)}<br>` : ''}
          المنزل: ${esc(address.house)}
        </p>
      </div>
      <p style="color:#A08090;font-size:13px;text-align:center;">MomOfMoms — مستشارتك في الأمومة</p>
    </div>
  </div>
</body></html>`;
}

function adminEmailHtml(name: string, email: string, phone: string, items: OrderItem[], total: number, address: { area: string; block: string; street: string; avenue?: string; house: string }) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;">
    <div style="background:#2D1B20;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">🛍️ New Order</h1>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="color:#888;padding:6px 0;font-size:14px;width:80px;">Name</td><td style="font-weight:600;font-size:14px;">${esc(name)}</td></tr>
        <tr><td style="color:#888;padding:6px 0;font-size:14px;">Email</td><td style="font-size:14px;">${esc(email)}</td></tr>
        <tr><td style="color:#888;padding:6px 0;font-size:14px;">Phone</td><td style="font-size:14px;"><a href="${waLink(phone)}" style="color:#25D366;text-decoration:none;font-weight:600;">${esc(phone)} 💬</a></td></tr>
        <tr><td style="color:#888;padding:6px 0;font-size:14px;">Address</td><td style="font-size:14px;">Area: ${esc(address.area)}, Block: ${esc(address.block)}, Street: ${esc(address.street)}${address.avenue ? ', Ave: ' + esc(address.avenue) : ''}, House: ${esc(address.house)}</td></tr>
      </table>
      <div style="background:#FDF0EC;border-radius:12px;padding:16px 20px;margin-bottom:16px;">
        <p style="margin:0 0 10px;color:#BB5E86;font-weight:700;font-size:14px;">Order Items</p>
        ${itemsTableEn(items)}
        <p style="margin:12px 0 0;font-weight:700;color:#2D1B20;">Total: ${total.toFixed(3)} KWD</p>
      </div>
    </div>
  </div>
</body></html>`;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) return NextResponse.json({ error: 'Bad request' }, { status: 400 });

    const body = await req.json();
    const { name, email, phone, area, block, street, avenue, house, items } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (!phone || typeof phone !== 'string' || !/^[\d\s\+\-\(\)]{5,20}$/.test(phone.trim())) return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    if (!area || !block || !street || !house) return NextResponse.json({ error: 'Address incomplete' }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: 'No items' }, { status: 400 });

    const db = getDb();
    const { RESEND_API_KEY, ADMIN_EMAIL } = getEnv();
    const resend = new Resend(RESEND_API_KEY);
    const adminEmails = (ADMIN_EMAIL ?? 'ibrahiim.alk@gmail.com').split(',').map(e => e.trim()).filter(Boolean);

    // Rate limiting: max 3 orders per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const countRow = await db
      .prepare('SELECT COUNT(*) as count FROM orders WHERE phone = ? AND created_at >= ?')
      .bind(phone.trim(), oneHourAgo)
      .first<{ count: number }>();
    if ((countRow?.count ?? 0) >= 3) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    // Validate item shape and quantities from the client
    const requested = items as { id: string; quantity: number }[];
    for (const i of requested) {
      if (!i.id || typeof i.id !== 'string') return NextResponse.json({ error: 'Invalid item' }, { status: 400 });
      if (!Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 50) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    // Collapse duplicate lines for the same product so stock checks see the true total
    const quantityById = new Map<string, number>();
    for (const i of requested) {
      quantityById.set(i.id, (quantityById.get(i.id) ?? 0) + i.quantity);
    }

    // Fetch authoritative product data — never trust price/name/stock from the client
    const productIds = Array.from(quantityById.keys());
    const placeholders = productIds.map(() => '?').join(',');
    const { results: products } = await db
      .prepare(`SELECT id, name_ar, name_en, price, image_url, in_stock, quantity FROM products WHERE id IN (${placeholders})`)
      .bind(...productIds)
      .all<{ id: string; name_ar: string; name_en: string; price: number; image_url: string; in_stock: number; quantity: number }>();

    if (!products || products.length !== productIds.length) {
      return NextResponse.json({ error: 'One or more products not found' }, { status: 400 });
    }

    const verifiedItems: OrderItem[] = products.map((p: { id: string; name_ar: string; name_en: string; price: number; image_url: string; quantity: number }) => ({
      id: p.id, name_ar: p.name_ar, name_en: p.name_en, price: p.price,
      quantity: quantityById.get(p.id)!, image_url: p.image_url, stock_quantity: p.quantity,
    }));

    for (const item of verifiedItems) {
      if (!item.stock_quantity || item.quantity > item.stock_quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name_en}` }, { status: 400 });
      }
    }

    const total = verifiedItems.reduce((s, i) => s + i.price * i.quantity, 0);

    const orderId = crypto.randomUUID();
    try {
      await db.prepare(`
        INSERT INTO orders (id, name, email, phone, area, block, street, avenue, house, total_price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        orderId, name.trim(), email.trim(), phone.trim(),
        area.trim(), block.trim(), street.trim(),
        avenue?.trim() || null, house.trim(), total, 'pending'
      ).run();
    } catch (orderErr) {
      console.error('Order insert error:', orderErr);
      return NextResponse.json({ error: 'DB failed' }, { status: 500 });
    }

    // Insert order items
    const itemStatements = verifiedItems.map(i =>
      db.prepare(`
        INSERT INTO order_items (id, order_id, product_id, name_ar, name_en, price, quantity, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(crypto.randomUUID(), orderId, i.id, i.name_ar, i.name_en, i.price, i.quantity, i.image_url || null)
    );
    await db.batch(itemStatements);

    const addressObj = { area: area.trim(), block: block.trim(), street: street.trim(), avenue: avenue?.trim(), house: house.trim() };

    // Send admin email
    await resend.emails.send({
      from: FROM, to: adminEmails,
      subject: `🛍️ New Order — ${name.trim()} (${total.toFixed(3)} KWD)`,
      html: adminEmailHtml(name.trim(), email.trim(), phone.trim(), verifiedItems, total, addressObj),
    });

    // Send customer confirmation
    await resend.emails.send({
      from: FROM, to: [email.trim()],
      subject: 'تم استلام طلبك — MomOfMoms 🛍️',
      html: customerEmailHtml(name.trim(), verifiedItems, total, addressObj),
    });

    return NextResponse.json({ ok: true, orderId });
  } catch (err) {
    console.error('Order error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
