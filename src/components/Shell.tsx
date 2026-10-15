'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { ROLE_LABELS } from '@/types';
import { apiLogout } from '@/lib/api';

export default function Shell({ children }: { children: React.ReactNode }) {
  const s = useApp();
  const t = dict[s.lang];
  const u = s.user;
  const router = useRouter();
  const pathname = usePathname();

  if (!u) {
    router.push('/');
    return null;
  }

  const isRtl = s.lang === 'ar';

  const nav = [
    { href: '/dashboard', label: t.dashboard },
    { href: '/design', label: t.designStudio, perm: 'ai.design' as const },
    { href: '/video', label: t.videoStudio, perm: 'ai.video' as const },
    { href: '/chat', label: t.aiChat, perm: 'ai.chat' as const },
    { href: '/users', label: t.userManagement, perm: 'users.manage' as const },
  ].filter((n) => !n.perm || s.can(n.perm) || (n.href === '/users' && u.permissions.includes('users.create')));

  const logout = async () => {
    await apiLogout();
    s.setUser(null);
    router.push('/');
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'}>
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
          <Link href="/dashboard" className="text-xl font-bold whitespace-nowrap">✦ {t.brand}</Link>
          <nav className="flex gap-1 overflow-x-auto">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition ${pathname.startsWith(n.href) ? 'bg-indigo-600' : 'hover:bg-slate-800'}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => s.setLang(isRtl ? 'en' : 'ar')} className="text-xs text-indigo-300 hover:text-white">
              {t.language}
            </button>
            <div className="text-xs text-left hidden sm:block">
              <div className="font-semibold">{isRtl ? u.name : u.nameEn}</div>
              <div className="text-slate-400">{ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]?.[isRtl ? 'ar' : 'en'] || u.role}</div>
            </div>
            <button onClick={logout} className="text-xs bg-slate-800 hover:bg-red-700 px-3 py-1.5 rounded-lg">
              {t.logout}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
