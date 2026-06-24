'use client';
import { useEffect, useState } from 'react';
import { Appointment } from '@/lib/supabase';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Check, X, Clock } from 'lucide-react';

export default function AppointmentsAdmin() {
  const supabase = createSupabaseBrowser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: Appointment['status']) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    load();
  };

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-600',
    };
    const icons: Record<string, React.ReactNode> = {
      pending: <Clock size={12} />,
      confirmed: <Check size={12} />,
      cancelled: <X size={12} />,
    };
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${styles[status] || ''}`}>
        {icons[status]} {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">No appointments yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Contact</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Date & Time</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Notes</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                  <td className="px-4 py-3 text-gray-500">
                    <p>{a.phone}</p>
                    {a.email && <p className="text-xs text-gray-400">{a.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <p>{a.date}</p>
                    <p className="text-xs text-gray-400">{a.time}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-[150px] truncate">{a.notes || '-'}</td>
                  <td className="px-4 py-3">{statusBadge(a.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {a.status !== 'confirmed' && (
                        <button onClick={() => updateStatus(a.id, 'confirmed')}
                          className="p-1.5 hover:bg-green-50 rounded-lg" title="Confirm">
                          <Check size={14} className="text-green-500" />
                        </button>
                      )}
                      {a.status !== 'cancelled' && (
                        <button onClick={() => updateStatus(a.id, 'cancelled')}
                          className="p-1.5 hover:bg-red-50 rounded-lg" title="Cancel">
                          <X size={14} className="text-red-400" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
