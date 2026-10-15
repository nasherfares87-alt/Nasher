'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/lib/i18n';
import type { Permission } from '@/types';

export interface SessionUser {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: string;
  department: string;
  permissions: Permission[];
  active: boolean;
}

interface AppState {
  lang: Lang;
  user: SessionUser | null;
  demoMode: boolean;
  setLang: (l: Lang) => void;
  setUser: (u: SessionUser | null) => void;
  setDemoMode: (v: boolean) => void;
  can: (p: Permission) => boolean;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      user: null,
      demoMode: false,
      setLang: (lang) => set({ lang }),
      setUser: (user) => set({ user }),
      setDemoMode: (demoMode) => set({ demoMode }),
      can: (p) => {
        const u = get().user;
        if (!u) return false;
        if (u.role === 'SUPERADMIN') return true;
        return u.permissions.includes(p);
      },
    }),
    { name: 'nashir-app', partialize: (s) => ({ lang: s.lang, demoMode: s.demoMode }) }
  )
);
