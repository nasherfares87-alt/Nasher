import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-in-production');
const COOKIE = 'nashir_session';
const DAY = 60 * 60 * 24;

export interface SessionUser {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  role: string;
  department: string;
  permissions: string[];
  active: boolean;
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(SECRET);
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DAY,
    path: '/',
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET);
    const id = payload.sub as string;
    const u = await prisma.user.findUnique({ where: { id } });
    if (!u || !u.active) return null;
    return {
      id: u.id,
      name: u.name,
      nameEn: u.nameEn,
      email: u.email,
      role: u.role,
      department: u.department,
      permissions: JSON.parse(u.permissions),
      active: u.active,
    };
  } catch {
    return null;
  }
}

export function can(user: SessionUser | null, perm: string): boolean {
  if (!user) return false;
  if (user.role === 'SUPERADMIN') return true;
  return user.permissions.includes(perm);
}
