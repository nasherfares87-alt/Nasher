import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';
import LangDirection from '@/components/LangDirection';

export const metadata: Metadata = {
  title: 'ناشر | Nashir AI Platform',
  description: 'منصة الذكاء الاصطناعي لموظفي ناشر — تصميم، فيديو، ومساعد ذكي',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased">
        <Providers><LangDirection />{children}</Providers>
      </body>
    </html>
  );
}
