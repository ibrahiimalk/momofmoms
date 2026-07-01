import { Product } from '@/lib/supabase';
import { Locale } from '@/lib/i18n';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const qty = product.quantity ?? 0;
  const lowStock = qty > 0 && qty <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative aspect-square bg-gray-100">
        {product.image_url ? (
          <Image src={product.image_url} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">👶</div>
        )}
        {!product.in_stock && (
          <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
            {locale === 'ar' ? 'نفذ المخزون' : 'Out of Stock'}
          </span>
        )}
        {lowStock && product.in_stock && (
          <span className="absolute top-2 left-2 bg-amber-400 text-white text-xs px-2 py-1 rounded-full">
            {locale === 'ar' ? `${qty} فقط` : `Only ${qty} left`}
          </span>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform">
          <Heart size={16} className="text-gray-400 hover:text-pink-500" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-medium text-gray-800 text-sm line-clamp-2">{name}</p>
        <div className="flex items-center justify-between mt-1">
          <p className="text-pink-600 font-bold">{product.price} {locale === 'ar' ? 'د.ك' : 'KWD'}</p>
          {qty > 5 && (
            <p className="text-xs" style={{ color: '#A08090' }}>
              {locale === 'ar' ? `${qty} متوفر` : `${qty} in stock`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
