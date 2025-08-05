'use client';

import { useEffect, useState } from 'react';
import { config } from '@/lib/config';


interface LinkTimerProps {
  originalUrl: string;
  clicks: number;
  shortId: string;
}

export function LinkTimer({ originalUrl, clicks, shortId }: LinkTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(config.features.redirectPage.timerDuration);
  const [isLinkVisible, setIsLinkVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleGoToLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/urls/${shortId}/click`, {
        method: 'POST',
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to register click');
        setLoading(false);
        return;
      }
      window.location.href = originalUrl;
    } catch (err) {
      setError('Network error');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-t shadow-lg p-8">
      <div className="max-w-2xl mx-auto text-center space-y-4 text-blue-600">
        <div className={`text-2xl font-semibold mb-4 ${!isLinkVisible ? 'block' : 'hidden'}`}>
          <span>Your link will be available in: </span>
          <span>{timeLeft}</span>
          <span> seconds</span>
        </div>
        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}
        <div className={`transition-opacity duration-500 ${isLinkVisible ? 'opacity-100' : 'opacity-10'} ${isLinkVisible ? 'block' : 'hidden'}`}>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleGoToLink}
            disabled={loading}
          >
            {loading ? 'Redirecting...' : 'Go to Your Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
