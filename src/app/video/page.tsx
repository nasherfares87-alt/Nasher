'use client';

import { useState } from 'react';
import Shell from '@/components/Shell';
import { useApp } from '@/store/useApp';
import { dict } from '@/lib/i18n';
import { generateVideo } from '@/lib/mockClient';

export default function VideoPage() {
  const s = useApp();
  const t = dict[s.lang];
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<{ id: string; prompt: string; status: string }[]>([]);

  const generate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const data = await generateVideo(prompt);
    setJobs((j) => [{ id: data.id, prompt, status: data.status }, ...j]);
    setLoading(false);
    setPrompt('');
  };

  return (
    <Shell>
      <h1 className="text-2xl font-bold mb-2">🎬 {t.videoStudio}</h1>
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
      <div className="space-y-3">
        {jobs.map((j) => (
          <div key={j.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{j.prompt}</p>
              <p className="text-xs text-slate-400 font-mono">{j.id}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700">{j.status}</span>
          </div>
        ))}
      </div>
    </Shell>
  );
}
