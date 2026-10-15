import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser, can } from '@/lib/auth';

export async function POST(req: Request) {
  const me = await getSessionUser();
  if (!can(me, 'ai.chat')) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const { messages, lang } = await req.json();
  const last = messages[messages.length - 1]?.content || '';
  const ar = lang === 'ar';
  const isPlan = /خطة|خطة|plan|استراتيج|strategy|جدول/i.test(last);

  const reply = isPlan
    ? (ar
      ? '📝 مقترح خطة أولية:\n\n1. التحليل وجمع المتطلبات (أسبوع 1)\n2. الإعداد والتخطيط التفصيلي (أسبوع 2)\n3. التنفيذ والتصميم/الإنتاج (أسابيع 3-5)\n4. المراجعة والاختبار (أسبوع 6)\n5. الإطلاق والقياس (أسبوع 7)\n\nهذه خطة تجريبية — عند ربط نموذج ذكاء اصطناعي حقيقي ستُبنى من بياناتكم الفعلية.'
      : '📝 Draft plan:\n\n1. Analysis & requirements (Week 1)\n2. Detailed planning (Week 2)\n3. Execution & production (Weeks 3-5)\n4. Review & testing (Week 6)\n5. Launch & measurement (Week 7)\n\nMock draft — a real AI model will build it from your actual data.')
    : (ar
      ? `شكراً لسؤالك — أنا المساعد التجريبي لمنصة ناشر. طلبك: «${last.slice(0, 120)}». عند ربط مزود الذكاء الاصطناعي الفعلي سأتمكن من تحليل بيانات الشركة وإعداد الخطط الحقيقية.`
      : `Thanks! I'm the Nashir demo assistant. Your request: "${last.slice(0, 120)}". Once a real AI provider is connected I'll analyze company data and prepare real plans.`);

  await prisma.chatLog.create({ data: { role: 'user', content: String(last).slice(0, 2000), userId: me!.id } });
  await prisma.chatLog.create({ data: { role: 'assistant', content: reply.slice(0, 2000), userId: me!.id } });

  return NextResponse.json({ reply });
}
