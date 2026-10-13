'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp, currentUser } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { ROLE_LABELS } from '@/types';

export default function Shell({ children }: { children: React.ReactNode }) {
  const s = useApp();
  const t = dict[s.lang];
  const u = currentUser(s);
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
  ].filter((n) => !n.perm || u.role === 'SUPERADMIN' || u.permissions.includes(n.perm));

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-arabic' : ''}>
      <header className="bg-slate-900 text-white sticky top-0 z-10 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">✦ {t.brand}</Link>
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
            <div className="text-xs text-left">
              <div className="font-semibold">{isRtl ? u.name : u.nameEn}</div>
              <div className="text-slate-400">{ROLE_LABELS[u.role][isRtl ? 'ar' : 'en']}</div>
            </div>
            <button onClick={s.logout} className="text-xs bg-slate-800 hover:bg-red-700 px-3 py-1.5 rounded-lg">
              {t.logout}
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
