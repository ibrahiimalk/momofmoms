export const dynamic = 'force-dynamic';
import { Locale } from '@/lib/i18n';
import { getContent } from '@/lib/content';
import PregnancyCalcClient from './PregnancyCalcClient';

export default async function PregnancyCalculatorPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';
  const c = await getContent(locale);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen max-w-2xl mx-auto px-4 py-10" style={{ background: '#FDF8F4' }}>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>{c['pregcalc.title']}</h1>
        <p style={{ color: '#7A6068' }}>{c['pregcalc.subtitle']}</p>
      </div>
      <PregnancyCalcClient locale={locale} content={c} />
    </div>
  );
}
