'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading';
import { ErrorMessage } from '@/components/ui/error-message';
import { AssessmentConfig } from '@/types/assessment';
import { Question } from '@/data/questions';

// 分离使用 useSearchParams 的内容组件
function TestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async (retryCount = 0) => {
      try {
        setLoading(true);
        const configParam = searchParams.get('config');
        if (!configParam) {
          throw new Error('未找到配置信息');
        }

        const config = JSON.parse(decodeURIComponent(configParam)) as AssessmentConfig;
        const response = await fetch('/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '获取问题失败');
        }

        const data = await response.json();
        setQuestions(data.questions);
        setLoading(false);
      } catch (e) {
        console.error('Questions Error:', e);
        if (retryCount < 3) { // 最多重试3次
          console.log(`重试第 ${retryCount + 1} 次`);
          setTimeout(() => fetchQuestions(retryCount + 1), 2000); // 2秒后重试
        } else {
          setError(e instanceof Error ? e.message : '获取问题失败');
          setLoading(false);
        }
      }
    };

    fetchQuestions();
  }, [searchParams]);

  const handleAnswer = async (value: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 测评完成，发送分析请求
      try {
        setLoading(true);
        const configParam = searchParams.get('config');
        if (!configParam) {
          throw new Error('未找到配置信息');
        }

        const config = JSON.parse(decodeURIComponent(configParam)) as AssessmentConfig;
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config, answers: newAnswers })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || '分析结果失败');
        }

        const result = await response.json();
        const resultData = {
          config,
          answers: newAnswers,
          ...result
        };

        // 跳转到结果页面
        const resultDataStr = encodeURIComponent(JSON.stringify(resultData));
        router.push(`/result?data=${resultDataStr}`);
      } catch (e) {
        console.error('Analysis Error:', e);
        setError(e instanceof Error ? e.message : '分析结果时出错');
        setLoading(false);
      }
    }
  };

  if (error) {
    return (
      <ErrorMessage 
        message={error}
        retry={() => window.location.href = '/'}
        retryText="返回首页"
      />
    );
  }

  if (loading || questions.length === 0) {
    return <LoadingSpinner />;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Progress Bar */}
      <div className="w-full h-2 bg-secondary rounded-full mb-8">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            问题 {currentQuestionIndex + 1}/{questions.length}
          </h2>
          <p className="text-lg">{currentQuestion.question}</p>
        </div>

        {/* Options */}
        <div className="grid gap-4">
          {currentQuestion.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full p-4 text-left bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// 主页面组件
export default function Test() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6">
      <Suspense fallback={
        <div className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      }>
        <TestContent />
      </Suspense>
    </main>
  );
} 