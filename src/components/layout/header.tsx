'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header() {
  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Image 
              src="/heart.svg" 
              alt="Logo" 
              width={24} 
              height={24} 
              className="text-white dark:text-white" 
            />
          </div>
          <span className="text-xl font-semibold text-foreground">AI Love Match</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
} 