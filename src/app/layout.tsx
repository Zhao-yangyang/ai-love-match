import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'AI Love Match',
  description: '智能情侣契合度测评系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
