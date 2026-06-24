'use client';
import { useState } from 'react';
import { AwakeWindow } from '@/lib/supabase';
import { Locale } from '@/lib/i18n';
import Image from 'next/image';

export default function AwakeWindowsClient({
  windows,
  locale,
  selectLabel,
}: {
  windows: AwakeWindow[];
  locale: Locale;
  selectLabel: string;
}) {
  const [selected, setSelected] = useState<AwakeWindow | null>(null);
  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">{selectLabel}</label>
        <select
          className="w-full border-2 border-pink-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-pink-400 bg-white text-lg"
          onChange={(e) => {
            const win = windows.find((w) => w.id === e.target.value);
            setSelected(win || null);
          }}
          defaultValue=""
        >
          <option value="" disabled>
            {selectLabel}...
          </option>
          {windows.map((w) => (
            <option key={w.id} value={w.id}>
              {locale === 'ar' ? w.label_ar : w.label_en}
            </option>
          ))}
        </select>
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl overflow-hidden shadow-lg bg-white">
          <div className="relative w-full aspect-video">
            {selected.image_url ? (
              <Image
                src={selected.image_url}
                alt={locale === 'ar' ? selected.label_ar : selected.label_en}
                fill
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-amber-50 flex items-center justify-center text-5xl">🌅</div>
            )}
          </div>
          <div className="p-4 text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {locale === 'ar' ? selected.label_ar : selected.label_en}
            </h3>
          </div>
        </div>
      )}
    </div>
  );
}
