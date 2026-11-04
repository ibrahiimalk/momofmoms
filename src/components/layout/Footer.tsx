import Image from 'next/image';
import { Locale } from '@/lib/i18n';

export default function Footer({ locale, content }: { locale: Locale; content: Record<string, string> }) {
  const isRTL = locale === 'ar';
  return (
    <footer className="border-t mt-16" style={{ background: '#FDF8F4', borderColor: '#F5E8EE' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 py-8 text-center flex flex-col items-center gap-3">
        <Image
          src="/logo.png"
          alt="MomOfMoms"
          width={140}
          height={75}
          className="object-contain"
        />
        <p className="text-sm" style={{ color: '#A08090' }}>
          {content['footer.rights']}
        </p>
        <p className="text-xs" style={{ color: '#A08090' }}>
          {isRTL ? 'تصميم وتطوير ' : 'Designed & built by '}
          <a
            href={isRTL ? 'https://luxuryrent.it.com/' : 'https://luxuryrent.it.com/en/'}
            target="_blank"
            rel="noopener"
            className="underline underline-offset-2 hover:opacity-80"
          >
            {isRTL ? 'لاكجيري رينت' : 'Luxury Rent'}
          </a>
        </p>
      </div>
    </footer>
  );
}
