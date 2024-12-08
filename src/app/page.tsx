'use client';

import { useEffect, useState } from 'react';
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

  if (!mounted) return null;

  return (
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
  );
}
