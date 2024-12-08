'use client';

import { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { AssessmentConfig } from '@/types/assessment';
import { Typewriter } from '@/components/ui/typewriter';
import ReactMarkdown from 'react-markdown';

type AnalysisResult = {
  score: number;
  compatibility: string;
  suggestions: string[];
};

type ResultData = {
  config: AssessmentConfig;
  answers: Record<number, number>;
  aiAnalysis: string;
  score: number;
  compatibility: string;
  suggestions: string[];
};

// 分离使用 useSearchParams 的内容组件
function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResultData | null>(null);

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      if (!dataParam) {
        throw new Error('未找到测评数据');
      }
      
      const parsedData = JSON.parse(decodeURIComponent(dataParam)) as ResultData;
      
      // 检查必要字段
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('数据格式错误');
      }

      // 分别检查每个必要字段
      if (!parsedData.config) {
        throw new Error('缺少配置信息');
      }
      if (!parsedData.answers || Object.keys(parsedData.answers).length === 0) {
        throw new Error('缺少答案数据');
      }
      if (typeof parsedData.score !== 'number') {
        throw new Error('缺少分数数据');
      }
      if (!parsedData.compatibility) {
        throw new Error('缺少契合度评价');
      }
      if (!Array.isArray(parsedData.suggestions)) {
        throw new Error('缺少改善建议');
      }
      if (!parsedData.aiAnalysis) {
        throw new Error('缺少AI分析结果');
      }

      setData(parsedData);
      setResult({
        score: parsedData.score,
        compatibility: parsedData.compatibility,
        suggestions: parsedData.suggestions
      });
      setError(null);
    } catch (e) {
      console.error('Result Error:', e);
      setError(e instanceof Error ? e.message : '处理结果时出错');
    }
  }, [searchParams]);

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        retry={() => window.location.href = '/'}
        retryText="返回首页"
      />
    );
  }

  if (!result) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full space-y-8 text-center">
      <h1 className="text-3xl font-bold">测评结果</h1>
      
      {/* User Info */}
      {data && (
        <div className="bg-secondary p-4 rounded-lg text-sm text-foreground/60">
          <p>{data.config.participantInfo.name} | {data.config.participantInfo.age}岁 | {data.config.mode === 'single' ? '单人测评' : '双人测评'}</p>
        </div>
      )}
      
      {/* Score Display */}
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">{result?.score}</span>
        </div>
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray={`${result?.score}, 100`}
          />
        </svg>
      </div>

      {/* Compatibility */}
      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">契合度评价</h2>
        <p className="text-xl text-primary">{result?.compatibility}</p>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">改善建议</h2>
        <ul className="space-y-2">
          {result?.suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-4 bg-secondary rounded-lg text-left"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* AI Analysis */}
      {data?.aiAnalysis && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AI深度分析</h2>
          <div className="p-8 bg-secondary rounded-lg text-left">
            <Typewriter 
              text={data.aiAnalysis}
              speed={30}
              className="prose dark:prose-invert max-w-none 
                prose-headings:text-foreground 
                prose-p:text-foreground/90 
                prose-strong:text-foreground 
                prose-ul:text-foreground/90
                prose-li:text-foreground/90
                prose-blockquote:text-foreground/80 
                prose-blockquote:border-l-primary
                prose-headings:mt-4 
                prose-p:my-2 
                prose-blockquote:my-2"
              renderText={(text) => (
                <ReactMarkdown>
                  {text}
                </ReactMarkdown>
              )}
            />
          </div>
        </div>
      )}

      {/* Return Button */}
      <Link
        href="/"
        className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-primary-foreground bg-primary rounded-full hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}

// 主页面组件
export default function Result() {
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
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        <Suspense fallback={
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        }>
          <ResultContent />
        </Suspense>
      </main>
    </div>
  );
} 