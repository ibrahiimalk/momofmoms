import Link from 'next/link';
import { ShoppingBag, Moon, Calendar, LayoutDashboard, FileText, Tag } from 'lucide-react';
import LogoutButton from './LogoutButton';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: Tag },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/awake-windows', label: 'Awake Windows', icon: Moon },
    { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
    { href: '/admin/content', label: 'Website Text', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r shadow-sm flex flex-col">
        <div className="p-5 border-b">
          <Link href="/" className="text-pink-600 font-bold text-lg">MomOfMoms</Link>
          <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm font-medium"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-2">
          <Link href="/ar" className="block text-xs text-gray-400 hover:text-pink-500">← View Site</Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
