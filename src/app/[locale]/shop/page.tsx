export const dynamic = 'force-dynamic';
import { Locale, translations } from '@/lib/i18n';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ui/ProductCard';

async function getProducts() {
  try {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    return data || [];
  } catch {
    return [];
  }
}

export default async function ShopPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = translations[locale];
  const isRTL = locale === 'ar';
  const products = await getProducts();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-white max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.shop.title}</h1>
      <p className="text-gray-500 mb-8">
        {locale === 'ar' ? `${products.length} منتج` : `${products.length} products`}
      </p>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🛍️</div>
          <p className="text-gray-500 text-lg">
            {locale === 'ar' ? 'لا توجد منتجات بعد.' : 'No products yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p: Product) => (
            <ProductCard key={p.id} product={p} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
