import OpenAI from 'openai';
import { AssessmentConfig } from '@/types/assessment';
import { config } from './config';

const client = new OpenAI({
  apiKey: config.deepseekApiKey,
  baseURL: config.deepseekBaseUrl
});

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export class DeepseekAPI {
  private messages: Message[] = [];

  constructor(config: AssessmentConfig) {
    // 初始化系统提示词
    this.messages = [{
      role: 'system',
      content: `你是一个专业的情感分析师，专注于${config.mode === 'single' ? '个人情感能力' : '情侣关系'}分析。
      用户信息：${config.participantInfo.name}，${config.participantInfo.age}岁，
      ${config.mode === 'couple' ? `恋爱时长${config.participantInfo.relationshipDuration}个月，` : ''}
      请基于用户的回答提供专业、温和且具有建设性的建议。`
    }];
  }

  async getResponse(question: string): Promise<string> {
    try {
      // 添加用户问题
      this.messages.push({
        role: 'user',
        content: question
      });

      // 调用API获取回答
      const response = await client.chat.completions.create({
        model: 'deepseek-chat',
        messages: this.messages,
        temperature: 0.7,
        max_tokens: 1000
      });

      // 检查并保存助手回答
      const answer = response.choices[0].message?.content;
      if (!answer) {
        throw new Error('未收到有效回答');
      }

      this.messages.push({
        role: 'assistant',
        content: answer
      });

      return answer;
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw new Error('AI分析服务暂时不可用，请稍后再试');
    }
  }

  // 清理对话历史
  clearHistory() {
    this.messages = [this.messages[0]]; // 只保留system消息
  }
} 