import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSessionUser, can } from '@/lib/auth';

const VALID_ROLES = ['ADMIN', 'EMPLOYEE'];
const VALID_DEPTS = ['PRODUCTION', 'PROJECT_MANAGEMENT', 'IT', 'DESIGN', 'MARKETING', 'HR', 'FINANCE', 'BUSINESS_DEVELOPMENT'];
const VALID_PERMS = ['ai.design', 'ai.video', 'ai.chat', 'users.manage', 'users.create', 'reports.view', 'plans.generate', 'assets.download'];

function bad(msg: string, code = 400) {
  return NextResponse.json({ error: msg }, { status: code });
}

export async function GET() {
  const me = await getSessionUser();
  if (!can(me, 'users.manage') && !can(me, 'users.create')) return bad('forbidden', 403);

  const users = me?.role === 'SUPERADMIN'
    ? await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })
    : await prisma.user.findMany({ where: { department: me!.department }, orderBy: { createdAt: 'asc' } });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id, name: u.name, nameEn: u.nameEn, email: u.email, role: u.role,
      department: u.department, permissions: JSON.parse(u.permissions), active: u.active,
      createdAt: u.createdAt.toISOString().slice(0, 10),
    })),
  });
}

export async function POST(req: Request) {
  const me = await getSessionUser();
  if (!can(me, 'users.create')) return bad('forbidden', 403);

  const body = await req.json();
  const name = (body.name || '').trim();
  const nameEn = (body.nameEn || '').trim();
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const role = me!.role === 'SUPERADMIN' && VALID_ROLES.includes(body.role) ? body.role : 'EMPLOYEE';
  const department = me!.role === 'SUPERADMIN' && VALID_DEPTS.includes(body.department) ? body.department : me!.department;
  const permissions = Array.isArray(body.permissions) ? body.permissions.filter((p: string) => VALID_PERMS.includes(p)) : [];

  if (!name || !nameEn || !email || password.length < 6) {
    return bad('معلومات ناقصة أو كلمة مرور أقل من 6 أحرف / Missing fields or password shorter than 6 chars');
  }
  if (await prisma.user.findUnique({ where: { email } })) {
    return bad('البريد مستخدم مسبقاً / Email already exists', 409);
  }

  const user = await prisma.user.create({
    data: {
      name, nameEn, email,
      passwordHash: await bcrypt.hash(password, 10),
      role, department,
      permissions: JSON.stringify(permissions),
    },
  });
  return NextResponse.json({ ok: true, id: user.id });
}

export async function PATCH(req: Request) {
  const me = await getSessionUser();
  if (!can(me, 'users.manage') && !can(me, 'users.create')) return bad('forbidden', 403);

  const body = await req.json();
  const target = await prisma.user.findUnique({ where: { id: body.id } });
  if (!target) return bad('not found', 404);
  if (me!.role !== 'SUPERADMIN') {
    if (target.department !== me!.department || target.role === 'SUPERADMIN') return bad('forbidden', 403);
  }

  const patch: Record<string, unknown> = {};
  if (typeof body.active === 'boolean' && !(target.role === 'SUPERADMIN' && body.active === false)) patch.active = body.active;
  if (Array.isArray(body.permissions)) patch.permissions = JSON.stringify(body.permissions.filter((p: string) => VALID_PERMS.includes(p)));
  if (body.name) patch.name = String(body.name).trim();
  if (body.nameEn) patch.nameEn = String(body.nameEn).trim();
  if (body.password && String(body.password).length >= 6) patch.passwordHash = await bcrypt.hash(String(body.password), 10);
  if (me!.role === 'SUPERADMIN') {
    if (body.role && VALID_ROLES.includes(body.role) && target.role !== 'SUPERADMIN') patch.role = body.role;
    if (body.department && VALID_DEPTS.includes(body.department) && target.role !== 'SUPERADMIN') patch.department = body.department;
  }

  await prisma.user.update({ where: { id: target.id }, data: patch });
  return NextResponse.json({ ok: true });
}
