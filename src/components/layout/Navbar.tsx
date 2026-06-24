'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, translations } from '@/lib/i18n';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function Navbar({ locale }: { locale: Locale }) {
  const t = translations[locale].nav;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isRTL = locale === 'ar';
  const otherLocale = locale === 'ar' ? 'en' : 'ar';
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/shop`, label: t.shop },
    { href: `/${locale}/awake-windows`, label: t.awakeWindows },
    { href: `/${locale}/book-appointment`, label: t.bookAppointment },
    { href: `/${locale}/pregnancy-calculator`, label: t.pregnancyCalc },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👶</span>
            </div>
            <span className="font-bold text-pink-600 text-lg hidden sm:block">MomOfMoms</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-pink-500 ${
                  pathname === link.href ? 'text-pink-600 border-b-2 border-pink-500 pb-1' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <Link href={otherLocalePath} className="text-xs font-semibold border border-gray-300 rounded px-2 py-1 hover:bg-gray-50">
              {otherLocale === 'ar' ? 'ع' : 'EN'}
            </Link>
            <Link href={`/${locale}/shop`} className="p-2 hover:bg-pink-50 rounded-full">
              <ShoppingBag size={20} className="text-gray-600" />
            </Link>
            <Link href="/admin" className="p-2 hover:bg-pink-50 rounded-full">
              <User size={20} className="text-gray-600" />
            </Link>
            <ThemeToggle />
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-pink-500 py-1"
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
