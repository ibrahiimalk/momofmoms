'use client';
import { useEffect, useState } from 'react';
import { AwakeWindow } from '@/lib/supabase';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Trash2, Edit, Plus, X, Check, GripVertical } from 'lucide-react';
import Image from 'next/image';

const EMPTY = { label_ar: '', label_en: '', image_url: '', order_index: 0 };

export default function AwakeWindowsAdmin() {
  const supabase = createSupabaseBrowser();
  const [items, setItems] = useState<AwakeWindow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = async () => {
    const { data } = await supabase.from('awake_windows').select('*').order('order_index');
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `awake/${Date.now()}.${ext}`;
    await supabase.storage.from('images').upload(path, file);
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);
      const payload = { ...form, image_url, order_index: editId ? form.order_index : items.length };
      if (editId) {
        await supabase.from('awake_windows').update(payload).eq('id', editId);
      } else {
        await supabase.from('awake_windows').insert([payload]);
      }
      setForm({ ...EMPTY });
      setEditId(null);
      setShowForm(false);
      setImageFile(null);
      load();
    } catch { alert('Error saving'); }
    finally { setSaving(false); }
  };

  const handleEdit = (item: AwakeWindow) => {
    setForm({ label_ar: item.label_ar, label_en: item.label_en, image_url: item.image_url, order_index: item.order_index });
    setEditId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    await supabase.from('awake_windows').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Awake Windows</h1>
        <button onClick={() => { setForm({ ...EMPTY }); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl hover:bg-amber-600 text-sm font-medium">
          <Plus size={16} /> Add Window
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Each entry becomes a dropdown option on the Awake Windows page. Upload an infographic image for each age group.
      </p>

      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">{editId ? 'Edit' : 'New'} Awake Window</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Label (Arabic)</label>
              <input value={form.label_ar} onChange={e => setForm({ ...form, label_ar: e.target.value })}
                placeholder="مثال: عمر 0-1 شهر"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-amber-400" dir="rtl" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Label (English)</label>
              <input value={form.label_en} onChange={e => setForm({ ...form, label_en: e.target.value })}
                placeholder="e.g. Age 0-1 month"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-amber-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium">Infographic Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
              {form.image_url && !imageFile && (
                <div className="mt-2 relative w-40 h-24 rounded-lg overflow-hidden border">
                  <Image src={form.image_url} alt="current" fill className="object-contain" />
                </div>
              )}
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-4 flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-amber-600 disabled:opacity-60">
            <Check size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">No awake windows yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border p-4 flex items-center gap-4">
              <GripVertical size={16} className="text-gray-300" />
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.label_en} width={64} height={48} className="object-contain w-full h-full" />
                ) : <div className="w-full h-full flex items-center justify-center">🌅</div>}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.label_en}</p>
                <p className="text-sm text-gray-400" dir="rtl">{item.label_ar}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <Edit size={15} className="text-gray-500" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                  <Trash2 size={15} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
