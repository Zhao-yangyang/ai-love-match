'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { InfoForm } from '@/components/assessment/info-form';
import { AssessmentConfig, AssessmentMode, AssessmentType } from '@/types/assessment';
import { LoadingSpinner } from '@/components/ui/loading';

// 分离出使用 useSearchParams 的组件
function InfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') as AssessmentMode;
  const type = searchParams.get('type') as AssessmentType;

  if (!mode || !type) {
    router.push('/');
    return null;
  }

  const handleSubmit = (config: AssessmentConfig) => {
    const configStr = encodeURIComponent(JSON.stringify(config));
    router.push(`/test?config=${configStr}`);
  };

  return <InfoForm mode={mode} type={type} onSubmit={handleSubmit} />;
}

// 主页面组件
export default function Info() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <InfoContent />
      </Suspense>
    </main>
  );
} 