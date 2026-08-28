import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { verifySessionCookie } from '@/lib/auth';

const locales = ['ar', 'en'];
const defaultLocale = 'ar';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internals and API routes entirely
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Admin routes — completely separate from locale system
  if (pathname.startsWith('/admin')) {
    // Login page is always accessible
    if (pathname === '/admin/login') return NextResponse.next();

    // All other admin routes require a valid session cookie
    const { env } = await getCloudflareContext({ async: true });
    const secret = (env as unknown as { SESSION_SECRET: string }).SESSION_SECRET;
    const adminId = await verifySessionCookie(request.headers.get('cookie'), secret);
    if (!adminId) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Locale redirect for public routes
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  if (pathnameHasLocale) return NextResponse.next();

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|images|.*\\..*).*)'],
};
