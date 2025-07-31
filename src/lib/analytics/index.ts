/**
 * Main analytics entry point. Centralizes event tracking and provider selection.
 *
 * Usage:
 *   import { trackEvent } from './analytics';
 *   trackEvent({ type: 'link_created', userId, customAlias });
 *
 * To swap analytics backend, update the provider import below.
 */

import { AnalyticsEvent } from './types';
import { MongoDBAnalyticsProvider } from './mongodb-provider';

// Swap provider here (MongoDB by default)
const provider = new MongoDBAnalyticsProvider();

/**
 * Track an analytics event.
 * Usage: trackEvent({ type: 'link_created', ... })
 */
export async function trackEvent(event: AnalyticsEvent): Promise<void> {
    // Add timestamp if not present
    if (!event.timestamp) event.timestamp = Date.now();
    await provider.trackEvent(event);
}

/**
 * To migrate to a standalone analytics service:
 * - Implement AnalyticsProvider for your backend
 * - Swap the provider instance above
 * - All app code remains unchanged
 */
