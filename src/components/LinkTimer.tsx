'use client';

import { useEffect, useState } from 'react';
import { config } from '@/lib/config';

interface LinkTimerProps {
  originalUrl: string;
  clicks: number;
}

export function LinkTimer({ originalUrl, clicks }: LinkTimerProps) {
  const [timeLeft, setTimeLeft] = useState(config.features.redirectPage.timerDuration);
  const [isLinkVisible, setIsLinkVisible] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setIsLinkVisible(true);
    }
  }, [timeLeft]);

  return (
    <div className="bg-white border-t shadow-lg p-8">
      <div className="max-w-2xl mx-auto text-center space-y-4 text-blue-600">
        <div className={`text-2xl font-semibold mb-4 ${!isLinkVisible ? 'block' : 'hidden'}`}>
          <span>Your link will be available in: </span>
          <span>{timeLeft}</span>
          <span> seconds</span>
        </div>
        
        <div  className={`transition-opacity duration-500 ${isLinkVisible ? 'opacity-100' : 'opacity-10'} ${isLinkVisible ? 'block' : 'hidden'}`}>
          <a href={originalUrl}>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go to Your Link
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
