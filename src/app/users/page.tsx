'use client';

import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp, currentUser } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { PERMISSION_LABELS, DEPARTMENT_LABELS, ROLE_LABELS } from '@/types';
import type { User, Permission, Role, Department } from '@/types';

export default function UsersPage() {
  const s = useApp();
  const t = dict[s.lang];
  const me = currentUser(s);
  const ar = s.lang === 'ar';

  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', nameEn: '', email: '', role: 'EMPLOYEE' as Role, department: 'PRODUCTION' as Department, permissions: [] as Permission[] });

  const canManage = !!me && (me.role === 'SUPERADMIN' || me.role === 'ADMIN');

  if (!me) return <Shell>{null}</Shell>;
  const visibleUsers = me.role === 'SUPERADMIN' ? s.users : s.users.filter((u) => u.department === me.department);

  if (!canManage) {
    return <Shell><p className="text-red-600">{t.noPermission}</p></Shell>;
  }

  const openEdit = (u: User) => {
    setEditing(u);
    setCreating(false);
    setForm({ name: u.name, nameEn: u.nameEn, email: u.email, role: u.role, department: u.department, permissions: u.permissions });
  };

  const openCreate = () => {
    setEditing(null);
    setCreating(true);
    setForm({ name: '', nameEn: '', email: '', role: 'EMPLOYEE', department: me.role === 'SUPERADMIN' ? 'PRODUCTION' : me.department, permissions: ['ai.chat'] });
  };

  const save = () => {
    if (creating) {
      s.addUser(form);
    } else if (editing) {
      s.updateUser(editing.id, form);
    }
    setCreating(false);
    setEditing(null);
  };

  const togglePerm = (p: Permission) =>
    setForm((f) => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter((x) => x !== p) : [...f.permissions, p] }));

  const showModal = creating || !!editing;

  return (
    <Shell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">👥 {t.userManagement}</h1>
        <button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl text-sm">
          + {t.createAccount}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs bg-slate-50">
            <tr>
              <th className="p-3 text-start">{t.name}</th>
              <th className="p-3 text-start">{t.email}</th>
              <th className="p-3 text-start">{t.role}</th>
              <th className="p-3 text-start">{t.department}</th>
              <th className="p-3 text-start">{t.permissions}</th>
              <th className="p-3 text-start">{t.status}</th>
              <th className="p-3 text-start">{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {visibleUsers.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="p-3 font-medium">{ar ? u.name : u.nameEn}</td>
                <td className="p-3 text-slate-500" dir="ltr">{u.email}</td>
                <td className="p-3">{ROLE_LABELS[u.role][ar ? 'ar' : 'en']}</td>
                <td className="p-3">{DEPARTMENT_LABELS[u.department][ar ? 'ar' : 'en']}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {u.permissions.slice(0, 3).map((p) => (
                      <span key={p} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{PERMISSION_LABELS[p][ar ? 'ar' : 'en']}</span>
                    ))}
                    {u.permissions.length > 3 && <span className="text-xs text-slate-400">+{u.permissions.length - 3}</span>}
                  </div>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => s.toggleActive(u.id)}
                    disabled={u.role === 'SUPERADMIN'}
                    className={`px-2.5 py-1 rounded-full text-xs ${u.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} disabled:opacity-60`}
                  >
                    {u.active ? (ar ? 'نشط' : 'Active') : ar ? 'موقوف' : 'Inactive'}
                  </button>
                </td>
                <td className="p-3">
                  <button onClick={() => openEdit(u)} className="text-indigo-600 hover:underline text-xs font-semibold">
                    {t.editUser}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-20" onClick={() => { setCreating(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg mb-4">{creating ? t.createAccount : t.editUser}</h2>
            <div className="space-y-3">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={t.name} className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder={t.nameEn} className="w-full rounded-lg border border-slate-300 px-3 py-2" dir="ltr" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder={t.email} className="w-full rounded-lg border border-slate-300 px-3 py-2" dir="ltr" disabled={!creating} />
              {me.role === 'SUPERADMIN' && (
                <>
                  <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    {(['EMPLOYEE', 'ADMIN'] as Role[]).map((r) => <option key={r} value={r}>{ROLE_LABELS[r][ar ? 'ar' : 'en']}</option>)}
                  </select>
                  <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value as Department })} className="w-full rounded-lg border border-slate-300 px-3 py-2">
                    {(Object.keys(DEPARTMENT_LABELS) as Department[]).map((d) => <option key={d} value={d}>{DEPARTMENT_LABELS[d][ar ? 'ar' : 'en']}</option>)}
                  </select>
                </>
              )}
              <div>
                <p className="text-sm font-semibold mb-2">{t.permissions}</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(PERMISSION_LABELS) as Permission[]).map((p) => (
                    <label key={p} className="flex items-center gap-2 text-sm bg-slate-50 rounded-lg px-3 py-2 cursor-pointer">
                      <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePerm(p)} className="accent-indigo-600" />
                      {PERMISSION_LABELS[p][ar ? 'ar' : 'en']}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={save} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl">{t.save}</button>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="flex-1 border border-slate-300 font-semibold py-2.5 rounded-xl">{t.cancel}</button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}
