'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          AI Love Match
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
} 