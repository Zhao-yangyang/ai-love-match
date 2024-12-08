import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const { config: assessmentConfig } = await request.json();

    // 构建问题生成提示
    const prompt = `
你是一个专业的情感测评系统，需要根据用户信息生成个性化的测评问题。请以JSON格式返回问题列表。

用户信息：
- 模式：${assessmentConfig.mode === 'single' ? '单人测评' : '双人测评'}
- 年龄：${assessmentConfig.participantInfo.age}岁
${assessmentConfig.mode === 'couple' ? `- 恋爱时长：${assessmentConfig.participantInfo.relationshipDuration}个月` : ''}

请按以下格式返回JSON：
{
  "questions": [
    {
      "id": 数字,
      "question": "问题文本",
      "category": "分类",
      "options": [
        { "value": 1, "text": "选项1" },
        { "value": 2, "text": "选项2" },
        { "value": 3, "text": "选项3" },
        { "value": 4, "text": "选项4" }
      ],
      "coupleOnly": 布尔值
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

4. 问题示例：
   问题："在与他人交往时，你更倾向于？"
   选项：
   1. "保持适当距离，谨慎对待"
   2. "随遇而安，顺其自然"
   3. "主动交流，建立联系"
   4. "热情开放，深入交往"

请确保所有内容使用中文，并保持JSON格式正确。`;

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
            content: '你是一个专业的情感测评系统，请用中文生成所有问题和选项。'
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
    const questionsText = data.choices[0].message.content;
    
    try {
      const parsedData = JSON.parse(questionsText);
      const questions = parsedData.questions;

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