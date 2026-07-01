'use client';
import { useState } from 'react';
import { Locale } from '@/lib/i18n';

function calculatePregnancy(lmpDate: Date) {
  const today = new Date();
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280);
  const diffDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;
  let trimester = 1;
  if (weeks >= 13 && weeks < 27) trimester = 2;
  else if (weeks >= 27) trimester = 3;
  return { dueDate, weeks, days, trimester };
}

export default function PregnancyCalcClient({ locale, content }: { locale: Locale; content: Record<string, string> }) {
  const c = content;
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculatePregnancy> | null>(null);

  const handleCalc = () => {
    if (!lmp) return;
    setResult(calculatePregnancy(new Date(lmp)));
  };

  const trimesterLabel = result
    ? result.trimester === 1 ? c['pregcalc.trimester1']
    : result.trimester === 2 ? c['pregcalc.trimester2']
    : c['pregcalc.trimester3']
    : '';

  const trimesterColor = result
    ? result.trimester === 1 ? 'bg-blue-50 border-blue-200 text-blue-700'
    : result.trimester === 2 ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-orange-50 border-orange-200 text-orange-700'
    : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6" style={{ borderColor: '#F0E8EC' }}>
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2" style={{ color: '#5C4048' }}>{c['pregcalc.lastPeriod']}</label>
        <input
          type="date" value={lmp} max={new Date().toISOString().split('T')[0]}
          onChange={e => { setLmp(e.target.value); setResult(null); }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 text-lg"
        />
      </div>
      <button onClick={handleCalc} disabled={!lmp}
        className="w-full text-white py-3 rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
        style={{ background: '#BB5E86' }}>
        {c['pregcalc.calculate']}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          <div className="rounded-2xl p-5 text-center" style={{ background: '#FAE0EC', border: '2px solid #F0C0D8' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#BB5E86' }}>{c['pregcalc.dueDate']}</p>
            <p className="text-3xl font-bold" style={{ color: '#2D1B20' }}>
              {result.dueDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>
          <div className="rounded-2xl p-5 text-center" style={{ background: '#F5F0FF', border: '2px solid #DDD0F0' }}>
            <p className="text-sm font-medium mb-1" style={{ color: '#7C3AED' }}>{c['pregcalc.weeksPregnant']}</p>
            <p className="text-3xl font-bold" style={{ color: '#5B21B6' }}>
              {result.weeks} {c['pregcalc.weeks']}
              {result.days > 0 && <span className="text-lg font-medium"> + {result.days} {c['pregcalc.days']}</span>}
            </p>
          </div>
          <div className={`border-2 rounded-2xl p-5 text-center ${trimesterColor}`}>
            <p className="text-sm font-medium mb-1">{c['pregcalc.trimester']}</p>
            <p className="text-2xl font-bold">{trimesterLabel}</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1" style={{ color: '#A08090' }}>
              <span>{locale === 'ar' ? 'الأسبوع 0' : 'Week 0'}</span>
              <span>{locale === 'ar' ? 'الأسبوع 40' : 'Week 40'}</span>
            </div>
            <div className="w-full rounded-full h-4 overflow-hidden" style={{ background: '#F0E0E8' }}>
              <div className="h-4 rounded-full transition-all" style={{ width: `${Math.min((result.weeks / 40) * 100, 100)}%`, background: 'linear-gradient(90deg, #BB5E86, #9B6BC4)' }} />
            </div>
            <p className="text-center text-sm mt-1" style={{ color: '#7A6068' }}>
              {Math.round((result.weeks / 40) * 100)}% {c['pregcalc.complete']}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
