import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Lang } from '@/lib/i18n';
import type { User, Permission } from '@/types';

interface AppState {
  lang: Lang;
  currentUserId: string | null;
  users: User[];
  setLang: (l: Lang) => void;
  login: (email: string) => boolean;
  logout: () => void;
  addUser: (u: Omit<User, 'id' | 'createdAt' | 'active'>) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  toggleActive: (id: string) => void;
  setPermissions: (id: string, perms: Permission[]) => void;
  can: (p: Permission) => boolean;
}

const seedUsers: User[] = [
  {
    id: 'u1',
    name: 'المدير العام',
    nameEn: 'Super Admin',
    email: 'super@nashir.sa',
    role: 'SUPERADMIN',
    department: 'PRODUCTION',
    permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.manage', 'users.create', 'reports.view', 'plans.generate', 'assets.download'],
    active: true,
    createdAt: '2024-01-01',
  },
  {
    id: 'u2',
    name: 'مدير الإنتاج',
    nameEn: 'Production Admin',
    email: 'prod.admin@nashir.sa',
    role: 'ADMIN',
    department: 'PRODUCTION',
    permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.create', 'plans.generate', 'assets.download'],
    active: true,
    createdAt: '2024-01-02',
  },
  {
    id: 'u3',
    name: 'مدير تقنية المعلومات',
    nameEn: 'IT Admin',
    email: 'it.admin@nashir.sa',
    role: 'ADMIN',
    department: 'IT',
    permissions: ['ai.chat', 'users.create', 'reports.view', 'plans.generate'],
    active: true,
    createdAt: '2024-01-02',
  },
  {
    id: 'u4',
    name: 'سارة المطيري',
    nameEn: 'Sarah Almutairi',
    email: 'sarah@nashir.sa',
    role: 'EMPLOYEE',
    department: 'DESIGN',
    permissions: ['ai.design', 'ai.chat'],
    active: true,
    createdAt: '2024-03-01',
  },
];

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      lang: 'ar',
      currentUserId: null,
      users: seedUsers,
      setLang: (lang) => set({ lang }),
      login: (email) => {
        const u = get().users.find((x) => x.email === email.trim().toLowerCase() && x.active);
        if (u) {
          set({ currentUserId: u.id });
          return true;
        }
        return false;
      },
      logout: () => set({ currentUserId: null }),
      addUser: (u) =>
        set((s) => ({
          users: [
            ...s.users,
            { ...u, id: 'u' + Math.random().toString(36).slice(2, 9), active: true, createdAt: new Date().toISOString().slice(0, 10) },
          ],
        })),
      updateUser: (id, patch) => set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) })),
      toggleActive: (id) => set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, active: !u.active } : u)) })),
      setPermissions: (id, perms) => set((s) => ({ users: s.users.map((u) => (u.id === id ? { ...u, permissions: perms } : u)) })),
      can: (p) => {
        const id = get().currentUserId;
        if (!id) return false;
        const u = get().users.find((x) => x.id === id);
        if (!u) return false;
        if (u.role === 'SUPERADMIN') return true;
        return u.permissions.includes(p);
      },
    }),
    { name: 'nashir-app' }
  )
);

export const currentUser = (s: AppState) => s.users.find((u) => u.id === s.currentUserId) || null;
