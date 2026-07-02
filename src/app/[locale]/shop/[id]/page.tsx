export const dynamic = 'force-dynamic';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';
import ImageGallery from './ImageGallery';
import AddToCartButton from './AddToCartButton';

async function getProduct(id: string) {
  const { data } = await supabase
    .from('products')
    .select('*, categories(id, name_ar, name_en)')
    .eq('id', id)
    .single();
  return data;
}

export default async function ProductPage({ params }: { params: { locale: string; id: string } }) {
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';
  const product = await getProduct(params.id);

  if (!product) notFound();

  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const categoryName = product.categories
    ? (locale === 'ar' ? product.categories.name_ar : product.categories.name_en)
    : null;

  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
  const soldOut = !product.in_stock || product.quantity <= 0;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen" style={{ background: '#FDF8F4' }}>
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Back link */}
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-1 text-sm mb-6 transition-colors"
          style={{ color: '#BB5E86' }}
        >
          <ChevronLeft size={16} className={isRTL ? 'rotate-180' : ''} />
          {locale === 'ar' ? 'العودة للمتجر' : 'Back to Shop'}
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image gallery */}
          <ImageGallery images={allImages} name={name} />

          {/* Product info */}
          <div className="flex flex-col gap-5">
            {categoryName && (
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#BB5E86' }}>
                {categoryName}
              </span>
            )}

            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
              {name}
            </h1>

            <p className="text-2xl font-bold" style={{ color: '#BB5E86' }}>
              {product.price} {locale === 'ar' ? 'د.ك' : 'KWD'}
            </p>

            {description && (
              <p className="text-base leading-relaxed" style={{ color: '#5C4048' }}>
                {description}
              </p>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${soldOut ? 'bg-red-400' : 'bg-green-400'}`} />
              <span className="text-sm" style={{ color: '#7A6068' }}>
                {soldOut
                  ? (locale === 'ar' ? 'نفذ المخزون' : 'Out of Stock')
                  : (locale === 'ar' ? `${product.quantity} قطعة متاحة` : `${product.quantity} in stock`)}
              </span>
            </div>

            <AddToCartButton
              product={product}
              cartLabel={locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
              addedLabel={locale === 'ar' ? 'تمت الإضافة ✓' : 'Added to Cart ✓'}
              soldOutLabel={locale === 'ar' ? 'نفذ المخزون' : 'Sold Out'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
