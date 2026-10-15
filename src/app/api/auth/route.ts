import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, getSessionUser } from '@/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({ where: { email: (email || '').trim().toLowerCase() } });
  if (!user || !user.active) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  const ok = await bcrypt.compare(password || '', user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'invalid' }, { status: 401 });
  }
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null }, { status: 401 });
  return NextResponse.json({ user });
}
