export const dynamic = 'force-dynamic';
import { Locale } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import { getContent } from '@/lib/content';
import AwakeWindowsClient from './AwakeWindowsClient';

async function getAwakeWindows() {
  try {
    const { data } = await supabase.from('awake_windows').select('*').order('order_index', { ascending: true });
    return data || [];
  } catch { return []; }
}

export default async function AwakeWindowsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const isRTL = locale === 'ar';
  const [windows, c] = await Promise.all([getAwakeWindows(), getContent(locale)]);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen max-w-4xl mx-auto px-4 py-10" style={{ background: '#FDF8F4' }}>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif', color: '#2D1B20' }}>{c['awake.title']}</h1>
        <p style={{ color: '#7A6068' }}>{c['awake.subtitle']}</p>
      </div>
      {windows.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#FAE0EC' }}>
          <p style={{ color: '#7A6068' }}>{c['awake.empty']}</p>
        </div>
      ) : (
        <AwakeWindowsClient windows={windows} locale={locale} selectLabel={c['awake.selectAge']} />
      )}
    </div>
  );
}
