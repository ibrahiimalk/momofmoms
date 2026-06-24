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
      href: `/${locale}/awake-windows`,
      label: t.home.awakeWindows,
      emoji: '🌅',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      desc: locale === 'ar' ? 'نوافذ اليقظة حسب عمر طفلك' : "Baby awake windows by age",
    },
    {
      href: `/${locale}/pregnancy-calculator`,
      label: t.home.pregnancyCalc,
      emoji: '🗓️',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      desc: locale === 'ar' ? 'احسبي موعد الولادة المتوقع' : 'Calculate your due date',
    },
    {
      href: `/${locale}/book-appointment`,
      label: t.home.bookAppointment,
      emoji: '📅',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      desc: locale === 'ar' ? 'احجزي موعدك الآن' : 'Book your session now',
    },
    {
      href: `/${locale}/shop`,
      label: t.home.shopDiapers,
      emoji: '🛍️',
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      desc: locale === 'ar' ? 'تسوقي قماط وملابس الأطفال' : 'Shop diapers & baby clothes',
    },
  ];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">👶</div>
          <h1 className="text-4xl md:text-5xl font-bold text-pink-700 mb-4">{t.home.hero}</h1>
          <p className="text-lg text-gray-600 mb-8">{t.home.heroSub}</p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block bg-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-600 transition-colors shadow-md"
          >
            {t.home.shopDiapers}
          </Link>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top row: 2 cards side by side */}
          <Link
            href={featureCards[0].href}
            className={`${featureCards[0].bg} ${featureCards[0].border} border-2 rounded-2xl p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group`}
          >
            <div className="text-6xl">{featureCards[0].emoji}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{featureCards[0].label}</h2>
              <p className="text-gray-500 text-sm mt-1">{featureCards[0].desc}</p>
            </div>
          </Link>

          <Link
            href={featureCards[1].href}
            className={`${featureCards[1].bg} ${featureCards[1].border} border-2 rounded-2xl p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group`}
          >
            <div className="text-6xl">{featureCards[1].emoji}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{featureCards[1].label}</h2>
              <p className="text-gray-500 text-sm mt-1">{featureCards[1].desc}</p>
            </div>
          </Link>

          {/* Bottom row: wide card + tall card */}
          <Link
            href={featureCards[2].href}
            className={`${featureCards[2].bg} ${featureCards[2].border} border-2 rounded-2xl p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group`}
          >
            <div className="text-6xl">{featureCards[2].emoji}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{featureCards[2].label}</h2>
              <p className="text-gray-500 text-sm mt-1">{featureCards[2].desc}</p>
            </div>
          </Link>

          <Link
            href={featureCards[3].href}
            className={`${featureCards[3].bg} ${featureCards[3].border} border-2 rounded-2xl p-8 flex items-center gap-6 hover:shadow-lg transition-shadow group`}
          >
            <div className="text-6xl">{featureCards[3].emoji}</div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 group-hover:text-pink-600 transition-colors">{featureCards[3].label}</h2>
              <p className="text-gray-500 text-sm mt-1">{featureCards[3].desc}</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
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
              <Link href="/admin/products" className="mt-4 inline-block text-pink-500 underline text-sm">
                {locale === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}
              </Link>
            </div>
          )}
          {products.length > 0 && (
            <div className="text-center mt-8">
              <Link
                href={`/${locale}/shop`}
                className="inline-block border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-pink-500 hover:text-white transition-colors"
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
