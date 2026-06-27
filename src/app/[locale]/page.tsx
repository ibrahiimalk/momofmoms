export const dynamic = 'force-dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Locale, translations } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import ProductCard from '@/components/ui/ProductCard';
import HomeCalcWidget from '@/components/ui/HomeCalcWidget';

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
  const c = await getContent(locale);
  const isRTL = locale === 'ar';
  const products = await getFeaturedProducts();

  const featureCards = [
    {
      href: `/${locale}/pregnancy-calculator`,
      label: c['home.card1Label'],
      iconBg: '#F5EDE0',
      iconColor: '#C8956A',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="7" cy="7" r="2.5" fill="currentColor"/>
          <circle cx="15" cy="7" r="2.5" fill="currentColor"/>
          <circle cx="7" cy="15" r="2.5" fill="currentColor"/>
          <circle cx="15" cy="15" r="2.5" fill="currentColor"/>
        </svg>
      ),
      desc: c['home.card1Desc'],
      link: c['home.card1Link'],
    },
    {
      href: `/${locale}/book-appointment`,
      label: c['home.card2Label'],
      iconBg: '#FAE0EC',
      iconColor: '#BB5E86',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2.5" fill="none"/>
          <circle cx="11" cy="11" r="3" fill="currentColor"/>
        </svg>
      ),
      desc: c['home.card2Desc'],
      link: c['home.card2Link'],
    },
    {
      href: `/${locale}/shop`,
      label: c['home.card3Label'],
      iconBg: '#F5EDD0',
      iconColor: '#B08A30',
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L20 11L11 20L2 11Z" fill="currentColor"/>
        </svg>
      ),
      desc: c['home.card3Desc'],
      link: c['home.card3Link'],
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
              {c['home.heroBadge']}
            </div>

            {/* Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
              {c['home.heroHeading1']}
              <br />
              <em style={{ color: '#C4768A', fontStyle: 'italic' }}>{c['home.heroHeading2']}</em>
            </h1>

            {/* Description */}
            <p className="text-lg mb-10 leading-relaxed max-w-md" style={{ color: '#7A6068' }}>
              {c['home.heroDesc']}
            </p>

            {/* CTAs */}
            <div className={`flex gap-4 flex-wrap ${isRTL ? 'justify-end' : 'justify-start'}`}>
              <Link
                href={`/${locale}/book-appointment`}
                className="px-8 py-3.5 rounded-full font-semibold text-white transition-opacity hover:opacity-90 shadow-md text-base"
                style={{ background: '#BB5E86' }}
              >
                {c['home.heroBook']}
              </Link>
              <Link
                href={`/${locale}/pregnancy-calculator`}
                className="px-8 py-3.5 rounded-full font-semibold border-2 transition-colors hover:bg-pink-50 text-base"
                style={{ borderColor: '#BB5E86', color: '#BB5E86', background: 'white' }}
              >
                {c['home.heroCalc']}
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
                  {c['home.estimatedDue']}
                </div>
                <div className="text-lg font-bold" style={{ color: '#BB5E86' }}>Jan 21, 2027</div>
              </div>
            </div>

            {/* White card with illustration inside */}
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden flex items-end justify-center"
              style={{ width: '320px', height: '420px', background: 'linear-gradient(180deg, #FEF3F8 0%, #FAE4EF 100%)' }}>

              <Image
                src="/portrait.png"
                alt="MomOfMoms illustration"
                width={300}
                height={380}
                className="object-contain"
                style={{ maxHeight: '100%', width: 'auto' }}
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featureCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-3xl p-7 flex flex-col gap-5 hover:shadow-lg transition-shadow group border"
              style={{ borderColor: '#F0E8EC' }}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: card.iconBg, color: card.iconColor }}>
                {card.icon}
              </div>
              {/* Text */}
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-lg font-bold" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
                  {card.label}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: '#7A6068' }}>{card.desc}</p>
              </div>
              {/* Link */}
              <span className="text-sm font-semibold" style={{ color: '#BB5E86' }}>{card.link}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Pregnancy Calculator Widget */}
      <HomeCalcWidget locale={locale} content={c} />

      {/* Featured Products */}
      <section className="px-6 py-16" style={{ background: '#FDF0F5' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
            {c['home.babyClothes']}
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
