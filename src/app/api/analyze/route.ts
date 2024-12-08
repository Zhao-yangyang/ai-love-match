import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { AssessmentConfig } from '@/types/assessment';
import { config } from '@/lib/config';

// 检查环境变量
if (!config.deepseekApiKey) {
  console.error('Missing DEEPSEEK_API_KEY');
  return NextResponse.json(
    { error: 'API configuration error' },
    { status: 500 }
  );
}

const client = new OpenAI({
  apiKey: config.deepseekApiKey,
  baseURL: config.deepseekBaseUrl,
  dangerouslyAllowBrowser: true
});

export const runtime = 'edge';
export const preferredRegion = 'iad1';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { config: assessmentConfig, answers } = await request.json();
    
    const messages = [
      {
        role: 'system',
        content: `You are a professional relationship analyst. Please analyze the assessment results and provide feedback in JSON format.

Assessment type: ${assessmentConfig.mode === 'single' ? 'Individual' : 'Couple'}
Age: ${assessmentConfig.participantInfo.age}
${assessmentConfig.mode === 'couple' ? `Relationship duration: ${assessmentConfig.participantInfo.relationshipDuration} months` : ''}

Please return response in the following JSON format:
{
  "analysis": "Detailed analysis text",
  "score": number (0-100),
  "compatibility": "Compatibility level description",
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}
`
      },
      {
        role: 'user',
        content: `Please analyze these answers: ${JSON.stringify(answers)}`
      }
    ];

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const aiResponse = response.choices[0].message?.content;
    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No AI response received' },
        { status: 500 }
      );
    }

    try {
      const data = JSON.parse(aiResponse);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI Analysis Error:', error);
    return NextResponse.json(
      { error: 'AI analysis service temporarily unavailable' },
      { status: 500 }
    );
  }
} 