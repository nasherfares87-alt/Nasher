export interface DesignResult { id: string; url: string }
export interface VideoResult { id: string; status: string }

const rid = (p: string) => p + '_' + Math.random().toString(36).slice(2, 10);

export async function generateDesign(prompt: string): Promise<DesignResult> {
  try {
    const res = await fetch('/api/mock/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return {
    id: rid('dsn'),
    url: `https://placehold.co/600x600/1e1b4b/a5b4fc?text=AI+Design+${Math.ceil(Math.random() * 4)}`,
  };
}

export async function generateVideo(prompt: string): Promise<VideoResult> {
  try {
    const res = await fetch('/api/mock/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) return await res.json();
  } catch {}
  return { id: rid('vid'), status: 'queued' };
}

export async function sendChat(messages: { role: string; content: string }[], lang: string): Promise<string> {
  try {
    const res = await fetch('/api/mock/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, lang }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch {}
  const last = messages[messages.length - 1]?.content || '';
  const ar = lang === 'ar';
  const isPlan = /خطة|خطة|plan|استراتيج|strategy|جدول/i.test(last);
  if (isPlan) {
    return ar
      ? '📝 مقترح خطة أولية:\n\n1. التحليل وجمع المتطلبات (أسبوع 1)\n2. الإعداد والتخطيط التفصيلي (أسبوع 2)\n3. التنفيذ والتصميم/الإنتاج (أسابيع 3-5)\n4. المراجعة والاختبار (أسبوع 6)\n5. الإطلاق والقياس (أسبوع 7)'
      : '📝 Draft plan:\n\n1. Analysis & requirements (Week 1)\n2. Detailed planning (Week 2)\n3. Execution & production (Weeks 3-5)\n4. Review & testing (Week 6)\n5. Launch & measurement (Week 7)';
  }
  return ar
    ? `شكراً لسؤالك — أنا المساعد التجريبي لمنصة ناشر (وضع العرض الثابت). طلبك: «${last.slice(0, 120)}»`
    : `Thanks! I'm the Nashir demo assistant (static demo mode). Your request: "${last.slice(0, 120)}"`;
}
