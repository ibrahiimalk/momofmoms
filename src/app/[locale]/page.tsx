export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { Locale, translations } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

async function getFeaturedProducts() {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .limit(6);
    return data || [];
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = translations[locale];
  const isRTL = locale === 'ar';
  const products = await getFeaturedProducts();

  const featureCards = [
    {
      href: `/${locale}/pregnancy-calculator`,
      label: t.home.pregnancyCalc,
      icon: '🗓️',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      desc: locale === 'ar' ? 'احسبي موعد الولادة المتوقع' : 'Calculate your due date',
    },
    {
      href: `/${locale}/book-appointment`,
      label: t.home.bookAppointment,
      icon: '📅',
      bg: 'bg-purple-50',
      border: 'border-purple-100',
      desc: locale === 'ar' ? 'احجزي موعدك الآن' : 'Book your session now',
    },
    {
      href: `/${locale}/awake-windows`,
      label: t.home.awakeWindows,
      icon: '🌅',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      desc: locale === 'ar' ? 'نوافذ اليقظة حسب عمر طفلك' : 'Baby awake windows by age',
    },
    {
      href: `/${locale}/shop`,
      label: t.home.shopDiapers,
      icon: '🛍️',
      bg: 'bg-pink-50',
      border: 'border-pink-100',
      desc: locale === 'ar' ? 'تسوقي قماط وملابس الأطفال' : 'Shop diapers & baby clothes',
    },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} style={{ background: '#FDF8F4' }}>

      {/* Hero */}
      <section className="min-h-[85vh] flex items-center px-6 py-16" style={{ background: 'linear-gradient(135deg, #FDF8F4 0%, #FAF0F5 50%, #FDF8F4 100%)' }}>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className={isRTL ? 'text-right' : 'text-left'}>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ background: '#FAE0EC', color: '#BB5E86' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#BB5E86' }} />
              {t.home.heroBadge}
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
              {t.home.heroHeading1}
              <br />
              <span className="italic" style={{ color: '#C4768A' }}>{t.home.heroHeading2}</span>
            </h1>

            {/* Description */}
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#7A6068' }}>
              {t.home.heroDesc}
            </p>

            {/* CTAs */}
            <div className={`flex gap-4 flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Link
                href={`/${locale}/book-appointment`}
                className="px-7 py-3 rounded-full font-semibold text-white transition-opacity hover:opacity-90 shadow-md"
                style={{ background: '#BB5E86' }}
              >
                {t.home.heroBook}
              </Link>
              <Link
                href={`/${locale}/pregnancy-calculator`}
                className="px-7 py-3 rounded-full font-semibold border-2 transition-colors hover:bg-pink-50"
                style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
              >
                {t.home.heroCalc}
              </Link>
            </div>
          </div>

          {/* Right: Illustration Card */}
          <div className="relative flex justify-center">
            {/* Soft background blobs */}
            <div className="absolute w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: '#FAE0EC', top: '-20px', right: '0' }} />
            <div className="absolute w-48 h-48 rounded-full opacity-20 blur-2xl" style={{ background: '#F2D873', bottom: '0', left: '20px' }} />

            {/* Card */}
            <div className="relative bg-white rounded-3xl shadow-xl p-8 w-72 flex flex-col items-center">
              {/* Due date badge */}
              <div className="self-start mb-4 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: '#FAF5FF', color: '#7C3AED' }}>
                <div className="uppercase tracking-wide opacity-70 text-[10px]">{t.home.estimatedDue}</div>
                <div className="text-base font-bold mt-0.5" style={{ color: '#BB5E86' }}>Jan 21, 2027</div>
              </div>

              {/* Illustration placeholder */}
              <div className="w-48 h-56 flex items-center justify-center rounded-2xl"
                style={{ background: 'linear-gradient(180deg, #FBE4D2 0%, #FAE0EC 100%)' }}>
                <span className="text-8xl">🤰</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`${card.bg} ${card.border} border rounded-2xl p-6 flex flex-col gap-3 hover:shadow-md transition-shadow group`}
            >
              <span className="text-4xl">{card.icon}</span>
              <div>
                <h2 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {card.label}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{card.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-16" style={{ background: '#FDF0F5' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
            {t.home.babyClothes}
          </h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {products.map((p: any) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🛍️</div>
              <p className="text-gray-500">
                {locale === 'ar' ? 'لا توجد منتجات بعد. أضف منتجات من لوحة التحكم.' : 'No products yet. Add products from the dashboard.'}
              </p>
            </div>
          )}
          {products.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href={`/${locale}/shop`}
                className="inline-block px-8 py-3 rounded-full font-semibold border-2 transition-colors hover:text-white"
                style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#BB5E86')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {locale === 'ar' ? 'عرض جميع المنتجات' : 'View All Products'}
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
