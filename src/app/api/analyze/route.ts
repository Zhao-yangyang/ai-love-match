import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { AssessmentConfig } from '@/types/assessment';
import { config } from '@/lib/config';

const client = new OpenAI({
  apiKey: config.deepseekApiKey,
  baseURL: config.deepseekBaseUrl,
  dangerouslyAllowBrowser: true
});

// 定义OpenAI API所需的消息类型
type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
};

export async function POST(request: Request) {
  try {
    const { config, answers } = await request.json() as {
      config: AssessmentConfig;
      answers: Record<number, number>;
    };

    const messages: ChatMessage[] = [{
      role: 'system',
      content: `你是一个专业的情感分析师，专注于${config.mode === 'single' ? '个人情感能力' : '情侣关系'}分析。
      
      ${config.mode === 'couple' ? `
      情侣信息：
      - 恋爱时长：${config.participantInfo.relationshipDuration}个月
      - 年龄：${config.participantInfo.age}岁
      - 姓名：${config.participantInfo.name}
      ` : `
      个人信息：
      - 年龄：${config.participantInfo.age}岁
      - 姓名：${config.participantInfo.name}
      `}

      基于用户的答案：${JSON.stringify(answers)}

      请提供以下格式的JSON响应：
      {
        "analysis": "markdown格式的详细分析",
        "score": 0-100的整数分数,
        "compatibility": "契合度评价文本",
        "suggestions": ["建议1", "建议2", "建议3"]
      }

      分析要求：
      1. analysis部分：
         - 使用markdown格式
         - 包含二级标题(##)
         - 使用加粗标记重点
         - 使用列表和引用
         - 500-800字

      2. score部分：
         - 根据答案计算总分
         - 考虑所有维度
         - 转换为0-100分制

      3. compatibility部分：
         - 根据分数给出评价
         - 措辞积极温和
         - 突出优点和潜力

      4. suggestions部分：
         - 3-5条具体建议
         - 可操作性强
         - 针对性强
         - 积极向上

      请确保返回合法的JSON格式。`
    }];

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const data = JSON.parse(response.choices[0].message?.content || '{}');
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'AI分析服务暂时不可用，请稍后再试' },
      { status: 500 }
    );
  }
} 