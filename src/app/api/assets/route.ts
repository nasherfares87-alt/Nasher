import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, can } from '@/lib/auth';

export async function POST(req: Request) {
  const me = await getSessionUser();
  const { type, prompt } = await req.json();
  const perm = type === 'video' ? 'ai.video' : 'ai.design';
  if (!can(me, perm)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  if (!prompt || !String(prompt).trim()) return NextResponse.json({ error: 'empty prompt' }, { status: 400 });

  const id = (type === 'video' ? 'vid_' : 'dsn_') + Math.random().toString(36).slice(2, 10);
  const resultUrl = type === 'video'
    ? null
    : `https://placehold.co/600x600/1e1b4b/a5b4fc?text=AI+Design+${Math.ceil(Math.random() * 4)}`;

  const asset = await prisma.asset.create({
    data: { id, type, prompt: String(prompt).slice(0, 500), resultUrl, status: type === 'video' ? 'queued' : 'done', userId: me!.id },
  });

  return NextResponse.json({ id: asset.id, url: resultUrl, status: asset.status });
}

export async function GET(req: Request) {
  const me = await getSessionUser();
  const url = new URL(req.url);
  const type = url.searchParams.get('type');
  const assets = await prisma.asset.findMany({
    where: { userId: me?.id, ...(type ? { type } : {}) },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json({
    assets: assets.map((a) => ({ id: a.id, type: a.type, prompt: a.prompt, url: a.resultUrl, status: a.status, createdAt: a.createdAt })),
  });
}
