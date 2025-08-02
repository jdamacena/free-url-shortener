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
            console.error('MongoDB analytics error:', err);
            // In production, you might want to send this to a monitoring service
            // but don't expose database errors to the client
        }
    }
}
