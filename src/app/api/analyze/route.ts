import { NextResponse } from 'next/server';
import { config } from '@/lib/config';
import type { AssessmentConfig } from '@/types/assessment';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

// 添加JSON清理函数
function sanitizeJsonString(str: string): string {
  // 移除可能导致JSON解析错误的字符
  return str
    .replace(/[\u0000-\u001F]+/g, '') // 移除控制字符
    .replace(/\\(?!["\\/bfnrtu])/g, '\\\\') // 处理反斜杠
    .replace(/[\u2028\u2029]/g, '\\n'); // 处理行分隔符
}

// 验证结果格式
function validateAnalysisResult(result: unknown): boolean {
  const maybeResult = result as Partial<{
    score: number;
    compatibility: string;
    suggestions: string[];
    aiAnalysis: string;
  }>;
  
  return (
    typeof maybeResult === 'object' &&
    maybeResult !== null &&
    typeof maybeResult.score === 'number' &&
    maybeResult.score >= 0 &&
    maybeResult.score <= 100 &&
    typeof maybeResult.compatibility === 'string' &&
    Array.isArray(maybeResult.suggestions) &&
    maybeResult.suggestions.every((s: unknown) => typeof s === 'string') &&
    typeof maybeResult.aiAnalysis === 'string'
  );
}

export async function POST(request: Request) {
  try {
    // 添加请求体验证
    if (!request.body) {
      return NextResponse.json(
        { error: '请求体不能为空' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // 验证请求数据
    if (!body.config || !body.answers) {
      return NextResponse.json(
        { error: '缺少必要的请求参数' },
        { status: 400 }
      );
    }

    const { config: assessmentConfig, answers } = body as {
      config: AssessmentConfig;
      answers: Record<number, number>;
    };

    // 修改超时时间为55秒，留出一些buffer时间
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    // 构建分析提示
    const prompt = `
你是一位专业的情感分析专家。请用中文分析以下测评结果：

测评模式：${assessmentConfig.mode === 'single' ? '单人测评' : '双人测评'}
参与者信息：${assessmentConfig.participantInfo.name}，${assessmentConfig.participantInfo.age}岁
答案数据：${JSON.stringify(answers)}

请提供以下分析结果（必须使用中文）：
1. 0-100的量化评分
2. 整体契��度评价（一句话）
3. 3-5条具体的改善建议
4. 详细的分析报告（使用markdown格式）

回复格式：
{
  "score": 数字,
  "compatibility": "契合度评价",
  "suggestions": ["建议1", "建议2", "建议3"],
  "aiAnalysis": "详细分析（markdown格式）"
}
`;

    try {
      // 调用 API
      const response = await fetch(config.deepseekBaseUrl + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.deepseekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的情感分析专家，请用中文回答所有问题。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('API返回数据格式错误');
      }

      // 使用sanitizeJsonString函数清理返回数据
      const cleanContent = sanitizeJsonString(data.choices[0].message.content);
      let result;
      
      try {
        result = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('API返回的JSON格式无效');
      }

      // 使用validateAnalysisResult函数验证结果
      if (!validateAnalysisResult(result)) {
        throw new Error('API返回数据不完整或格式错误');
      }

      return NextResponse.json(result);
    } catch (apiError: unknown) {
      console.error('API Error:', apiError);
      throw new Error(apiError instanceof Error ? apiError.message : 'API调用失败');
    }
  } catch (error: unknown) {
    console.error('Analysis Error:', error);
    
    // 根据错误类型返回不同的错误信息
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: '请求超时，请重试' },
          { status: 504 }
        );
      }
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
} 