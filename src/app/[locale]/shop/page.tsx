export const dynamic = 'force-dynamic';
import { Locale } from '@/lib/i18n';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';
import { getContent } from '@/lib/content';

async function getProducts() {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('category')
      .order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function ShopPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';
  const [products, c] = await Promise.all([getProducts(), getContent(locale)]);

  // Group by category
  const grouped = products.reduce<Record<string, Product[]>>((acc, p) => {
    const cat = p.category || (locale === 'ar' ? 'أخرى' : 'Other');
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen max-w-7xl mx-auto px-4 py-10" style={{ background: '#FDF8F4' }}>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
          {c['home.babyClothes'] || (locale === 'ar' ? 'المتجر' : 'Shop')}
        </h1>
        <p className="text-sm" style={{ color: '#A08090' }}>
          {locale === 'ar' ? `${products.length} منتج في ${categories.length} تصنيف` : `${products.length} products across ${categories.length} categories`}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-lg" style={{ color: '#A08090' }}>
            {locale === 'ar' ? 'لا توجد منتجات بعد.' : 'No products yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-14">
          {categories.map((category) => (
            <section key={category}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
                  {category}
                </h2>
                <div className="flex-1 h-px" style={{ background: '#F0E0E8' }} />
                <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ background: '#FAE0EC', color: '#BB5E86' }}>
                  {grouped[category].length} {locale === 'ar' ? 'منتج' : 'items'}
                </span>
              </div>

              {/* Products grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {grouped[category].map((p: Product) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
