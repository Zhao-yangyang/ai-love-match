import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { AssessmentConfig } from '@/types/assessment';
import { Question } from '@/data/questions';
import { config } from '@/lib/config';

// 初始化 OpenAI 客户端
const client = new OpenAI({
  apiKey: config.deepseekApiKey,
  baseURL: config.deepseekBaseUrl,
  dangerouslyAllowBrowser: true
});

type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
};

export const runtime = 'edge';
export const preferredRegion = 'iad1';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  // 检查环境变量
  if (!config.deepseekApiKey) {
    console.error('Missing DEEPSEEK_API_KEY');
    return NextResponse.json(
      { error: 'API configuration error' },
      { status: 500 }
    );
  }

  try {
    const { config: assessmentConfig } = await request.json() as {
      config: AssessmentConfig;
    };

    const messages: ChatMessage[] = [{
      role: 'system',
      content: `You are a professional relationship assessment system. Please generate personalized questions based on user information.

User Info:
- Mode: ${assessmentConfig.mode === 'single' ? 'Individual' : 'Couple'}
- Age: ${assessmentConfig.participantInfo.age}
${assessmentConfig.mode === 'couple' ? `- Relationship Duration: ${assessmentConfig.participantInfo.relationshipDuration} months` : ''}

Please return questions in the following JSON format:
{
  "questions": [
    {
      "id": number,
      "question": "Question text",
      "category": "Category",
      "options": [
        { "value": 1, "text": "Option 1" },
        { "value": 2, "text": "Option 2" },
        { "value": 3, "text": "Option 3" },
        { "value": 4, "text": "Option 4" }
      ],
      "coupleOnly": boolean
    }
  ]
}

Requirements:
1. Question Count:
   - General Questions: 6
   - Couple-specific Questions: 3 (only for couple mode)

2. Question Categories:
   - Personality
   - Values
   - Lifestyle

3. Content Guidelines:
   - Professional tone
   - Clear distinctions between options
   - Options ordered by value (1-4)
   - Avoid sensitive topics

Please ensure valid JSON format.`
    }, {
      role: 'user',
      content: 'Please generate assessment questions'
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
      return NextResponse.json(
        { error: 'No questions generated' },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(questionsText);
      const questions = data.questions as Question[];

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid question format');
      }

      questions.forEach(q => {
        if (!q.id || !q.question || !q.category || !Array.isArray(q.options) || q.options.length !== 4) {
          throw new Error('Invalid question structure');
        }
      });

      return NextResponse.json({ questions });
    } catch (parseError) {
      console.error('Questions Parse Error:', parseError, questionsText);
      return NextResponse.json(
        { error: 'Question format error' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Questions Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
} 