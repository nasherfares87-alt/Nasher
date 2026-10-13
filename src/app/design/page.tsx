'use client';

import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';

export default function DesignPage() {
  const s = useApp();
  const t = dict[s.lang];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ id: string; url: string; prompt: string }[]>([]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const res = await fetch('/api/mock/design', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    setResults((r) => [{ id: data.id, url: data.url, prompt }, ...r]);
    setLoading(false);
    setPrompt('');
  };

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-2">🎨 {t.designStudio}</h1>
      <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-2 inline-block mb-6">{t.mockNotice}</p>
      <div className="flex gap-2 mb-8">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.newPrompt}
          rows={3}
          className="flex-1 rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:outline-none resize-none"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="self-start bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 rounded-xl transition"
        >
          {loading ? t.generating : t.generate}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {results.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={r.url} alt={r.prompt} className="w-full aspect-square object-cover" />
            <div className="p-3">
              <p className="text-xs text-slate-600 line-clamp-2 mb-2">{r.prompt}</p>
              <a href={r.url} download className="text-xs font-semibold text-indigo-600 hover:underline">↓ {t.download}</a>
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
