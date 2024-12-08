import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { AssessmentConfig } from '@/types/assessment';
import { Question } from '@/data/questions';
import { config } from '@/lib/config';

const client = new OpenAI({
  apiKey: config.deepseekApiKey,
  baseURL: config.deepseekBaseUrl,
  dangerouslyAllowBrowser: true
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { config } = await request.json() as {
      config: AssessmentConfig;
    };

    const messages: ChatMessage[] = [{
      role: 'system',
      content: `你是一个专业的情感测评系统，需要根据用户信息生成个性化的测评问题。请以JSON格式返回问题列表。

      用户信息：
      - 模式：${config.mode === 'single' ? '单人测评' : '双人测评'}
      - 年龄：${config.participantInfo.age}岁
      ${config.mode === 'couple' ? `- 恋爱时长：${config.participantInfo.relationshipDuration}个月` : ''}

      示例JSON格式：
      {
        "questions": [
          {
            "id": 1,
            "question": "问题文本",
            "category": "性格",
            "options": [
              { "value": 1, "text": "选项1" },
              { "value": 2, "text": "选项2" },
              { "value": 3, "text": "选项3" },
              { "value": 4, "text": "选项4" }
            ],
            "coupleOnly": false
          }
        ]
      }

      要求：
      1. 问题数量：
         - 通用问题：6题
         - 双人专属问题：3题（仅在双人模式时使用）
      
      2. 问题类型分布：
         - 性格相关：了解性格特征、行为模式
         - 价值观相关：了解人生观、恋爱观
         - 生活习惯相关：了解日常生活偏好
      
      3. 内容要求：
         - 措辞要温和专业
         - 选项要有明显区分度
         - 选项按价值递增排序(1-4)
         - 避免敏感或负面话题

      请确保返回的是合法的JSON格式。`
    }, {
      role: 'user',
      content: '请生成测评问题'
    }];

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.8,
      max_tokens: 2000,
      response_format: {
        type: 'json_object'
      }
    });

    const questionsText = response.choices[0].message?.content;
    if (!questionsText) {
      throw new Error('未能生成问题');
    }

    try {
      const data = JSON.parse(questionsText);
      const questions = data.questions as Question[];

      // 验证问题格式
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('问题格式错误');
      }

      // 验证每个问题的结构
      questions.forEach(q => {
        if (!q.id || !q.question || !q.category || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error('问题结构错误');
        }
      });

      return NextResponse.json({ questions });
    } catch (parseError) {
      console.error('Questions Parse Error:', parseError, questionsText);
      return NextResponse.json(
        { error: '问题格式错误，请重试' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Questions Generation Error:', error);
    return NextResponse.json(
      { error: '生成问题失败，请重试' },
      { status: 500 }
    );
  }
} 