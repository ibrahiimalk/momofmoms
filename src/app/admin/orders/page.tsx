'use client';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Package, Phone, Mail, MapPin, ChevronDown, ChevronUp } from 'lucide-react';

type OrderItem = { id: string; name_en: string; name_ar: string; price: number; quantity: number; image_url: string };
type Order = {
  id: string; name: string; email: string; phone: string;
  area: string; block: string; street: string; avenue: string | null; house: string;
  total_price: number; status: string; created_at: string;
  order_items?: OrderItem[];
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  delivered: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function OrdersAdmin() {
  const supabase = createSupabaseBrowser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await supabase.from('orders').update({ status }).eq('id', id);
    setUpdating(null);
    load();
  };

  const counts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <div className="flex gap-2 text-xs">
          {Object.entries(counts).map(([s, n]) => (
            <span key={s} className={`px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_COLORS[s] || 'bg-gray-100 text-gray-600'}`}>
              {s} ({n})
            </span>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">No orders yet.</div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#F0E8EC' }}>
              {/* Header row */}
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-800">{order.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{order.phone}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={11} />{order.email}</span>
                    <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{order.area}, Block {order.block}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-sm" style={{ color: '#BB5E86' }}>{Number(order.total_price).toFixed(3)} KWD</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  className="p-2 hover:bg-gray-50 rounded-xl flex-shrink-0">
                  {expanded === order.id ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>
              </div>

              {/* Expanded details */}
              {expanded === order.id && (
                <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: '#F0E8EC', background: '#FDFBFC' }}>
                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1"><Package size={12} /> Items</p>
                    <div className="space-y-2">
                      {(order.order_items || []).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{item.name_en} <span className="text-gray-400">× {item.quantity}</span></span>
                          <span className="font-medium text-gray-800">{(item.price * item.quantity).toFixed(3)} KWD</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full address */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1 flex items-center gap-1"><MapPin size={12} /> Full Address</p>
                    <p className="text-sm text-gray-700">
                      {order.area}, Block {order.block}, Street {order.street}
                      {order.avenue ? `, Ave ${order.avenue}` : ''}, House {order.house}
                    </p>
                  </div>

                  {/* Status update */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-xs font-semibold text-gray-500">Update status:</span>
                    {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                      <button key={s} onClick={() => updateStatus(order.id, s)}
                        disabled={order.status === s || updating === order.id}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize border transition-colors disabled:opacity-40 ${
                          order.status === s ? STATUS_COLORS[s] + ' border-transparent' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        {updating === order.id ? '…' : s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
