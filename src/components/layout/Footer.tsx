import { Locale } from '@/lib/i18n';

export default function Footer({ locale }: { locale: Locale }) {
  const isRTL = locale === 'ar';
  return (
    <footer className="bg-pink-50 border-t mt-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-pink-600 font-bold text-lg mb-1">MomOfMoms 👶</p>
        <p className="text-gray-500 text-sm">
          {locale === 'ar' ? '© 2025 MomOfMoms. جميع الحقوق محفوظة.' : '© 2025 MomOfMoms. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
