'use client';

import { Suspense, useEffect } from 'react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { AssessmentConfig } from '@/types/assessment';
import { Typewriter } from '@/components/ui/typewriter';
import ReactMarkdown from 'react-markdown';

// 完善类型定义
type AnalysisResult = {
  score: number;
  compatibility: string;
  suggestions: string[];
  aiAnalysis: string;
};

type ResultData = {
  config: AssessmentConfig;
  answers: Record<number, number>;
  aiAnalysis: string;
  score: number;
  compatibility: string;
  suggestions: string[];
};

// 添加数据验证函数
function validateResultData(data: unknown): data is ResultData {
  const maybeResult = data as Partial<ResultData>;
  
  // 检查config和participantInfo的存在性
  if (!maybeResult.config || !maybeResult.config.participantInfo) {
    return false;
  }

  // 验证所有必需字段
  return (
    typeof maybeResult === 'object' &&
    maybeResult !== null &&
    typeof maybeResult.config.participantInfo.name === 'string' &&
    typeof maybeResult.config.participantInfo.age === 'number' &&
    typeof maybeResult.score === 'number' &&
    maybeResult.score >= 0 &&
    maybeResult.score <= 100 &&
    typeof maybeResult.compatibility === 'string' &&
    Array.isArray(maybeResult.suggestions) &&
    maybeResult.suggestions.every((s: unknown) => typeof s === 'string') &&
    typeof maybeResult.aiAnalysis === 'string'
  );
}

// 分离使用 useSearchParams 的内容组件
function ResultContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const dataParam = searchParams.get('data');
        if (!dataParam) {
          throw new Error('未找到测评数据');
        }

        let parsedData;
        try {
          parsedData = JSON.parse(decodeURIComponent(dataParam));
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error('测评数据格式错误');
        }

        // 验证数据格式
        if (!validateResultData(parsedData)) {
          console.error('Invalid Data Format:', parsedData);
          throw new Error('测评数据不完整或格式错误');
        }

        setData(parsedData);
        setResult({
          score: parsedData.score,
          compatibility: parsedData.compatibility,
          suggestions: parsedData.suggestions,
          aiAnalysis: parsedData.aiAnalysis
        });
        setError(null);
      } catch (e) {
        console.error('Result Error:', e);
        setError(e instanceof Error ? e.message : '处理结果时出错');
      } finally {
        setLoading(false);
      }
    };

    loadResult();
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

  if (loading || !result || !data) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full space-y-8 text-center">
      <h1 className="text-3xl font-bold">测评结果</h1>
      
      {/* User Info */}
      <div className="bg-secondary p-4 rounded-lg text-sm text-foreground/60">
        <p>{data.config.participantInfo.name} | {data.config.participantInfo.age}岁 | {data.config.mode === 'single' ? '单人测评' : '双人测评'}</p>
      </div>
      
      {/* Score Display */}
      <div className="relative w-32 h-32 mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">{result.score}</span>
        </div>
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeDasharray={`${result.score}, 100`}
          />
        </svg>
      </div>

      {/* Compatibility */}
      <div className="bg-secondary p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">契合度评价</h2>
        <p className="text-xl text-primary">{result.compatibility}</p>
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">改善建议</h2>
        <ul className="space-y-2">
          {result.suggestions.map((suggestion, index) => (
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
      {result.aiAnalysis && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">AI深度分析</h2>
          <div className="p-8 bg-secondary rounded-lg text-left">
            <Typewriter 
              text={result.aiAnalysis}
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
    <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <ResultContent />
      </Suspense>
    </main>
  );
} 