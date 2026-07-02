export const dynamic = 'force-dynamic';
import { locales, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { getContent } from '@/lib/content';
import { CartProvider } from '@/lib/cart-context';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const isRTL = locale === 'ar';
  const c = await getContent(locale);

  return (
    <CartProvider>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white ${isRTL ? 'font-arabic' : ''}`} style={{ backgroundColor: '#ffffff' }}>
        <Navbar locale={locale} content={c} />
        <main className="min-h-screen bg-white" style={{ backgroundColor: '#ffffff' }}>{children}</main>
        <Footer locale={locale} content={c} />
      </div>
    </CartProvider>
  );
}
