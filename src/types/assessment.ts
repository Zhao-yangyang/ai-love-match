// 首先创建基础类型定义
export type AssessmentMode = 'single' | 'couple';  // 测评模式
export type AssessmentType = 'basic' | 'advanced'; // 测评类型

// 测评配置
export type AssessmentConfig = {
  mode: AssessmentMode;
  type: AssessmentType;
  participantInfo: {
    name?: string;
    gender?: 'male' | 'female';
    age?: number;
    relationshipDuration?: number;
  };
};

// 测评选项
export const ASSESSMENT_OPTIONS = {
  basic: {
    title: '基础测评',
    duration: '5-10分钟',
    questionCount: 20,
    features: ['基础分析报告', '简单建议'],
    description: '快速了解你们的契合程度'
  },
  advanced: {
    title: '深度测评',
    duration: '15-20分钟',
    questionCount: 40,
    features: ['详细分析报告', '多维度评估', '专业建议', '发展预测'],
    description: '深入分析你们的关系现状和发展方向'
  }
}; 