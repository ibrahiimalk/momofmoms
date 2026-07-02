'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ChevronRight } from 'lucide-react';

const EMPTY_FORM = { name: '', email: '', phone: '', area: '', block: '', street: '', avenue: '', house: '' };

export default function CartPage({ locale }: { locale: string }) {
  const { items, removeItem, updateQty, totalPrice, clearCart } = useCart();
  const isRTL = locale === 'ar';
  const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const t = (ar: string, en: string) => isRTL ? ar : en;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || t('حدث خطأ، يرجى المحاولة مرة أخرى', 'Something went wrong, please try again'));
        return;
      }
      clearCart();
      setStep('success');
    } catch {
      setError(t('حدث خطأ، يرجى المحاولة مرة أخرى', 'Something went wrong, please try again'));
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-6 rounded-3xl" style={{ background: 'linear-gradient(135deg,#FDF0EC,#FAE8EF)' }}>
        <div className="text-5xl mb-4">💌</div>
        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
          {t('تم استلام طلبك!', 'Order Received!')}
        </h2>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#7A6068' }}>
          {t('سنتواصل معك قريباً لتأكيد موعد التوصيل. تفقد بريدك الإلكتروني للتفاصيل.', 'We\'ll contact you soon to confirm delivery. Check your email for details.')}
        </p>
        <Link href={`/${locale}/shop`} className="inline-block px-6 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: '#BB5E86' }}>
          {t('تصفح المزيد', 'Continue Shopping')}
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#2D1B20' }}>{t('سلتك فارغة', 'Your cart is empty')}</h2>
        <p className="text-sm mb-6" style={{ color: '#A08090' }}>{t('تصفحي المنتجات وأضيفي ما يعجبك', 'Browse the shop and add something you love')}</p>
        <Link href={`/${locale}/shop`} className="inline-block px-6 py-3 rounded-2xl text-white font-semibold text-sm" style={{ background: '#BB5E86' }}>
          {t('تصفح المتجر', 'Browse Shop')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Cart items */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#F0E8EC' }}>
        {items.map((item, idx) => {
          const name = locale === 'ar' ? item.name_ar : item.name_en;
          const atMax = item.quantity >= item.stock_quantity;
          return (
            <div key={item.id} className={`flex items-center gap-4 p-4 ${idx !== 0 ? 'border-t' : ''}`} style={{ borderColor: '#F0E8EC' }}>
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image_url
                  ? <Image src={item.image_url} alt={name} width={64} height={64} className="object-cover w-full h-full" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">👶</div>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" style={{ color: '#2D1B20' }}>{name}</p>
                <p className="text-sm font-bold mt-0.5" style={{ color: '#BB5E86' }}>{item.price} {t('د.ك', 'KWD')}</p>
                {atMax && <p className="text-xs mt-0.5" style={{ color: '#BB5E86' }}>{t('الحد الأقصى المتاح', 'Max stock reached')}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-pink-50"
                  style={{ borderColor: '#E8C8D8' }}>
                  <Minus size={12} style={{ color: '#BB5E86' }} />
                </button>
                <span className="w-6 text-center text-sm font-medium" style={{ color: '#2D1B20' }}>{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)}
                  disabled={atMax}
                  className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-pink-50 disabled:opacity-40"
                  style={{ borderColor: '#E8C8D8' }}>
                  <Plus size={12} style={{ color: '#BB5E86' }} />
                </button>
              </div>
              <button onClick={() => removeItem(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Total + proceed */}
      {step === 'cart' && (
        <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: '#F0E8EC' }}>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium" style={{ color: '#7A6068' }}>{t('المجموع', 'Total')}</span>
            <span className="text-xl font-bold" style={{ color: '#BB5E86' }}>{totalPrice.toFixed(3)} {t('د.ك', 'KWD')}</span>
          </div>
          <button onClick={() => setStep('form')}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ background: '#BB5E86' }}>
            {t('إتمام الطلب', 'Place Order')}
            <ChevronRight size={16} className={isRTL ? 'rotate-180' : ''} />
          </button>
          <button onClick={clearCart} className="w-full py-2 text-sm" style={{ color: '#A08090' }}>
            {t('إفراغ السلة', 'Clear Cart')}
          </button>
        </div>
      )}

      {/* Order form */}
      {step === 'form' && (
        <form onSubmit={handleOrder} className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#F0E8EC' }}>
          <h2 className="text-lg font-bold" style={{ color: '#2D1B20' }}>{t('بيانات التوصيل', 'Delivery Details')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('الاسم', 'Full Name')} *</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('البريد الإلكتروني', 'Email')} *</label>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('رقم الهاتف', 'Phone')} *</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>

          <div style={{ height: 1, background: '#F0E8EC' }} />
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#BB5E86' }}>{t('العنوان', 'Address')}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('المنطقة', 'Area')} *</label>
              <input required value={form.area} onChange={e => setForm({ ...form, area: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('القطعة', 'Block')} *</label>
              <input required value={form.block} onChange={e => setForm({ ...form, block: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('الشارع', 'Street')} *</label>
              <input required value={form.street} onChange={e => setForm({ ...form, street: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('الجادة', 'Avenue')} <span style={{ color: '#A08090' }}>({t('اختياري', 'optional')})</span></label>
              <input value={form.avenue} onChange={e => setForm({ ...form, avenue: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium mb-1" style={{ color: '#5C4048' }}>{t('رقم المنزل', 'House / Building')} *</label>
              <input required value={form.house} onChange={e => setForm({ ...form, house: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-pink-400" />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-between items-center pt-1">
            <span className="text-base font-bold" style={{ color: '#BB5E86' }}>{totalPrice.toFixed(3)} {t('د.ك', 'KWD')}</span>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: '#BB5E86' }}>
              {submitting ? '...' : t('تأكيد الطلب', 'Confirm Order')}
            </button>
          </div>

          <button type="button" onClick={() => setStep('cart')} className="text-xs w-full text-center pt-1" style={{ color: '#A08090' }}>
            {t('← العودة للسلة', '← Back to Cart')}
          </button>
        </form>
      )}
    </div>
  );
}
