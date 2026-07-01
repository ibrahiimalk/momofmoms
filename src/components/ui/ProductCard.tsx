import { Product } from '@/lib/supabase';
import { Locale } from '@/lib/i18n';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
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
            {locale === 'ar' ? 'إنتهى من المخزن' : 'Out of Stock'}
          </span>
        )}
        <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform">
          <Heart size={16} className="text-gray-400 hover:text-pink-500" />
        </button>
      </div>
      <div className="p-3">
        <p className="font-medium text-gray-800 text-sm line-clamp-2">{name}</p>
        <p className="text-pink-600 font-bold mt-1">{product.price} {locale === 'ar' ? 'د.ك' : 'KWD'}</p>
      </div>
    </div>
  );
}
