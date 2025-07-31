import { getDb } from '../mongodb';
import { AnalyticsEvent, AnalyticsProvider } from './types';

/**
 * Analytics provider that saves events to MongoDB.
 */
export class MongoDBAnalyticsProvider implements AnalyticsProvider {
    async trackEvent(event: AnalyticsEvent): Promise<void> {
        try {
            const db = await getDb();
            // Save to 'analytics_events' collection
            await db.collection('analytics_events').insertOne({
                ...event,
                timestamp: event.timestamp || Date.now(),
            });
        } catch (err) {
            // Log error server-side only
            if (process.env.NODE_ENV === 'development') {
                console.error('MongoDB analytics error:', err);
            }
        }
    }
}
