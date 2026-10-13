import { NextResponse } from 'next/server';

interface Msg { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const { messages, lang } = (await req.json()) as { messages: Msg[]; lang: 'ar' | 'en' };
  const last = messages[messages.length - 1]?.content || '';

  const isPlan = /خطة|خطة|plan|استراتيج|strategy|جدول|schedule/i.test(last);
  const ar = lang === 'ar';

  let reply: string;
  if (isPlan) {
    reply = ar
      ? `📝 مقترح خطة أولية بناءً على طلبك:\n\n1. التحليل وجمع المتطلبات (أسبوع 1)\n2. الإعداد والتخطيط التفصيلي (أسبوع 2)\n3. التنفيذ والتصميم/الإنتاج (أسابيع 3-5)\n4. المراجعة والاختبار (أسبوع 6)\n5. الإطلاق والقياس (أسبوع 7)\n\nهذه خطة تجريبية من طبقة الـ Mock. عند ربط نموذج ذكاء اصطناعي حقيقي، ستُبنى الخطة من بيانات منشور ناشر الفعلية.`
      : `📝 Draft plan based on your request:\n\n1. Analysis & requirements gathering (Week 1)\n2. Detailed planning (Week 2)\n3. Execution & design/production (Weeks 3-5)\n4. Review & testing (Week 6)\n5. Launch & measurement (Week 7)\n\nThis is a mock draft. Once a real AI model is connected, the plan will be built from Nashir's actual published data.`;
  } else {
    reply = ar
      ? `شكراً لسؤالك. أنا حالياً مساعد تجريبي (Mock) لمنصة ناشر. بعد ربط نموذج الذكاء الاصطناعي الفعلي (مثل OpenAI أو Gemini أو نموذج داخلي)، سأتمكن من تحليل بيانات الشركة، جمع المتطلبات، وإعداد الخطط والمحتوى الحقيقي.\n\nطلبك: «${last.slice(0, 120)}»`
      : `Thanks for your question. I'm currently a mock assistant for the Nashir platform. Once the real AI model is connected (e.g., OpenAI, Gemini, or an in-house model), I'll be able to analyze company data, gather requirements, and prepare real plans and content.\n\nYour request: "${last.slice(0, 120)}"`;
  }

  return NextResponse.json({ reply, note: 'Mock mode' });
}
