import { Locale } from '@/lib/i18n';
import CartPage from './CartPage';

export default function CartRoute({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen px-4 py-10" style={{ background: '#FDF8F4' }}>
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
          {isRTL ? '🛍️ سلة التسوق' : '🛍️ Shopping Cart'}
        </h1>
      </div>
      <CartPage locale={locale} />
    </div>
  );
}
