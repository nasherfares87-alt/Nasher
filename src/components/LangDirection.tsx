'use client';

import { useEffect } from 'react';
import { useApp } from '@/store/useApp';

export default function LangDirection() {
  const lang = useApp((s) => s.lang);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);
  return null;
}
