'use client';

import { AssessmentMode, AssessmentType, ASSESSMENT_OPTIONS } from '@/types/assessment';
import Image from 'next/image';

type ModeSelectionProps = {
  onSelect: (mode: AssessmentMode, type: AssessmentType) => void;
};

export function ModeSelection({ onSelect }: ModeSelectionProps) {
  return (
    <div className="w-full space-y-8">
      {/* 测评模式选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelect('single', 'basic')}
          className="p-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-all group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Image src="/heart.svg" alt="单人测评" width={32} height={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold">单人测评</h3>
            <p className="text-foreground/60">适合想了解自己在感情中特质的个人</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('couple', 'basic')}
          className="p-6 rounded-lg bg-secondary hover:bg-secondary/80 transition-all group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Image src="/heart.svg" alt="双人测评" width={32} height={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold">双人测评</h3>
            <p className="text-foreground/60">适合想共同了解彼此契合度的情侣</p>
          </div>
        </button>
      </div>

      {/* 测评类型选择 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(ASSESSMENT_OPTIONS).map(([type, option]) => (
          <div
            key={type}
            className="p-6 rounded-lg bg-secondary"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold">{option.title}</h3>
                <span className="text-sm text-foreground/60">{option.duration}</span>
              </div>
              <p className="text-foreground/60">{option.description}</p>
              <ul className="space-y-2">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 