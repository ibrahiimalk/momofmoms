export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';
import ContentEditor from './ContentEditor';

export default async function ContentPage() {
  const { data } = await supabase.from('site_content').select('key, ar, en').order('key');
  const rows = (data || []).map((r) => ({ ...r, label: r.key }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Content Editor</h1>
        <p className="text-gray-500 mt-1 text-sm">Edit every text on the website in Arabic and English. Changes go live immediately after saving.</p>
      </div>
      <ContentEditor initial={rows} />
    </div>
  );
}
