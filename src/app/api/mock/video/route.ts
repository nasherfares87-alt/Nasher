import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();
  return NextResponse.json({
    id: 'vid_' + Math.random().toString(36).slice(2, 10),
    status: 'queued',
    prompt,
    note: 'Mock response — connect a real video provider (e.g., Runway, Pika, Sora API) here.',
    estimatedSeconds: 120,
  });
}
