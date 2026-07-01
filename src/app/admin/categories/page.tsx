'use client';
import { useEffect, useState } from 'react';
import { Category } from '@/lib/supabase';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function CategoriesAdmin() {
  const supabase = createSupabaseBrowser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('order_index').order('created_at');
    setCategories(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!nameAr.trim() || !nameEn.trim()) return;
    setSaving(true);
    const order_index = categories.length;
    await supabase.from('categories').insert([{ name_ar: nameAr.trim(), name_en: nameEn.trim(), order_index }]);
    setNameAr('');
    setNameEn('');
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category? Products linked to it will become uncategorized.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Create categories first, then assign products to them.</p>
      </div>

      {/* Add form */}
      <div className="bg-white rounded-2xl border p-6 mb-8 shadow-sm">
        <h2 className="font-semibold text-gray-700 mb-4">New Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Name (Arabic)</label>
            <input
              dir="rtl"
              value={nameAr}
              onChange={e => setNameAr(e.target.value)}
              placeholder="مثال: ملابس أطفال"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Name (English)</label>
            <input
              value={nameEn}
              onChange={e => setNameEn(e.target.value)}
              placeholder="e.g. Baby Clothes"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-pink-400"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          disabled={saving || !nameAr.trim() || !nameEn.trim()}
          className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 disabled:opacity-50"
        >
          <Plus size={16} /> {saving ? 'Adding…' : 'Add Category'}
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading…</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">
          No categories yet. Add one above.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-8 px-4 py-3"></th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Arabic</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">English</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-300">
                    <GripVertical size={16} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-800" dir="rtl">{cat.name_ar}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.name_en}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(cat.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                      <Trash2 size={15} className="text-red-400" />
                    </button>
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
