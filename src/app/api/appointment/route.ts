import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = 'ibrahiim.alk@gmail.com';
const FROM = 'MomOfMoms <noreply@momofmoms.com>';

function periodLabel(time: string) {
  if (time === 'morning') return { ar: 'الفترة الصباحية 🌅', en: 'Morning Period 🌅' };
  if (time === 'evening') return { ar: 'الفترة المسائية 🌙', en: 'Evening Period 🌙' };
  return { ar: time, en: time };
}

function clientEmail(name: string, period: { ar: string; en: string }, notes: string) {
  return `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDF8F4;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(187,94,134,.1);">
    <div style="background:linear-gradient(135deg,#BB5E86,#9B6BC4);padding:40px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,.8);margin:0 0 4px;font-size:13px;letter-spacing:1px;">MomOfMoms</p>
      <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">شكراً لك، ${name}! 💌</h1>
    </div>
    <div style="padding:32px;">
      <p style="color:#5C4048;font-size:16px;line-height:1.7;margin:0 0 24px;">
        تم استلام طلب حجز موعدك بنجاح. سنتواصل معك في أقرب وقت لتأكيد الموعد.
      </p>
      <div style="background:#FDF0EC;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 10px;color:#BB5E86;font-weight:700;font-size:14px;">تفاصيل طلبك</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="color:#7A6068;font-size:14px;padding:6px 0;">الفترة المفضلة</td>
            <td style="color:#2D1B20;font-size:14px;font-weight:600;text-align:left;">${period.ar}</td>
          </tr>
          ${notes ? `<tr><td style="color:#7A6068;font-size:14px;padding:6px 0;">ملاحظات</td><td style="color:#2D1B20;font-size:14px;">${notes}</td></tr>` : ''}
        </table>
      </div>
      <p style="color:#A08090;font-size:13px;text-align:center;margin:0;">
        إذا كان لديكِ أي استفسار، لا تترددي في التواصل معنا.<br>
        MomOfMoms — مستشارتك في الأمومة
      </p>
    </div>
  </div>
</body>
</html>`;
}

function adminEmail(name: string, phone: string, email: string, period: { ar: string; en: string }, notes: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08);">
    <div style="background:#2D1B20;padding:28px 32px;">
      <p style="color:#BB5E86;margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">New Appointment</p>
      <h1 style="color:#fff;margin:0;font-size:22px;">📅 Booking Request</h1>
    </div>
    <div style="padding:32px;">
      <div style="background:#FDF8F4;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#888;font-size:13px;padding:7px 0;width:100px;">Name</td><td style="color:#2D1B20;font-weight:600;font-size:14px;">${name}</td></tr>
          <tr><td style="color:#888;font-size:13px;padding:7px 0;">Phone</td><td style="color:#2D1B20;font-weight:600;font-size:14px;"><a href="tel:${phone}" style="color:#BB5E86;">${phone}</a></td></tr>
          ${email ? `<tr><td style="color:#888;font-size:13px;padding:7px 0;">Email</td><td style="color:#2D1B20;font-size:14px;"><a href="mailto:${email}" style="color:#BB5E86;">${email}</a></td></tr>` : ''}
          <tr><td style="color:#888;font-size:13px;padding:7px 0;">Period</td><td style="color:#2D1B20;font-weight:600;font-size:14px;">${period.en}</td></tr>
          ${notes ? `<tr><td style="color:#888;font-size:13px;padding:7px 0;">Notes</td><td style="color:#2D1B20;font-size:14px;">${notes}</td></tr>` : ''}
        </table>
      </div>
      <p style="color:#aaa;font-size:12px;text-align:center;margin:0;">MomOfMoms Admin Notification</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, time, notes } = body;

    if (!name || !phone || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert appointment into Supabase
    const { error: dbError } = await supabase
      .from('appointments')
      .insert([{ name, phone, email: email || null, time, date: '', notes: notes || '', status: 'pending' }]);

    if (dbError) throw dbError;

    const period = periodLabel(time);

    // Send both emails in parallel
    await Promise.all([
      // Admin notification (always)
      resend.emails.send({
        from: FROM,
        to: ADMIN_EMAIL,
        subject: `📅 New Appointment — ${name}`,
        html: adminEmail(name, phone, email, period, notes),
      }),
      // Customer confirmation (only if they gave an email)
      ...(email ? [resend.emails.send({
        from: FROM,
        to: email,
        subject: 'تم استلام طلبك — MomOfMoms',
        html: clientEmail(name, period, notes),
      })] : []),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('appointment error:', err);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
