'use client';

import { AssessmentConfig, AssessmentMode, AssessmentType } from '@/types/assessment';

type InfoFormProps = {
  mode: AssessmentMode;
  type: AssessmentType;
  onSubmit: (config: AssessmentConfig) => void;
};

export function InfoForm({ mode, type, onSubmit }: InfoFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const config: AssessmentConfig = {
      mode,
      type,
      participantInfo: {
        name: formData.get('name') as string,
        gender: formData.get('gender') as 'male' | 'female',
        age: Number(formData.get('age')),
        relationshipDuration: Number(formData.get('duration'))
      }
    };

    onSubmit(config);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">
          {mode === 'single' ? '个人信息' : '基本信息'}
        </h2>
        <p className="text-foreground/60 text-center">
          请填写以下信息，帮助我们提供更准确的分析
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            姓名/昵称
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 rounded-md bg-secondary border border-secondary"
            placeholder="请输入"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">性别</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="male"
                required
                className="mr-2"
              />
              男
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="female"
                required
                className="mr-2"
              />
              女
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-1">
            年龄
          </label>
          <input
            type="number"
            id="age"
            name="age"
            min="18"
            max="100"
            required
            className="w-full p-2 rounded-md bg-secondary border border-secondary"
            placeholder="请输入"
          />
        </div>

        {mode === 'couple' && (
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-1">
              恋爱时长（月）
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="0"
              required
              className="w-full p-2 rounded-md bg-secondary border border-secondary"
              placeholder="请输入"
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
      >
        开始测评
      </button>
    </form>
  );
} 