'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Locale } from '@/lib/i18n';

function calculatePregnancy(lmpDate: Date) {
  const today = new Date();
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);
  const diffDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  const weeksLeft = Math.max(0, 40 - weeks);
  let trimester = 1;
  if (weeks >= 13 && weeks < 27) trimester = 2;
  else if (weeks >= 27) trimester = 3;
  return { dueDate, weeks, days, trimester, weeksLeft, progress: Math.min((weeks / 40) * 100, 100) };
}

export default function HomeCalcWidget({ locale, content }: { locale: Locale; content: Record<string, string> }) {
  const isRTL = locale === 'ar';
  const c = content;
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculatePregnancy> | null>(null);

  const handleChange = (val: string) => {
    setLmp(val);
    if (val) setResult(calculatePregnancy(new Date(val)));
    else setResult(null);
  };

  const trimesterLabel = result
    ? result.trimester === 1
      ? (isRTL ? 'الثلث الأول' : 'First trimester')
      : result.trimester === 2
      ? (isRTL ? 'الثلث الثاني' : 'Second trimester')
      : (isRTL ? 'الثلث الثالث' : 'Third trimester')
    : '';

  return (
    <section className="px-6 py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto rounded-3xl p-10 md:p-14"
        style={{ background: 'linear-gradient(135deg, #FDF0EC 0%, #FAE8EF 100%)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left: text + input */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#BB5E86' }}>
              {c['calc.sectionLabel']}
            </p>
            <h2 className="text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
              {c['calc.heading']}
            </h2>
            <p className="mb-8" style={{ color: '#7A6068' }}>
              {c['calc.desc']}
            </p>
            <label className="block text-sm font-medium mb-2" style={{ color: '#5C4048' }}>
              {c['calc.inputLabel']}
            </label>
            <input
              type="date"
              value={lmp}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full rounded-2xl px-5 py-4 text-base border-0 outline-none shadow-sm"
              style={{ background: 'white', color: '#2D1B20' }}
            />
          </div>

          {/* Right: result card */}
          <div className="bg-white rounded-3xl shadow-md p-6 min-h-[280px] flex flex-col justify-between">
            {result ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl p-4" style={{ background: '#FAF5FF' }}>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A08090' }}>
                      {c['calc.youAre']}
                    </p>
                    <p className="text-3xl font-bold" style={{ color: '#BB5E86' }}>
                      {result.weeks}w {result.days}d
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#7A6068' }}>{trimesterLabel}</p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: '#FAF5FF' }}>
                    <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#A08090' }}>
                      {c['calc.dueDate']}
                    </p>
                    <p className="text-xl font-bold" style={{ color: '#2D1B20' }}>
                      {result.dueDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between text-xs mb-2" style={{ color: '#A08090' }}>
                    <span>{isRTL ? 'الأسبوع 0' : 'Week 0'}</span>
                    <span>{isRTL ? '٤٠ أسبوع' : '40 weeks'}</span>
                  </div>
                  <div className="w-full rounded-full h-2.5" style={{ background: '#F0E0E8' }}>
                    <div className="h-2.5 rounded-full transition-all" style={{ width: `${result.progress}%`, background: '#BB5E86' }} />
                  </div>
                  <p className="text-sm mt-3" style={{ color: '#7A6068' }}>
                    <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: '#BB5E86' }} />
                    {isRTL
                      `${isRTL ? 'حوالي' : 'About'} ${result.weeksLeft} ${c['calc.weeksLeft']}`
                  </p>
                </div>
                <Link
                  href={`/${locale}/book-appointment`}
                  className="block w-full text-center py-4 rounded-2xl font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: '#2D1B20' }}
                >
                  {c['calc.bookBtn']}
                </Link>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 gap-3" style={{ color: '#C0A0B0' }}>
                <span className="text-5xl">🗓️</span>
                <p className="text-sm">{c['calc.placeholder']}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
