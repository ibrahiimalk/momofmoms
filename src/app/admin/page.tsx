export const dynamic = 'force-dynamic';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ShoppingBag, Moon, Calendar, FileText } from 'lucide-react';

async function getStats() {
  try {
    const [products, windows, appointments] = await Promise.all([
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('awake_windows').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }),
    ]);
    return {
      products: products.count || 0,
      windows: windows.count || 0,
      appointments: appointments.count || 0,
    };
  } catch {
    return { products: 0, windows: 0, appointments: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Products', value: stats.products, icon: ShoppingBag, href: '/admin/products', color: 'text-pink-500 bg-pink-50' },
    { label: 'Awake Windows', value: stats.windows, icon: Moon, href: '/admin/awake-windows', color: 'text-amber-500 bg-amber-50' },
    { label: 'Appointments', value: stats.appointments, icon: Calendar, href: '/admin/appointments', color: 'text-purple-500 bg-purple-50' },
    { label: 'Website Text', value: '✏️', icon: FileText, href: '/admin/content', color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={href} href={href} className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
              <Icon size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h2 className="font-semibold text-blue-700 mb-2">📋 Setup Checklist</h2>
        <ul className="text-sm text-blue-600 space-y-1 list-disc list-inside">
          <li>Connect your Supabase project in <code>.env.local</code></li>
          <li>Run the SQL schema in your Supabase dashboard</li>
          <li>Add your first products</li>
          <li>Add awake window entries with images</li>
        </ul>
      </div>
    </div>
  );
}
