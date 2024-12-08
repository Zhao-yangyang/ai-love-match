'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ModeSelection } from '@/components/assessment/mode-selection';
import { AssessmentMode, AssessmentType } from '@/types/assessment';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeSelect = (mode: AssessmentMode, type: AssessmentType) => {
    router.push(`/info?mode=${mode}&type=${type}`);
  };

  // 在客户端渲染之前返回一个加载状态
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Image src="/heart.svg" alt="Logo" width={32} height={32} className="text-primary" />
          <span className="text-xl font-semibold">AI Love Match</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-4xl w-full space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">
              探索你们的爱情契合度
            </h1>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              通过AI智能分析，了解你们的关系匹配程度，获得专业的建议指导
            </p>
          </div>

          {/* Mode Selection */}
          <ModeSelection onSelect={handleModeSelect} />
        </div>
      </main>
    </div>
  );
}
