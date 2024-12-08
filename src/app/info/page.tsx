'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { InfoForm } from '@/components/assessment/info-form';
import { AssessmentConfig, AssessmentMode, AssessmentType } from '@/types/assessment';

export default function Info() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as AssessmentMode;
  const type = searchParams.get('type') as AssessmentType;

  if (!mode || !type) {
    router.push('/');
    return null;
  }

  const handleSubmit = (config: AssessmentConfig) => {
    // 将配置信息序列化并传递到测评页面
    const configStr = encodeURIComponent(JSON.stringify(config));
    router.push(`/test?config=${configStr}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Image src="/heart.svg" alt="Logo" width={32} height={32} className="text-primary" />
          <span className="text-xl font-semibold">AI Love Match</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <InfoForm mode={mode} type={type} onSubmit={handleSubmit} />
      </main>
    </div>
  );
} 