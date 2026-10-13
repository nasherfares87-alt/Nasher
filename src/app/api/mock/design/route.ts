import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const seed = encodeURIComponent(prompt.slice(0, 30) || 'nashir');
  const variants = [1, 2, 3, 4];
  const v = variants[Math.floor(Math.random() * variants.length)];
  return NextResponse.json({
    id: 'dsn_' + Math.random().toString(36).slice(2, 10),
    url: `https://placehold.co/600x600/1e1b4b/a5b4fc?text=AI+Design+${v}`,
    seed,
    note: 'Mock response — connect a real image provider (e.g., OpenAI Images, Stability, Ideogram) here.',
  });
}
