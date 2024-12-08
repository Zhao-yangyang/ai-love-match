'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ErrorMessage } from '@/components/ui/error-message';
import { AssessmentConfig } from '@/types/assessment';
import { LoadingSpinner } from '@/components/ui/loading';
import { Question } from '@/data/questions';

export default function Test() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<AssessmentConfig | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 获取并解析配置信息
  useEffect(() => {
    try {
      const configStr = searchParams.get('config');
      if (!configStr) {
        throw new Error('缺少测评配置信息');
      }
      const parsedConfig = JSON.parse(decodeURIComponent(configStr)) as AssessmentConfig;
      setConfig(parsedConfig);
    } catch {
      setError('配置信息无效，请重新开始测评');
    }
  }, [searchParams]);

  // 获取问题
  useEffect(() => {
    if (config) {
      setIsLoading(true);
      fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            throw new Error(data.error);
          }
          setQuestions(data.questions);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load questions:', error);
          setError('加载问题失败，请重试');
          setIsLoading(false);
        });
    }
  }, [config]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = async (value: number) => {
    try {
      const newAnswers = {
        ...answers,
        [currentQuestion.id]: value
      };
      setAnswers(newAnswers);
      setSelectedAnswers(newAnswers);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // 最后一题完成时，调用AI分析
        if (config) {
          setIsAnalyzing(true);
          try {
            const response = await fetch('/api/analyze', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                config,
                answers: newAnswers
              }),
            });

            if (!response.ok) {
              throw new Error('分析请求失败');
            }

            const data = await response.json();
            if (data.error) {
              throw new Error(data.error);
            }

            if (!data.analysis) {
              throw new Error('未获取到分析结果');
            }

            // 确保所有必要数据都存在
            const resultData = {
              config,
              answers: newAnswers,
              aiAnalysis: data.analysis,
              score: data.score,
              compatibility: data.compatibility,
              suggestions: data.suggestions
            };

            // 验证数据完整性
            if (!resultData.config || !resultData.answers || !resultData.aiAnalysis) {
              throw new Error('结果数据不完整');
            }

            router.push(`/result?data=${encodeURIComponent(JSON.stringify(resultData))}`);
          } catch (error) {
            console.error('AI Analysis Error:', error);
            setError('AI分析服务暂时不可用，请重试');
          } finally {
            setIsAnalyzing(false);
          }
        }
      }
    } catch {
      setError('保存答案时出错，请重试');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/heart.svg" alt="Logo" width={32} height={32} className="text-primary" />
            <span className="text-xl font-semibold">AI Love Match</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <ErrorMessage 
            message={error}
            retry={() => setError(null)}
          />
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/heart.svg" alt="Logo" width={32} height={32} className="text-primary" />
            <span className="text-xl font-semibold">AI Love Match</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner />
            <p className="text-foreground/60">
              正在生成个性化问题...
            </p>
          </div>
        </main>
      </div>
    );
  }

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
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full relative">
        {/* 加载状态遮罩 */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <LoadingSpinner />
              <p className="text-foreground/60">
                正在进行AI分析，请稍候...
                <br />
                <span className="text-sm">
                  这可能需要10-20秒的时间
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-8">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question */}
        <div className="w-full space-y-8">
          <div className="text-center">
            <span className="text-sm text-foreground/60">
              {currentQuestion.category} - 问题 {currentQuestionIndex + 1}/{questions.length}
            </span>
            <h2 className="text-2xl font-semibold mt-2">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={isAnalyzing}
                className={`p-6 text-left rounded-lg transition-colors w-full text-lg ${
                  selectedAnswers[currentQuestion.id] === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80'
                } ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {option.text}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 text-foreground/60 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一题
            </button>
            <span className="text-sm text-foreground/60">
              {currentQuestionIndex + 1} / {questions.length}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
} 