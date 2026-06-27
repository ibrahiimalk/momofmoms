'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Row = { key: string; ar: string; en: string; label: string };

const SECTIONS: { title: string; rows: Omit<Row, 'ar' | 'en'>[] }[] = [
  {
    title: '🧭 Navbar',
    rows: [
      { key: 'nav.home', label: 'Home link' },
      { key: 'nav.shop', label: 'Shop link' },
      { key: 'nav.awakeWindows', label: 'Awake Windows link' },
      { key: 'nav.bookAppointment', label: 'Book Appointment link' },
      { key: 'nav.pregnancyCalc', label: 'Pregnancy Calculator link' },
    ],
  },
  {
    title: '🏠 Hero Section',
    rows: [
      { key: 'home.heroBadge', label: 'Badge pill text' },
      { key: 'home.heroHeading1', label: 'Heading line 1' },
      { key: 'home.heroHeading2', label: 'Heading line 2 (italic/pink)' },
      { key: 'home.heroDesc', label: 'Description paragraph' },
      { key: 'home.heroBook', label: 'Primary button' },
      { key: 'home.heroCalc', label: 'Secondary button' },
      { key: 'home.estimatedDue', label: 'Due date card label' },
    ],
  },
  {
    title: '📋 Feature Cards',
    rows: [
      { key: 'home.card1Label', label: 'Card 1 — Title' },
      { key: 'home.card1Desc', label: 'Card 1 — Description' },
      { key: 'home.card1Link', label: 'Card 1 — Link text' },
      { key: 'home.card2Label', label: 'Card 2 — Title' },
      { key: 'home.card2Desc', label: 'Card 2 — Description' },
      { key: 'home.card2Link', label: 'Card 2 — Link text' },
      { key: 'home.card3Label', label: 'Card 3 — Title' },
      { key: 'home.card3Desc', label: 'Card 3 — Description' },
      { key: 'home.card3Link', label: 'Card 3 — Link text' },
    ],
  },
  {
    title: '🗓️ Pregnancy Calculator Section',
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
    title: '🛍️ Products Section',
    rows: [
      { key: 'home.babyClothes', label: 'Section heading' },
    ],
  },
  {
    title: '🦶 Footer',
    rows: [
      { key: 'footer.rights', label: 'Copyright text' },
    ],
  },
];

export default function ContentEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const getValue = (key: string, lang: 'ar' | 'en') =>
    rows.find((r) => r.key === key)?.[lang] ?? '';

  const setValue = (key: string, lang: 'ar' | 'en', val: string) => {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [lang]: val } : r))
    );
    setSaved((s) => { const n = new Set(s); n.delete(key); return n; });
  };

  const saveRow = async (key: string) => {
    const row = rows.find((r) => r.key === key);
    if (!row) return;
    setSaving(key);
    await supabase.from('site_content').upsert({ key, ar: row.ar, en: row.en });
    setSaving(null);
    setSaved((s) => new Set(s).add(key));
  };

  return (
    <div className="space-y-10">
      {SECTIONS.map((section) => (
        <div key={section.title}>
          <h2 className="text-lg font-bold text-gray-700 mb-4">{section.title}</h2>
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50 shadow-sm overflow-hidden">
            {section.rows.map(({ key, label }) => (
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
                    <textarea
                      dir="rtl"
                      rows={2}
                      value={getValue(key, 'ar')}
                      onChange={(e) => setValue(key, 'ar', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-400 mb-1 block">English (EN)</label>
                    <textarea
                      rows={2}
                      value={getValue(key, 'en')}
                      onChange={(e) => setValue(key, 'en', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-pink-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
