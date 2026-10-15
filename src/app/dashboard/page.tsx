'use client';

import { useEffect, useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { DEPARTMENT_LABELS, ROLE_LABELS } from '@/types';
import { apiUsers } from '@/lib/api';
import type { SessionUser } from '@/store/useApp';

export default function Dashboard() {
  const s = useApp();
  const t = dict[s.lang];
  const u = s.user;
  const ar = s.lang === 'ar';
  const [users, setUsers] = useState<SessionUser[]>([]);

  useEffect(() => {
    apiUsers().then((list) => setUsers(list));
  }, []);

  if (!u) return <Shell>{null}</Shell>;

  const deptUsers = u.role === 'SUPERADMIN' ? users : users.filter((x) => x.department === u.department);

  const cards = [
    { label: t.users, value: users.length },
    { label: t.activeUsers, value: users.filter((x) => x.active).length },
    { label: t.departmentUsers, value: deptUsers.length },
    { label: t.totalRequests, value: 128 },
  ];

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-1">{t.welcome}، {ar ? u.name : u.nameEn} 👋</h1>
      <p className="text-slate-500 mb-8">
        {ROLE_LABELS[u.role as keyof typeof ROLE_LABELS]?.[ar ? 'ar' : 'en']} · {DEPARTMENT_LABELS[u.department as keyof typeof DEPARTMENT_LABELS]?.[ar ? 'ar' : 'en'] || u.department}
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="text-3xl font-extrabold text-indigo-600">{c.value}</div>
            <div className="text-sm text-slate-500 mt-1">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">
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
                <td className="py-2.5">{ROLE_LABELS[x.role as keyof typeof ROLE_LABELS]?.[ar ? 'ar' : 'en'] || x.role}</td>
                <td className="py-2.5">{DEPARTMENT_LABELS[x.department as keyof typeof DEPARTMENT_LABELS]?.[ar ? 'ar' : 'en'] || x.department}</td>
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
