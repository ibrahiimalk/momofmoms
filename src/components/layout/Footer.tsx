import Image from 'next/image';
import { Locale } from '@/lib/i18n';

export default function Footer({ locale }: { locale: Locale }) {
  const isRTL = locale === 'ar';
  return (
    <footer className="border-t mt-16" style={{ background: '#FDF8F4', borderColor: '#F5E8EE' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 py-8 text-center flex flex-col items-center gap-3">
        <Image
          src="/hero-2.png"
          alt="MomOfMoms"
          width={140}
          height={75}
          className="object-contain"
        />
        <p className="text-sm" style={{ color: '#A08090' }}>
          {locale === 'ar' ? '© 2025 MomOfMoms. جميع الحقوق محفوظة.' : '© 2025 MomOfMoms. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}
