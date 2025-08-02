/**
 * Frontend analytics utility for sending events to the backend API.
 * Usage:
 *   import { trackFrontendEvent } from '@/lib/analytics/client';
 *   trackFrontendEvent({ type: 'site_visit', ... });
 */
export async function trackFrontendEvent(event: Record<string, any>): Promise<void> {
  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    
    if (!response.ok && process.env.NODE_ENV === 'development') {
      console.warn('Analytics event failed:', response.status, await response.text());
    }
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error('Analytics tracking error:', error);
    }
    // Optionally log error to monitoring service
    // Errors are not shown to users
  }
}
