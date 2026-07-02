'use client';
import { useState } from 'react';
import { Product } from '@/lib/supabase';
import { Locale } from '@/lib/i18n';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const name = locale === 'ar' ? product.name_ar : product.name_en;
  const description = locale === 'ar' ? product.description_ar : product.description_en;
  const soldOut = !product.in_stock || (product.quantity !== undefined && product.quantity <= 0);

  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <Link href={`/${locale}/shop/${product.id}`} className={`block bg-white rounded-2xl shadow-sm overflow-hidden transition-shadow ${soldOut ? 'opacity-60' : 'hover:shadow-md'}`}>
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        {allImages.length > 0 ? (
          <Image
            src={allImages[activeIdx]}
            alt={name}
            fill
            className={`object-cover transition-opacity duration-200 ${soldOut ? 'grayscale' : ''}`}
          />
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

        {/* Thumbnail dots for gallery */}
        {allImages.length > 1 && (
          <div
            className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 px-2"
            onClick={e => e.preventDefault()}
          >
            {allImages.map((src, i) => (
              <button
                key={i}
                onClick={e => { e.preventDefault(); setActiveIdx(i); }}
                className={`w-7 h-7 rounded-md overflow-hidden border-2 transition-all flex-shrink-0 ${
                  i === activeIdx ? 'border-white scale-110 shadow-md' : 'border-transparent opacity-70'
                }`}
              >
                <Image src={src} alt="" width={28} height={28} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3">
        <p className={`font-medium text-sm line-clamp-1 ${soldOut ? 'text-gray-400' : 'text-gray-800'}`}>{name}</p>
        {description && (
          <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${soldOut ? 'text-gray-300' : 'text-gray-500'}`}>
            {description}
          </p>
        )}
        <p className={`font-bold mt-2 text-sm ${soldOut ? 'text-gray-400' : 'text-pink-600'}`}>
          {product.price} {locale === 'ar' ? 'د.ك' : 'KWD'}
        </p>
      </div>
    </Link>
  );
}
