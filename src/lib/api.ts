'use client';

import type { Permission } from '@/types';
import type { SessionUser } from '@/store/useApp';

const DEMO_USERS: SessionUser[] = [
  { id: 'u1', name: 'المدير العام', nameEn: 'Super Admin', email: 'super@nashir.sa', role: 'SUPERADMIN', department: 'PRODUCTION', permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.manage', 'users.create', 'reports.view', 'plans.generate', 'assets.download'], active: true },
  { id: 'u2', name: 'مدير الإنتاج', nameEn: 'Production Admin', email: 'prod.admin@nashir.sa', role: 'ADMIN', department: 'PRODUCTION', permissions: ['ai.design', 'ai.video', 'ai.chat', 'users.create', 'plans.generate', 'assets.download'], active: true },
  { id: 'u3', name: 'مدير تقنية المعلومات', nameEn: 'IT Admin', email: 'it.admin@nashir.sa', role: 'ADMIN', department: 'IT', permissions: ['ai.chat', 'users.create', 'reports.view', 'plans.generate'], active: true },
  { id: 'u4', name: 'سارة المطيري', nameEn: 'Sarah Almutairi', email: 'sarah@nashir.sa', role: 'EMPLOYEE', department: 'DESIGN', permissions: ['ai.design', 'ai.chat'], active: true },
];

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === '1';

export async function apiLogin(email: string, password: string): Promise<SessionUser | null> {
  if (isStaticExport) {
    const u = DEMO_USERS.find((x) => x.email === email.trim().toLowerCase());
    return u || null;
  }
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user as SessionUser;
}

export async function apiLogout() {
  if (isStaticExport) return;
  await fetch('/api/auth', { method: 'DELETE' });
}

export async function apiUsers(): Promise<SessionUser[]> {
  if (isStaticExport) return DEMO_USERS;
  const res = await fetch('/api/users');
  if (!res.ok) return [];
  const data = await res.json();
  return data.users as SessionUser[];
}

export async function apiCreateUser(form: {
  name: string; nameEn: string; email: string; password: string;
  role?: string; department?: string; permissions: Permission[];
}): Promise<{ ok: boolean; error?: string }> {
  if (isStaticExport) return { ok: true };
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

export async function apiUpdateUser(id: string, patch: Record<string, unknown>): Promise<{ ok: boolean; error?: string }> {
  if (isStaticExport) return { ok: true };
  const res = await fetch('/api/users', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...patch }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, error: data.error };
}

export async function apiGenerate(type: 'design' | 'video', prompt: string): Promise<{ id: string; url: string | null; status: string }> {
  if (isStaticExport) {
    const id = (type === 'video' ? 'vid_' : 'dsn_') + Math.random().toString(36).slice(2, 10);
    return type === 'video'
      ? { id, url: null, status: 'queued' }
      : { id, url: `https://placehold.co/600x600/1e1b4b/a5b4fc?text=AI+Design+${Math.ceil(Math.random() * 4)}`, status: 'done' };
  }
  const res = await fetch('/api/assets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, prompt }),
  });
  if (!res.ok) throw new Error('forbidden');
  return res.json();
}

export async function apiChat(messages: { role: string; content: string }[], lang: string): Promise<string> {
  if (isStaticExport) {
    const last = messages[messages.length - 1]?.content || '';
    const ar = lang === 'ar';
    const isPlan = /خطة|خطة|plan|استراتيج|strategy|جدول/i.test(last);
    return isPlan
      ? (ar ? '📝 مقترح خطة أولية:\n\n1. التحليل (أسبوع 1)\n2. التخطيط (أسبوع 2)\n3. التنفيذ (أسابيع 3-5)\n4. المراجعة (أسبوع 6)\n5. الإطلاق (أسبوع 7)' : '📝 Draft plan:\n\n1. Analysis (W1)\n2. Planning (W2)\n3. Execution (W3-5)\n4. Review (W6)\n5. Launch (W7)')
      : (ar ? `شكراً — أنا المساعد التجريبي (وضع العرض). طلبك: «${last.slice(0, 120)}»` : `Thanks! Demo assistant (static mode). Your request: "${last.slice(0, 120)}"`);
  }
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, lang }),
  });
  if (!res.ok) throw new Error('forbidden');
  const data = await res.json();
  return data.reply as string;
}
