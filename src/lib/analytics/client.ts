/**
 * Frontend analytics utility for sending events to the backend API.
 * Usage:
 *   import { trackFrontendEvent } from '@/lib/analytics/client';
 *   trackFrontendEvent({ type: 'site_visit', ... });
 */
export async function trackFrontendEvent(event: Record<string, any>): Promise<void> {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch (error) {
    // Optionally log error to monitoring service
    // Errors are not shown to users
  }
}
