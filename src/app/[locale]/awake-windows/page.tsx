export const dynamic = 'force-dynamic';
import { Locale, translations } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';
import AwakeWindowsClient from './AwakeWindowsClient';

async function getAwakeWindows() {
  try {
    const { data } = await supabase
      .from('awake_windows')
      .select('*')
      .order('order_index', { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

export default async function AwakeWindowsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const t = translations[locale];
  const isRTL = locale === 'ar';
  const windows = await getAwakeWindows();

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-white max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🌅</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.awake.title}</h1>
        <p className="text-gray-500">{t.awake.subtitle}</p>
      </div>

      {windows.length === 0 ? (
        <div className="text-center py-16 bg-amber-50 rounded-2xl">
          <p className="text-gray-500">
            {locale === 'ar' ? 'لا توجد نوافذ يقظة بعد. أضفها من لوحة التحكم.' : 'No awake windows yet. Add them from the dashboard.'}
          </p>
        </div>
      ) : (
        <AwakeWindowsClient windows={windows} locale={locale} selectLabel={t.awake.selectAge} />
      )}
    </div>
  );
}
