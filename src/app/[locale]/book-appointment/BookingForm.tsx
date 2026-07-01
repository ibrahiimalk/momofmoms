'use client';
import { useState } from 'react';

export default function BookingForm({ content }: { content: Record<string, string> }) {
  const c = content;
  const [form, setForm] = useState({ name: '', email: '', phone: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.time) { setError(c['book.error']); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed');
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', time: '', notes: '' });
    } catch {
      setError(c['book.error']);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 px-8 rounded-3xl" style={{ background: 'linear-gradient(135deg, #FDF0EC 0%, #FAE8EF 100%)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl" style={{ background: '#FAE0EC' }}>
          💌
        </div>
        <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>
          {c['book.successTitle']}
        </h3>
        <p className="text-base leading-relaxed mb-8" style={{ color: '#7A6068' }}>
          {c['book.successMsg']}
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-full text-sm font-semibold border-2 transition-colors hover:opacity-80"
          style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
        >
          {c['book.bookAnother']}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-5" style={{ borderColor: '#F0E8EC' }}>
      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.name']} *</label>
        <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.phone']} *</label>
        <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.email']}</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>

      {/* Period toggle */}
      <div>
        <label className="block text-sm font-medium mb-3" style={{ color: '#5C4048' }}>{c['book.period']} *</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'morning', label: c['book.morning'], emoji: '🌅' },
            { value: 'evening', label: c['book.evening'], emoji: '🌙' },
          ].map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, time: opt.value })}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border-2 font-medium text-sm transition-all"
              style={{
                borderColor: form.time === opt.value ? '#BB5E86' : '#E5E7EB',
                background: form.time === opt.value ? '#FAE0EC' : 'white',
                color: form.time === opt.value ? '#BB5E86' : '#6B7280',
              }}
            >
              <span className="text-2xl">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.notes']}</label>
        <textarea rows={3} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 resize-none" />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full text-white py-3 rounded-xl font-semibold transition-opacity hover:opacity-90 disabled:opacity-60"
        style={{ background: '#BB5E86' }}>
        {loading ? '...' : c['book.submit']}
      </button>
    </form>
  );
}
