'use client';
import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';

export default function CartPage({ locale }: { locale: string }) {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const isRTL = locale === 'ar';

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#2D1B20' }}>
          {isRTL ? 'سلتك فارغة' : 'Your cart is empty'}
        </h2>
        <p className="text-sm mb-6" style={{ color: '#A08090' }}>
          {isRTL ? 'تصفحي المنتجات وأضيفي ما يعجبك' : 'Browse the shop and add something you love'}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-block px-6 py-3 rounded-2xl text-white font-semibold text-sm"
          style={{ background: '#BB5E86' }}
        >
          {isRTL ? 'تصفح المتجر' : 'Browse Shop'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl border overflow-hidden mb-4" style={{ borderColor: '#F0E8EC' }}>
        {items.map((item, idx) => {
          const name = locale === 'ar' ? item.name_ar : item.name_en;
          return (
            <div key={item.id} className={`flex items-center gap-4 p-4 ${idx !== 0 ? 'border-t' : ''}`} style={{ borderColor: '#F0E8EC' }}>
              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image_url
                  ? <Image src={item.image_url} alt={name} width={64} height={64} className="object-cover w-full h-full" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">👶</div>}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: '#2D1B20' }}>{name}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: '#BB5E86' }}>
                  {item.price} {locale === 'ar' ? 'د.ك' : 'KWD'}
                </p>
              </div>

              {/* Quantity controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center transition-colors hover:bg-pink-50"
                  style={{ borderColor: '#E8C8D8' }}
                >
                  <Minus size={12} style={{ color: '#BB5E86' }} />
                </button>
                <span className="w-6 text-center text-sm font-medium" style={{ color: '#2D1B20' }}>{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center transition-colors hover:bg-pink-50"
                  style={{ borderColor: '#E8C8D8' }}
                >
                  <Plus size={12} style={{ color: '#BB5E86' }} />
                </button>
              </div>

              {/* Remove */}
              <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#F0E8EC' }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium" style={{ color: '#7A6068' }}>
            {isRTL ? 'المجموع' : 'Total'}
          </span>
          <span className="text-xl font-bold" style={{ color: '#BB5E86' }}>
            {totalPrice.toFixed(3)} {isRTL ? 'د.ك' : 'KWD'}
          </span>
        </div>

        <Link
          href={`/${locale}/book-appointment`}
          className="w-full flex items-center justify-center py-3.5 rounded-2xl text-white font-semibold text-sm transition-opacity hover:opacity-90"
          style={{ background: '#BB5E86' }}
        >
          {isRTL ? 'احجزي موعداً للاستلام' : 'Book Appointment to Collect'}
        </Link>

        <button
          onClick={clearCart}
          className="w-full mt-2 py-2.5 text-sm font-medium transition-colors"
          style={{ color: '#A08090' }}
        >
          {isRTL ? 'إفراغ السلة' : 'Clear Cart'}
        </button>
      </div>
    </div>
  );
}
