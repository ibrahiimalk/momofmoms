'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';


const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

export default function BookingForm({ content }: { locale: Locale; content: Record<string, string> }) {
  const c = content;
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: err } = await supabase.from('appointments').insert([{ ...form, status: 'pending' }]);
      if (err) throw err;
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', date: '', time: '', notes: '' });
    } catch {
      setError(c['book.error']);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-16 rounded-2xl" style={{ background: '#F0FDF4' }}>
        <div className="text-5xl mb-4">✅</div>
        <p className="font-semibold text-lg" style={{ color: '#15803D' }}>{c['book.success']}</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm underline" style={{ color: '#BB5E86' }}>
          {c['book.bookAnother']}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4" style={{ borderColor: '#F0E8EC' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.name']} *</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.phone']} *</label>
          <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.email']}</label>
        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.date']} *</label>
          <input type="date" required value={form.date} min={new Date().toISOString().split('T')[0]}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: '#5C4048' }}>{c['book.time']} *</label>
          <select required value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-pink-400 bg-white">
            <option value="">-- {c['book.time']} --</option>
            {TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
          </select>
        </div>
      </div>
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
