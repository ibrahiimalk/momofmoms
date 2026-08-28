'use client';
import { useState } from 'react';
import { AwakeWindow } from '@/lib/db';
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
  const isRTL = locale === 'ar';
  const [selected, setSelected] = useState<AwakeWindow>(windows[0] ?? null);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dropdown */}
      <div className="w-full max-w-sm">
        <label className="block text-xs font-semibold mb-1.5 text-right" style={{ color: '#7A6068' }} dir={isRTL ? 'rtl' : 'ltr'}>
          {selectLabel}
        </label>
        <select
          className="w-full border-2 rounded-2xl px-4 py-3 text-base focus:outline-none bg-white"
          style={{ borderColor: '#E8C8D8', color: '#2D1B20' }}
          value={selected?.id ?? ''}
          onChange={(e) => {
            const win = windows.find((w) => w.id === e.target.value);
            if (win) setSelected(win);
          }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {windows.map((w) => (
            <option key={w.id} value={w.id}>
              {locale === 'ar' ? w.label_ar : w.label_en}
            </option>
          ))}
        </select>
      </div>

      {/* Card */}
      {selected && (
        <div
          className="w-full rounded-3xl overflow-hidden shadow-lg"
          style={{
            maxWidth: 480,
            background: '#fff',
            border: '1px solid #F0E8EC',
          }}
        >
          {selected.image_url ? (
            <div className="relative w-full" style={{ aspectRatio: '4/5' }}>
              <Image
                src={selected.image_url}
                alt={locale === 'ar' ? selected.label_ar : selected.label_en}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 480px"
                priority
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-16"
              style={{ background: 'linear-gradient(135deg,#FDF0EC,#FAE8EF)' }}>
              <div className="text-6xl">🌅</div>
              <p className="text-lg font-bold" style={{ color: '#2D1B20' }}>
                {locale === 'ar' ? selected.label_ar : selected.label_en}
              </p>
            </div>
          )}
          <div className="py-3 text-center" style={{ background: '#FDF8F4' }}>
            <p className="text-sm font-medium" style={{ color: '#BB5E86' }}>
              {locale === 'ar' ? selected.label_ar : selected.label_en}
            </p>
          </div>
        </div>
      )}

      {/* Age pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-2" dir={isRTL ? 'rtl' : 'ltr'}>
        {windows.map((w) => {
          const active = selected?.id === w.id;
          return (
            <button
              key={w.id}
              onClick={() => setSelected(w)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
              style={{
                background: active ? '#BB5E86' : '#F5E8EF',
                color: active ? '#fff' : '#BB5E86',
                border: `1px solid ${active ? '#BB5E86' : '#E8C8D8'}`,
              }}
            >
              {locale === 'ar' ? w.label_ar : w.label_en}
            </button>
          );
        })}
      </div>
    </div>
  );
}
