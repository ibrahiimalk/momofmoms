import { locales, Locale } from '@/lib/i18n';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) notFound();

  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className={`bg-white ${isRTL ? 'font-arabic' : ''}`} style={{ backgroundColor: '#ffffff' }}>
      <Navbar locale={locale} />
      <main className="min-h-screen bg-white" style={{ backgroundColor: '#ffffff' }}>{children}</main>
      <Footer locale={locale} />
    </div>
  );
}
