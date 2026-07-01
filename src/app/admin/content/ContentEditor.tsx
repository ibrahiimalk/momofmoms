'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Row = { key: string; ar: string; en: string; label: string };

const PAGES: { id: string; title: string; emoji: string; rows: { key: string; label: string }[] }[] = [
  {
    id: 'navbar', title: 'Navbar', emoji: '🧭',
    rows: [
      { key: 'nav.pregnancyCalc', label: 'Pregnancy Calculator link' },
      { key: 'nav.bookAppointment', label: 'Book Appointment link' },
      { key: 'nav.awakeWindows', label: 'Awake Windows link' },
      { key: 'nav.shop', label: 'Shop link' },
    ],
  },
  {
    id: 'home', title: 'Home Page', emoji: '🏠',
    rows: [
      { key: 'home.heroBadge', label: 'Badge pill text' },
      { key: 'home.heroHeading1', label: 'Heading line 1' },
      { key: 'home.heroHeading2', label: 'Heading line 2 (italic)' },
      { key: 'home.heroDesc', label: 'Description' },
      { key: 'home.heroBook', label: 'Primary button' },
      { key: 'home.heroCalc', label: 'Secondary button' },
      { key: 'home.estimatedDue', label: 'Due date badge label' },
      { key: 'home.duePlaceholder', label: 'Due date badge placeholder' },
      { key: 'home.card1Label', label: 'Card 1 — Title' },
      { key: 'home.card1Desc', label: 'Card 1 — Description' },
      { key: 'home.card1Link', label: 'Card 1 — Link text' },
      { key: 'home.card2Label', label: 'Card 2 — Title' },
      { key: 'home.card2Desc', label: 'Card 2 — Description' },
      { key: 'home.card2Link', label: 'Card 2 — Link text' },
      { key: 'home.card3Label', label: 'Card 3 — Title' },
      { key: 'home.card3Desc', label: 'Card 3 — Description' },
      { key: 'home.card3Link', label: 'Card 3 — Link text' },
      { key: 'home.babyClothes', label: 'Products section heading' },
    ],
  },
  {
    id: 'calc-widget', title: 'Calc Widget (Home)', emoji: '🗓️',
    rows: [
      { key: 'calc.sectionLabel', label: 'Section label (small caps)' },
      { key: 'calc.heading', label: 'Heading' },
      { key: 'calc.desc', label: 'Description' },
      { key: 'calc.inputLabel', label: 'Date input label' },
      { key: 'calc.youAre', label: 'Result: "You are"' },
      { key: 'calc.dueDate', label: 'Result: "Due Date"' },
      { key: 'calc.weeksLeft', label: 'Result: weeks left text' },
      { key: 'calc.bookBtn', label: 'Book button' },
      { key: 'calc.placeholder', label: 'Empty state text' },
    ],
  },
  {
    id: 'pregcalc', title: 'Pregnancy Calculator Page', emoji: '🧮',
    rows: [
      { key: 'pregcalc.title', label: 'Page title' },
      { key: 'pregcalc.subtitle', label: 'Subtitle' },
      { key: 'pregcalc.lastPeriod', label: 'Date input label' },
      { key: 'pregcalc.calculate', label: 'Calculate button' },
      { key: 'pregcalc.dueDate', label: 'Due date label' },
      { key: 'pregcalc.weeksPregnant', label: 'Weeks pregnant label' },
      { key: 'pregcalc.trimester', label: 'Trimester label' },
      { key: 'pregcalc.trimester1', label: 'First trimester' },
      { key: 'pregcalc.trimester2', label: 'Second trimester' },
      { key: 'pregcalc.trimester3', label: 'Third trimester' },
      { key: 'pregcalc.weeks', label: 'Word: "weeks"' },
      { key: 'pregcalc.days', label: 'Word: "days"' },
      { key: 'pregcalc.complete', label: 'Word: "complete"' },
    ],
  },
  {
    id: 'book', title: 'Book Appointment Page', emoji: '📅',
    rows: [
      { key: 'book.title', label: 'Page title' },
      { key: 'book.subtitle', label: 'Subtitle' },
      { key: 'book.name', label: 'Name field label' },
      { key: 'book.phone', label: 'Phone field label' },
      { key: 'book.email', label: 'Email field label' },
      { key: 'book.period', label: 'Period field label' },
      { key: 'book.morning', label: 'Morning Period option' },
      { key: 'book.evening', label: 'Evening Period option' },
      { key: 'book.notes', label: 'Notes field label' },
      { key: 'book.submit', label: 'Submit button' },
      { key: 'book.successTitle', label: 'Success screen title' },
      { key: 'book.successMsg', label: 'Success screen message' },
      { key: 'book.bookAnother', label: 'Book another button' },
      { key: 'book.error', label: 'Error message' },
    ],
  },
  {
    id: 'awake', title: 'Awake Windows Page', emoji: '🌅',
    rows: [
      { key: 'awake.title', label: 'Page title' },
      { key: 'awake.subtitle', label: 'Subtitle' },
      { key: 'awake.selectAge', label: 'Dropdown label' },
      { key: 'awake.empty', label: 'Empty state text' },
    ],
  },
  {
    id: 'shop', title: 'Shop Page', emoji: '🛍️',
    rows: [
      { key: 'home.babyClothes', label: 'Page heading' },
      { key: 'shop.empty', label: 'Empty state text' },
    ],
  },
  {
    id: 'footer', title: 'Footer', emoji: '🦶',
    rows: [
      { key: 'footer.rights', label: 'Copyright text' },
    ],
  },
];

export default function ContentEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [activePage, setActivePage] = useState('home');

  const getValue = (key: string, lang: 'ar' | 'en') =>
    rows.find(r => r.key === key)?.[lang] ?? '';

  const setValue = (key: string, lang: 'ar' | 'en', val: string) => {
    setRows(prev => prev.map(r => r.key === key ? { ...r, [lang]: val } : r));
    setSaved(s => { const n = new Set(s); n.delete(key); return n; });
  };

  const saveRow = async (key: string) => {
    const row = rows.find(r => r.key === key);
    if (!row) return;
    setSaving(key);
    await supabase.from('site_content').upsert({ key, ar: row.ar, en: row.en });
    setSaving(null);
    setSaved(s => new Set(s).add(key));
  };

  const activeSections = PAGES.find(p => p.id === activePage);

  return (
    <div className="flex gap-6 min-h-[600px]">
      {/* Sidebar nav */}
      <aside className="w-48 flex-shrink-0">
        <nav className="space-y-1 sticky top-4">
          {PAGES.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePage(page.id)}
              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activePage === page.id
                  ? 'text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={activePage === page.id ? { background: '#BB5E86' } : {}}
            >
              <span>{page.emoji}</span>
              <span>{page.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1">
        {activeSections && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {activeSections.emoji} {activeSections.title}
            </h2>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
              {activeSections.rows.map(({ key, label }) => (
                <div key={key} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{label}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{key}</p>
                    </div>
                    <button
                      onClick={() => saveRow(key)}
                      disabled={saving === key}
                      className="text-sm font-semibold px-4 py-1.5 rounded-full transition-colors"
                      style={{
                        background: saved.has(key) ? '#E8F5E9' : '#FAE0EC',
                        color: saved.has(key) ? '#2E7D32' : '#BB5E86',
                      }}
                    >
                      {saving === key ? 'Saving…' : saved.has(key) ? '✓ Saved' : 'Save'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-gray-400 mb-1 block">عربي (AR)</label>
                      <textarea dir="rtl" rows={2} value={getValue(key, 'ar')}
                        onChange={e => setValue(key, 'ar', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-400 mb-1 block">English (EN)</label>
                      <textarea rows={2} value={getValue(key, 'en')}
                        onChange={e => setValue(key, 'en', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
