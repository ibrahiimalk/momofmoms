import { Locale, translations } from '@/lib/i18n';
import BookingForm from './BookingForm';

export default function BookAppointmentPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = translations[locale];
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-white max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.book.title}</h1>
        <p className="text-gray-500">
          {locale === 'ar' ? 'نحن هنا لمساعدتك في رحلة أمومتك' : 'We are here to support your motherhood journey'}
        </p>
      </div>
      <BookingForm locale={locale} t={t.book} />
    </div>
  );
}
