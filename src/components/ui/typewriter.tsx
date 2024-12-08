'use client';

import { useState, useEffect, useRef } from 'react';

type TypewriterProps = {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  playSound?: boolean;
  renderText?: (text: string) => React.ReactNode;
};

export function Typewriter({ 
  text, 
  speed = 50, 
  onComplete, 
  className = '',
  playSound = true,
  renderText 
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  // 检查是否在客户端
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 初始化音效
  useEffect(() => {
    if (isClient && playSound) {
      audioRef.current = new Audio('https://www.soundjay.com/mechanical/sounds/typewriter-key-1.mp3');
      audioRef.current.volume = 0.1;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current = null;
      }
    };
  }, [isClient, playSound]);

  useEffect(() => {
    if (currentIndex < text.length && !isPaused && isClient) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        // 播放打字声
        if (playSound && audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }, speed);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete, isPaused, playSound, isClient]);

  // 显示跳过提示
  useEffect(() => {
    if (!isComplete && !showSkipHint && isClient) {
      const timeout = setTimeout(() => {
        setShowSkipHint(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isComplete, showSkipHint, isClient]);

  const handleClick = () => {
    if (!isComplete) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      setShowSkipHint(false);
      setIsComplete(true);
      onComplete?.();
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // 如果不是客户端，直接显示文本
  if (!isClient) {
    return <div className={className}>{text}</div>;
  }

  return (
    <div className="relative">
      <div 
        className={`relative ${className}`}
        onClick={handleClick}
      >
        {renderText ? renderText(displayText) : displayText}
        {!isComplete && (
          <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-blink" />
        )}
      </div>
      {showSkipHint && !isComplete && (
        <div 
          className="absolute top-0 right-0 text-xs text-foreground/60 animate-fade-in cursor-pointer hover:text-foreground/80"
          onClick={handleClick}
        >
          点击跳过动画
        </div>
      )}
      {!isComplete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePause();
          }}
          className="absolute bottom-0 right-0 text-xs text-foreground/60 hover:text-foreground/80"
        >
          {isPaused ? '继续' : '暂停'}
        </button>
      )}
    </div>
  );
} 