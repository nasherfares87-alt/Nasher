'use client';

import Shell from '@/components/Shell';
import { useApp, currentUser } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { DEPARTMENT_LABELS, ROLE_LABELS } from '@/types';

export default function Dashboard() {
  const s = useApp();
  const t = dict[s.lang];
  const u = currentUser(s);
  if (!u) return <Shell>{null}</Shell>;
  const ar = s.lang === 'ar';
  const deptUsers = s.users.filter((x) => x.role !== 'SUPERADMIN' && (u.role === 'SUPERADMIN' || x.department === u.department));

  const cards = [
    { label: t.users, value: s.users.length },
    { label: t.activeUsers, value: s.users.filter((x) => x.active).length },
    { label: t.departmentUsers, value: deptUsers.length },
    { label: t.totalRequests, value: 128 },
  ];

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-1">{t.welcome}، {ar ? u.name : u.nameEn} 👋</h1>
      <p className="text-slate-500 mb-8">
        {ROLE_LABELS[u.role][ar ? 'ar' : 'en']} · {DEPARTMENT_LABELS[u.department][ar ? 'ar' : 'en']}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="text-3xl font-extrabold text-indigo-600">{c.value}</div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold mb-4">{t.departmentUsers}</h2>
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs border-b">
            <tr>
              <th className="py-2 text-start">{t.name}</th>
              <th className="py-2 text-start">{t.role}</th>
              <th className="py-2 text-start">{t.department}</th>
              <th className="py-2 text-start">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {deptUsers.map((x) => (
              <tr key={x.id} className="border-b last:border-0">
                <td className="py-2.5 font-medium">{ar ? x.name : x.nameEn}</td>
                <td className="py-2.5">{ROLE_LABELS[x.role][ar ? 'ar' : 'en']}</td>
                <td className="py-2.5">{DEPARTMENT_LABELS[x.department][ar ? 'ar' : 'en']}</td>
                <td className="py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${x.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {x.active ? (ar ? 'نشط' : 'Active') : ar ? 'موقوف' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
