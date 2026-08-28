import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getDb, getEnv } from '@/lib/db';

export const dynamic = 'force-dynamic';

const FROM = 'MomOfMoms <noreply@momofmomskw.com>';

// Escape HTML to prevent injection in email templates
function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function waLink(phone: string): string {
  return `https://wa.me/${phone.replace(/[^\d]/g, '')}`;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s\+\-\(\)]{5,20}$/.test(phone);
}

function periodLabel(time: string) {
  if (time === 'morning') return { ar: 'الفترة الصباحية 🌅', en: 'Morning Period 🌅' };
  if (time === 'evening') return { ar: 'الفترة المسائية 🌙', en: 'Evening Period 🌙' };
  return { ar: esc(time), en: esc(time) };
}

function clientEmailHtml(name: string, period: { ar: string }, notes: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#FDF8F4;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(187,94,134,.1);">
    <div style="background:linear-gradient(135deg,#BB5E86,#9B6BC4);padding:40px 32px;text-align:center;">
      <h1 style="color:#fff;margin:0;font-size:26px;">شكراً لك، ${name}! 💌</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#5C4048;font-size:16px;line-height:1.7;">تم استلام طلب حجز موعدك بنجاح. سنتواصل معك في أقرب وقت لتأكيد الموعد.</p>
      <div style="background:#FDF0EC;border-radius:14px;padding:20px 24px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#BB5E86;font-weight:700;font-size:14px;">تفاصيل طلبك</p>
        <p style="margin:0;color:#2D1B20;font-size:14px;">الفترة: <strong>${period.ar}</strong></p>
        ${notes ? `<p style="margin:8px 0 0;color:#2D1B20;font-size:14px;">ملاحظات: ${notes}</p>` : ''}
      </div>
      <p style="color:#A08090;font-size:13px;text-align:center;">MomOfMoms — مستشارتك في الأمومة</p>
    </div>
  </div>
</body>
</html>`;
}

function adminEmailHtml(name: string, phone: string, email: string, period: { en: string }, notes: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;">
    <div style="background:#2D1B20;padding:28px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">📅 New Appointment Request</h1>
    </div>
    <div style="padding:32px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#888;padding:8px 0;font-size:14px;width:80px;">Name</td><td style="color:#2D1B20;font-weight:600;font-size:14px;">${name}</td></tr>
        <tr><td style="color:#888;padding:8px 0;font-size:14px;">Phone</td><td style="font-size:14px;"><a href="${waLink(phone)}" style="color:#25D366;text-decoration:none;font-weight:600;">${phone} 💬</a></td></tr>
        ${email ? `<tr><td style="color:#888;padding:8px 0;font-size:14px;">Email</td><td style="font-size:14px;">${email}</td></tr>` : ''}
        <tr><td style="color:#888;padding:8px 0;font-size:14px;">Period</td><td style="color:#2D1B20;font-weight:600;font-size:14px;">${period.en}</td></tr>
        ${notes ? `<tr><td style="color:#888;padding:8px 0;font-size:14px;">Notes</td><td style="color:#2D1B20;font-size:14px;">${notes}</td></tr>` : ''}
      </table>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    // Validate Content-Type
    const contentType = req.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    const body = await req.json();
    const { name, phone, email, time, notes } = body;

    // Required field validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!phone || typeof phone !== 'string' || !isValidPhone(phone.trim())) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }
    if (!time || !['morning', 'evening'].includes(time)) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 });
    }
    if (email && (typeof email !== 'string' || !isValidEmail(email.trim()))) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (notes && (typeof notes !== 'string' || notes.length > 500)) {
      return NextResponse.json({ error: 'Notes too long' }, { status: 400 });
    }

    // Sanitize inputs
    const safeName  = esc(name.trim());
    const safePhone = esc(phone.trim());
    const safeEmail = email ? esc(email.trim()) : '';
    const safeNotes = notes ? esc(notes.trim()) : '';

    const db = getDb();
    const { RESEND_API_KEY, ADMIN_EMAIL } = getEnv();
    const resend = new Resend(RESEND_API_KEY);
    const adminEmails = (ADMIN_EMAIL ?? 'ibrahiim.alk@gmail.com').split(',').map(e => e.trim()).filter(Boolean);

    // Basic rate limiting: max 3 submissions per phone per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const countRow = await db
      .prepare('SELECT COUNT(*) as count FROM appointments WHERE phone = ? AND created_at >= ?')
      .bind(phone.trim(), oneHourAgo)
      .first<{ count: number }>();

    if ((countRow?.count ?? 0) >= 3) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    // Insert to D1
    try {
      await db.prepare(
        'INSERT INTO appointments (id, name, phone, email, time, date, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        crypto.randomUUID(), name.trim(), phone.trim(), email?.trim() || null, time, '', notes?.trim() || '', 'pending'
      ).run();
    } catch (dbError) {
      console.error('DB error:', dbError);
      return NextResponse.json({ error: 'DB failed' }, { status: 500 });
    }

    const period = periodLabel(time);

    // Admin email
    const { data: adminData, error: adminError } = await resend.emails.send({
      from: FROM,
      to: adminEmails,
      subject: `📅 New Appointment — ${safeName}`,
      html: adminEmailHtml(safeName, safePhone, safeEmail, period, safeNotes),
    });
    if (adminError) console.error('Admin email error:', adminError);
    else console.log('Admin email sent:', adminData);

    // Customer email
    if (safeEmail) {
      const { data: clientData, error: clientError } = await resend.emails.send({
        from: FROM,
        to: [email.trim()],
        subject: 'تم استلام طلبك — MomOfMoms',
        html: clientEmailHtml(safeName, period, safeNotes),
      });
      if (clientError) console.error('Client email error:', clientError);
      else console.log('Client email sent:', clientData);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Appointment error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
