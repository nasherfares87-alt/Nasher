'use client';

import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { sendChat } from '@/lib/mockClient';

interface Msg { role: 'user' | 'assistant'; content: string }

export default function ChatPage() {
  const s = useApp();
  const t = dict[s.lang];
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...msgs, { role: 'user' as const, content: text }];
    setMsgs(next);
    setInput('');
    setLoading(true);
    const reply = await sendChat(next, s.lang);
    setMsgs((m) => [...m, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-2">🤖 {t.aiChat}</h1>
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 inline-block mb-4">{t.mockNotice}</p>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-[65vh] p-4">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-slate-400 text-sm px-2">…</div>}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={t.sendPrompt}
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 focus:border-indigo-500 focus:outline-none"
          />
          <button onClick={send} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 rounded-xl">
            {t.send}
          </button>
        </div>
      </div>
    </Shell>
  );
}
