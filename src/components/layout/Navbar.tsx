'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, translations } from '@/lib/i18n';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar({ locale }: { locale: Locale }) {
  const t = translations[locale].nav;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRTL = locale === 'ar';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}/pregnancy-calculator`, label: t.pregnancyCalc },
    { href: `/${locale}/book-appointment`, label: t.bookAppointment },
    { href: `/${locale}/awake-windows`, label: t.awakeWindows },
    { href: `/${locale}/shop`, label: t.shop },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b" style={{ background: '#FFFFFF', borderColor: '#F5E8EE' }} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: '#FAE0EC' }}>
              👶
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif', color: '#BB5E86' }}>
              MomOfMoms
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors"
                style={{
                  color: pathname === link.href ? '#BB5E86' : '#5C4048',
                  borderBottom: pathname === link.href ? '2px solid #BB5E86' : '2px solid transparent',
                  paddingBottom: '2px',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href={otherLocalePath}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-pink-50"
              style={{ borderColor: '#E8C8D8', color: '#BB5E86' }}
            >
              {otherLocale === 'ar' ? 'ع' : 'EN'}
            </Link>
            <Link href={`/${locale}/shop`} className="p-2 rounded-full transition-colors hover:bg-pink-50">
              <ShoppingBag size={18} style={{ color: '#5C4048' }} />
            </Link>
            <Link href="/admin" className="p-2 rounded-full transition-colors hover:bg-pink-50">
              <User size={18} style={{ color: '#5C4048' }} />
            </Link>
            <button className="md:hidden p-2 rounded-full hover:bg-pink-50" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-6 py-4 flex flex-col gap-4" style={{ background: '#FDF8F4', borderColor: '#F5E8EE' }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium py-1"
              style={{ color: pathname === link.href ? '#BB5E86' : '#5C4048' }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
