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
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <div className="text-2xl font-semibold mb-4">
          <span>Your link will be available in: </span>
          <span className="text-blue-600">{timeLeft}</span>
          <span> seconds</span>
        </div>
        
        <div className={`transition-opacity duration-500 ${isLinkVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-600 mb-4">
            Destination: <a href={originalUrl} className="text-blue-500 underline">{originalUrl}</a>
          </p>
          <a href={originalUrl}>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Go to Your Link
            </button>
          </a>
          <p className="text-sm text-gray-500 mt-4">This link has been clicked {clicks} times.</p>
        </div>
      </div>
    </div>
  );
}
