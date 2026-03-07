'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', emoji: '🏠' },
  { href: '/meals', label: 'My Meals', emoji: '🍳' },
  { href: '/orders', label: 'Orders', emoji: '📦' },
  { href: '/earnings', label: 'Earnings', emoji: '💰' },
];

export default function Sidebar({ cookName }: { cookName?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  return (
    <aside className="w-64 bg-mocha min-h-screen flex flex-col">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-amber-900">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🍛</span>
          <div>
            <p className="font-display text-white text-lg leading-tight">Maase</p>
            <p className="text-amber-300 text-xs">Cook Portal</p>
          </div>
        </div>
      </div>

      {/* Cook info */}
      {cookName && (
        <div className="px-6 py-4 border-b border-amber-900">
          <div className="w-10 h-10 rounded-full bg-turmeric flex items-center justify-center text-mocha font-bold mb-2">
            {cookName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <p className="text-white font-medium text-sm">{cookName}</p>
          <p className="text-amber-400 text-xs">Home Cook</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, emoji }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? 'bg-turmeric text-mocha'
                  : 'text-amber-200 hover:bg-amber-900 hover:text-white'
              }`}
            >
              <span className="text-lg">{emoji}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-amber-900">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-amber-300 hover:bg-amber-900 hover:text-white transition"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}
