'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { apiLogin } from '@/lib/api';

export default function Home() {
  const t = dict[useApp((s) => s.lang)];
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);
  const setUser = useApp((s) => s.setUser);
  const router = useRouter();
  const [email, setEmail] = useState('super@nashir.sa');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = await apiLogin(email, password);
    if (u) {
      setUser(u);
      router.push('/dashboard');
    } else setErr(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold text-white">✦ {t.brand}</div>
          <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="text-sm text-indigo-300 hover:text-white">
            {t.language}
          </button>
        </div>
        <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <div>
            <h1 className="text-xl font-bold">{t.login}</h1>
            <p className="text-sm text-slate-500 mt-1">{t.tagline}</p>
          </div>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.email}</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              dir="ltr"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t.password}</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              dir="ltr"
            />
          </label>
          {err && <p className="text-red-600 text-sm">✗ {lang === 'ar' ? 'بريد أو كلمة مرور غير صحيحة' : 'Invalid email or password'}</p>}
          <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 transition">
            {t.signIn}
          </button>
        </form>
      </div>
    </main>
  );
}
