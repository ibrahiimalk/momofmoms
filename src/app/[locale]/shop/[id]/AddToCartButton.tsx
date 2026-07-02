'use client';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { ShoppingBag, Check } from 'lucide-react';

type Props = {
  product: {
    id: string;
    name_ar: string;
    name_en: string;
    price: number;
    image_url: string;
    in_stock: boolean;
    quantity: number;
  };
  locale: string;
  cartLabel: string;
  addedLabel: string;
  soldOutLabel: string;
};

export default function AddToCartButton({ product, locale, cartLabel, addedLabel, soldOutLabel }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = !product.in_stock || product.quantity <= 0;

  const handleAdd = () => {
    addItem({
      id: product.id,
      name_ar: product.name_ar,
      name_en: product.name_en,
      price: product.price,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={soldOut || added}
      className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-base transition-all disabled:opacity-60"
      style={{
        background: added ? '#4CAF50' : soldOut ? '#E0D0D8' : '#BB5E86',
        color: 'white',
      }}
    >
      {added ? <Check size={20} /> : <ShoppingBag size={20} />}
      {soldOut ? soldOutLabel : added ? addedLabel : cartLabel}
    </button>
  );
}
