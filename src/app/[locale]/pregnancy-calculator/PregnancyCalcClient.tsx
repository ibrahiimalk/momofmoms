'use client';
import { useState } from 'react';
import { Locale } from '@/lib/i18n';

type CalcT = {
  lastPeriod: string; calculate: string; dueDate: string;
  weeksPregnant: string; trimester: string;
  trimester1: string; trimester2: string; trimester3: string;
};

function calculatePregnancy(lmpDate: Date) {
  const today = new Date();
  const dueDate = new Date(lmpDate);
  dueDate.setDate(dueDate.getDate() + 280); // Naegele's rule: LMP + 280 days

  const diffMs = today.getTime() - lmpDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  let trimester = 1;
  if (weeks >= 13 && weeks < 27) trimester = 2;
  else if (weeks >= 27) trimester = 3;

  return { dueDate, weeks, days, trimester };
}

export default function PregnancyCalcClient({ locale, t }: { locale: Locale; t: CalcT }) {
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculatePregnancy> | null>(null);
  const handleCalc = () => {
    if (!lmp) return;
    const date = new Date(lmp);
    setResult(calculatePregnancy(date));
  };

  const trimesterLabel = result
    ? result.trimester === 1 ? t.trimester1 : result.trimester === 2 ? t.trimester2 : t.trimester3
    : '';

  const trimesterColor = result
    ? result.trimester === 1 ? 'bg-blue-50 border-blue-200 text-blue-700'
    : result.trimester === 2 ? 'bg-green-50 border-green-200 text-green-700'
    : 'bg-orange-50 border-orange-200 text-orange-700'
    : '';

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">{t.lastPeriod}</label>
        <input
          type="date"
          value={lmp}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => { setLmp(e.target.value); setResult(null); }}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-pink-400 text-lg"
        />
      </div>

      <button
        onClick={handleCalc}
        disabled={!lmp}
        className="w-full bg-pink-500 text-white py-3 rounded-xl font-semibold hover:bg-pink-600 transition-colors disabled:opacity-40"
      >
        {t.calculate}
      </button>

      {result && (
        <div className="mt-8 space-y-4">
          {/* Due Date */}
          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-5 text-center">
            <p className="text-sm text-pink-500 font-medium mb-1">{t.dueDate}</p>
            <p className="text-3xl font-bold text-pink-700">
              {result.dueDate.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
          </div>

          {/* Weeks pregnant */}
          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5 text-center">
            <p className="text-sm text-purple-500 font-medium mb-1">{t.weeksPregnant}</p>
            <p className="text-3xl font-bold text-purple-700">
              {result.weeks} {locale === 'ar' ? 'أسبوع' : 'weeks'}
              {result.days > 0 && <span className="text-lg font-medium"> + {result.days} {locale === 'ar' ? 'أيام' : 'days'}</span>}
            </p>
          </div>

          {/* Trimester */}
          <div className={`border-2 rounded-2xl p-5 text-center ${trimesterColor}`}>
            <p className="text-sm font-medium mb-1">{t.trimester}</p>
            <p className="text-2xl font-bold">{trimesterLabel}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>{locale === 'ar' ? 'الأسبوع 0' : 'Week 0'}</span>
              <span>{locale === 'ar' ? 'الأسبوع 40' : 'Week 40'}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all"
                style={{ width: `${Math.min((result.weeks / 40) * 100, 100)}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-1">
              {Math.round((result.weeks / 40) * 100)}% {locale === 'ar' ? 'مكتمل' : 'complete'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
