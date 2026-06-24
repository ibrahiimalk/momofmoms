import { Locale, translations } from '@/lib/i18n';
import PregnancyCalcClient from './PregnancyCalcClient';

export default function PregnancyCalculatorPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = translations[locale];
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🗓️</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.calc.title}</h1>
        <p className="text-gray-500">{t.calc.subtitle}</p>
      </div>
      <PregnancyCalcClient locale={locale} t={t.calc} />
    </div>
  );
}
