export const dynamic = 'force-dynamic';
import { getDb } from '@/lib/db';
import ContentEditor from './ContentEditor';

export default async function ContentPage() {
  const db = getDb();
  const { results } = await db.prepare('SELECT key, ar, en FROM site_content ORDER BY key').all<{ key: string; ar: string; en: string }>();
  const rows = (results || []).map((r: { key: string; ar: string; en: string }) => ({ ...r, label: r.key }));

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
