import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Temporary diagnostic endpoint — remove after confirming emails work
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.TEST_SECRET && secret !== 'momofmoms-test-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const keyPresent = !!apiKey;
  const keyPrefix = apiKey ? apiKey.substring(0, 8) + '...' : 'NOT SET';

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: 'MomOfMoms <noreply@momofmomskw.com>',
    to: ['ibrahiim.alk@gmail.com'],
    subject: '✅ Test Email — MomOfMoms Diagnostic',
    html: '<p>This is a test email from the diagnostic endpoint. If you see this, Resend is working!</p>',
  });

  return NextResponse.json({
    keyPresent,
    keyPrefix,
    resendData: data,
    resendError: error,
  });
}
