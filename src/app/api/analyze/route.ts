import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { config: assessmentConfig, answers } = await request.json();

    // 构建分析提示
    const prompt = `
你是一位专业的情感分析专家。请用中文分析以下测评结果：

测评模式：${assessmentConfig.mode === 'single' ? '单人测评' : '双人测评'}
参与者信息：${assessmentConfig.participantInfo.name}，${assessmentConfig.participantInfo.age}岁
答案数据：${JSON.stringify(answers)}

请提供以下分析结果（必须使用中文）：
1. 0-100的量化评分
2. 整体契合度评价（一句话）
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
      })
    });

    if (!response.ok) {
      throw new Error('API 请求失败');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Analysis Error:', error);
    return NextResponse.json(
      { error: '分析失败，请稍后重试' },
      { status: 500 }
    );
  }
} 