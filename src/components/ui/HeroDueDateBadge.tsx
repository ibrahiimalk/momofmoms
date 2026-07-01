'use client';
import { useEffect, useState } from 'react';

export default function HeroDueDateBadge({ label, placeholder, isRTL }: { label: string; placeholder: string; isRTL: boolean }) {
  const [dueDate, setDueDate] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const date = (e as CustomEvent<string>).detail;
      setDueDate(date);
    };
    window.addEventListener('momofmoms:duedate', handler);
    return () => window.removeEventListener('momofmoms:duedate', handler);
  }, []);

  return (
    <div className="absolute top-4 z-20" style={{ [isRTL ? 'right' : 'left']: '-10px' }}>
      <div className="bg-white rounded-2xl shadow-lg px-4 py-3 min-w-[140px] transition-all">
        <div className="uppercase tracking-widest text-[10px] font-semibold mb-0.5" style={{ color: '#A08090' }}>
          {label}
        </div>
        {dueDate ? (
          <div className="text-lg font-bold" style={{ color: '#BB5E86' }}>{dueDate}</div>
        ) : (
          <div className="text-sm italic" style={{ color: '#C0A0B0' }}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
