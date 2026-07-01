import { Product } from '@/lib/supabase';
import { Locale } from '@/lib/i18n';
import { Heart } from 'lucide-react';
import Image from 'next/image';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const soldOut = !product.in_stock || (product.quantity !== undefined && product.quantity <= 0);

  return (
    <div className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow ${soldOut ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:shadow-md group'}`}>
      <div className="relative aspect-square bg-gray-100">
        {product.image_url ? (
          <Image src={product.image_url} alt={name} fill className={`object-cover ${soldOut ? 'grayscale' : ''}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">👶</div>
        )}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {locale === 'ar' ? 'نفذ المخزون' : 'Sold Out'}
            </span>
          </div>
        )}
        {!soldOut && (
          <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform">
            <Heart size={16} className="text-gray-400 hover:text-pink-500" />
          </button>
        )}
      </div>
      <div className="p-3">
        <p className={`font-medium text-sm line-clamp-2 ${soldOut ? 'text-gray-400' : 'text-gray-800'}`}>{name}</p>
        <p className={`font-bold mt-1 ${soldOut ? 'text-gray-400' : 'text-pink-600'}`}>
          {product.price} {locale === 'ar' ? 'د.ك' : 'KWD'}
        </p>
      </div>
    </div>
  );
}
