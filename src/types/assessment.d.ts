export interface AssessmentConfig {
  mode: 'single' | 'couple';
  participantInfo: {
    name: string;
    age: number;
    relationshipDuration?: number;
  };
}

export interface Question {
  id: number;
  question: string;
  category: string;
  options: Array<{
    value: number;
    text: string;
  }>;
  coupleOnly?: boolean;
}

export interface AnalysisResult {
  score: number;
  compatibility: string;
  suggestions: string[];
  aiAnalysis: string;
} 