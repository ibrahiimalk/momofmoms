'use client';
import { useEffect, useState } from 'react';
import { Product, Category } from '@/lib/supabase';
import { createSupabaseBrowser } from '@/lib/supabase-browser';
import { Trash2, Edit, Plus, X, Check } from 'lucide-react';
import Image from 'next/image';

const EMPTY_FORM = {
  name_ar: '', name_en: '',
  description_ar: '', description_en: '',
  price: '', category_id: '', image_url: '',
  in_stock: true, quantity: '0',
};

export default function ProductsAdmin() {
  const supabase = createSupabaseBrowser();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selling, setSelling] = useState<string | null>(null);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<(File | null)[]>([null, null, null]);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(['', '', '']);

  const load = async () => {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, categories(id, name_ar, name_en)').order('category_id').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('order_index').order('created_at'),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from('images').upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    if (!form.category_id) { alert('Please select a category first.'); return; }
    setSaving(true);
    try {
      let image_url = form.image_url;
      if (mainImageFile) image_url = await uploadImage(mainImageFile);

      // Upload any new gallery images, keep existing URLs for slots with no new file
      const newGalleryUrls = await Promise.all(
        galleryFiles.map((file, i) =>
          file ? uploadImage(file) : Promise.resolve(galleryUrls[i] || '')
        )
      );
      const gallery_images = newGalleryUrls.filter(Boolean);

      const payload = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar,
        description_en: form.description_en,
        price: parseFloat(form.price) || 0,
        quantity: parseInt(form.quantity) || 0,
        category_id: form.category_id,
        image_url,
        gallery_images,
        in_stock: form.in_stock,
      };
      if (editId) {
        await supabase.from('products').update(payload).eq('id', editId);
      } else {
        await supabase.from('products').insert([payload]);
      }
      setForm({ ...EMPTY_FORM });
      setEditId(null);
      setShowForm(false);
      setMainImageFile(null);
      setGalleryFiles([null, null, null]);
      setGalleryUrls(['', '', '']);
      load();
    } catch {
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      name_ar: p.name_ar,
      name_en: p.name_en,
      description_ar: p.description_ar || '',
      description_en: p.description_en || '',
      price: String(p.price),
      category_id: p.category_id || '',
      image_url: p.image_url,
      in_stock: p.in_stock,
      quantity: String(p.quantity ?? 0),
    });
    const existing = (p.gallery_images || []).slice(0, 3);
    setGalleryUrls([existing[0] || '', existing[1] || '', existing[2] || '']);
    setGalleryFiles([null, null, null]);
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    load();
  };

  const handleSold = async (p: Product) => {
    if ((p.quantity ?? 0) <= 0) return;
    setSelling(p.id);
    const newQty = (p.quantity ?? 0) - 1;
    await supabase.from('products').update({ quantity: newQty, in_stock: newQty > 0 }).eq('id', p.id);
    setSelling(null);
    load();
  };

  const removeGallerySlot = (i: number) => {
    const newFiles = [...galleryFiles]; newFiles[i] = null;
    const newUrls = [...galleryUrls]; newUrls[i] = '';
    setGalleryFiles(newFiles);
    setGalleryUrls(newUrls);
  };

  // Group by category
  const grouped: Record<string, { cat: Category | null; items: Product[] }> = {};
  for (const p of products) {
    const catId = p.category_id || '__none__';
    if (!grouped[catId]) grouped[catId] = { cat: (p as any).categories || null, items: [] };
    grouped[catId].items.push(p);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM }); setEditId(null); setGalleryFiles([null,null,null]); setGalleryUrls(['','','']); setMainImageFile(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600 text-sm font-medium"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
      {categories.length === 0 && (
        <p className="text-amber-600 text-sm mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2">
          ⚠️ You need to create categories first before adding products.{' '}
          <a href="/admin/categories" className="underline font-medium">Go to Categories →</a>
        </p>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 shadow-sm mt-4">
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
              <label className="text-xs text-gray-500 font-medium">Description (Arabic)</label>
              <textarea rows={3} value={form.description_ar} onChange={e => setForm({ ...form, description_ar: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400 resize-none" dir="rtl" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Description (English)</label>
              <textarea rows={3} value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400 resize-none" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Price (KWD)</label>
              <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Quantity</label>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium">Category <span className="text-red-400">*</span></label>
              <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:border-pink-400 bg-white">
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name_en} / {cat.name_ar}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input type="checkbox" id="instock" checked={form.in_stock}
                onChange={e => setForm({ ...form, in_stock: e.target.checked })} />
              <label htmlFor="instock" className="text-sm text-gray-700">In Stock</label>
            </div>

            {/* Main image */}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium">Main Image</label>
              <input type="file" accept="image/*" onChange={e => setMainImageFile(e.target.files?.[0] || null)}
                className="w-full border rounded-lg px-3 py-2 mt-1 text-sm" />
              {form.image_url && !mainImageFile && (
                <div className="mt-2 flex items-center gap-2">
                  <Image src={form.image_url} alt="main" width={60} height={60} className="rounded-lg object-cover" />
                  <span className="text-xs text-gray-400">Current main image</span>
                </div>
              )}
            </div>

            {/* Gallery images */}
            <div className="sm:col-span-2">
              <label className="text-xs text-gray-500 font-medium mb-2 block">Gallery Images (up to 3)</label>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className="border rounded-xl p-3 bg-gray-50 relative">
                    <p className="text-xs text-gray-400 mb-2">Photo {i + 1}</p>
                    {galleryUrls[i] && !galleryFiles[i] ? (
                      <div className="relative mb-2">
                        <Image src={galleryUrls[i]} alt={`gallery ${i+1}`} width={80} height={80} className="rounded-lg object-cover" />
                        <button onClick={() => removeGallerySlot(i)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                          ×
                        </button>
                      </div>
                    ) : null}
                    <input type="file" accept="image/*"
                      onChange={e => {
                        const files = [...galleryFiles];
                        files[i] = e.target.files?.[0] || null;
                        setGalleryFiles(files);
                      }}
                      className="w-full text-xs" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-4 flex items-center gap-2 bg-pink-500 text-white px-6 py-2 rounded-xl text-sm font-medium hover:bg-pink-600 disabled:opacity-60">
            <Check size={16} /> {saving ? 'Saving…' : 'Save Product'}
          </button>
        </div>
      )}

      {/* Products grouped by category */}
      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading…</div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border text-gray-400">No products yet.</div>
      ) : (
        <div className="space-y-8 mt-6">
          {Object.entries(grouped).map(([catId, { cat, items }]) => (
            <div key={catId}>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-base font-bold text-gray-700">
                  {cat ? `${cat.name_en} / ${cat.name_ar}` : 'Uncategorized'}
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{items.length} products</span>
              </div>
              <div className="bg-white rounded-2xl border overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Qty</th>
                      <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {items.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              {p.image_url
                                ? <Image src={p.image_url} alt={p.name_en} width={40} height={40} className="object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-lg">👶</div>}
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{p.name_en}</p>
                              <p className="text-gray-400 text-xs" dir="rtl">{p.name_ar}</p>
                              {(p.gallery_images?.length > 0) && (
                                <p className="text-xs text-blue-400 mt-0.5">{p.gallery_images.length} gallery photo{p.gallery_images.length > 1 ? 's' : ''}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{p.price} KWD</td>
                        <td className="px-4 py-3 text-gray-700 font-medium">{p.quantity ?? 0}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {p.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleSold(p)}
                              disabled={selling === p.id || (p.quantity ?? 0) <= 0}
                              title="Mark one as sold"
                              className="text-xs px-2.5 py-1 rounded-lg font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                              style={{ borderColor: '#BB5E86', color: '#BB5E86' }}
                            >
                              {selling === p.id ? '…' : '− Sold'}
                            </button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
