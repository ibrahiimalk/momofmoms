export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
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
      <section className="min-h-[90vh] flex items-center px-6 py-16 overflow-hidden relative"
        style={{ background: 'linear-gradient(160deg, #FDF8F4 0%, #FAF0F5 60%, #FDF8F4 100%)' }}>

        {/* Background blobs */}
        <div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #FAE0EC 0%, transparent 70%)', top: '-100px', right: isRTL ? 'auto' : '-100px', left: isRTL ? '-100px' : 'auto', opacity: 0.5 }} />
        <div className="absolute w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F2D873 0%, transparent 70%)', bottom: '0', left: isRTL ? 'auto' : '10%', right: isRTL ? '10%' : 'auto', opacity: 0.25 }} />

        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text side */}
          <div className={`relative z-10 ${isRTL ? 'text-right order-2 md:order-2' : 'text-left order-2 md:order-1'}`}>
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6`}
              style={{ background: '#FAE0EC', color: '#BB5E86' }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#BB5E86' }} />
              {t.home.heroBadge}
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
              {t.home.heroHeading1}
              <br />
              <em style={{ color: '#C4768A', fontStyle: 'italic' }}>{t.home.heroHeading2}</em>
            </h1>

            {/* Description */}
            <p className="text-lg mb-10 leading-relaxed max-w-md" style={{ color: '#7A6068' }}>
              {t.home.heroDesc}
            </p>

            {/* CTAs */}
            <div className={`flex gap-4 flex-wrap ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Link
                href={`/${locale}/book-appointment`}
                className="px-8 py-3.5 rounded-full font-semibold text-white transition-opacity hover:opacity-90 shadow-md text-base"
                style={{ background: '#BB5E86' }}
              >
                {t.home.heroBook}
              </Link>
              <Link
                href={`/${locale}/pregnancy-calculator`}
                className="px-8 py-3.5 rounded-full font-semibold border-2 transition-colors hover:bg-pink-50 text-base"
                style={{ borderColor: '#BB5E86', color: '#BB5E86', background: 'white' }}
              >
                {t.home.heroCalc}
              </Link>
            </div>
          </div>

          {/* Illustration side */}
          <div className={`relative flex justify-center items-end ${isRTL ? 'order-1 md:order-1' : 'order-1 md:order-2'}`}>
            {/* Due date badge — floats top-left of card */}
            <div className="absolute top-4 z-20"
              style={{ [isRTL ? 'right' : 'left']: '-10px' }}>
              <div className="bg-white rounded-2xl shadow-lg px-4 py-3 min-w-[140px]">
                <div className="uppercase tracking-widest text-[10px] font-semibold mb-0.5" style={{ color: '#A08090' }}>
                  {t.home.estimatedDue}
                </div>
                <div className="text-lg font-bold" style={{ color: '#BB5E86' }}>Jan 21, 2027</div>
              </div>
            </div>

            {/* Outer wrapper — allows illustration to overflow above card */}
            <div className="relative" style={{ paddingTop: '80px' }}>
              {/* Woman illustration — sits above and inside the card */}
              <div className="absolute top-0 left-0 right-0 flex justify-center z-10">
                <Image
                  src="/hero-2.png"
                  alt="MomOfMoms illustration"
                  width={280}
                  height={420}
                  className="object-contain object-top"
                  priority
                />
              </div>

              {/* White card — behind the overflowing illustration */}
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden"
                style={{ width: '300px', height: '400px' }}>
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, #FDF8F4 0%, #FAE0EC 100%)', opacity: 0.4 }} />
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
                className="inline-block px-8 py-3 rounded-full font-semibold border-2 transition-colors hover:bg-pink-600 hover:text-white hover:border-pink-600"
                style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
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
