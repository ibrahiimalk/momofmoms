'use client';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/supabase';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';
import Image from 'next/image';

const EMPTY_FORM = { name_ar: '', name_en: '', price: '', category: '', image_url: '', in_stock: true };

export default function ProductsAdmin() {
  const supabase = createSupabaseBrowser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let image_url = form.image_url;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload = { ...form, price: parseFloat(form.price) || 0, image_url };
      if (editId) {
        await supabase.from('products').update(payload).eq('id', editId);
      } else {
        await supabase.from('products').insert([payload]);
      }
      setForm({ ...EMPTY_FORM });
      setEditId(null);
      setShowForm(false);
      setImageFile(null);
      load();
    } catch {
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({ name_ar: p.name_ar, name_en: p.name_en, price: String(p.price), category: p.category, image_url: p.image_url, in_stock: p.in_stock });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button onClick={() => { setForm({ ...EMPTY_FORM }); setEditId(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 text-sm font-medium">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">{editId ? 'Edit Product' : 'New Product'}</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 font-medium">Name (Arabic)</label>
              <input value={form.name_ar} onChange={e => setForm({ ...form, name_ar: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" dir="rtl" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Name (English)</label>
              <input value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Price (SAR)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Category</label>
              <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. diapers, clothes"
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium">Product Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
              {form.image_url && !imageFile && (
                <p className="text-xs text-gray-400 mt-1">Current: {form.image_url.split('/').pop()}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="instock" checked={form.in_stock}
                onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
              <label htmlFor="instock" className="text-sm text-gray-700">In Stock</label>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-4 flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 disabled:opacity-60">
            <Check size={16} /> {saving ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">No products yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.image_url ? (
                          <Image src={p.image_url} alt={p.name_en} width={40} height={40} className="object-cover" />
                        ) : <div className="w-full h-full flex items-center justify-center text-lg">👶</div>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{p.name_en}</p>
                        <p className="text-gray-400 text-xs" dir="rtl">{p.name_ar}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.price} SAR</td>
                  <td className="px-4 py-3 text-gray-500">{p.category || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                        <Edit size={15} className="text-gray-500" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} className="text-red-400" />
                      </button>
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
