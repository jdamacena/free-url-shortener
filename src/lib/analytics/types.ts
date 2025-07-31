// Supported event types
export type AnalyticsEventType =
    | 'site_visit'
    | 'link_created'
    | 'custom_link_created'
    | 'link_opened'
    | 'ad_clicked'
    | 'ad_skipped'
    | 'ad_waited'
    | 'custom_link_failed'
    | 'custom_link_deleted'
    | 'error';

// Event payloads
export interface AnalyticsEvent {
    type: AnalyticsEventType;
    userId?: string;
    linkId?: string;
    customAlias?: string;
    referrer?: string;
    ipAddress?: string;
    errorMessage?: string;
    timestamp?: number;
    [key: string]: unknown; // For extensibility
}

/**
 * Analytics provider interface.
 * Implementations can send events to any backend (Google, custom, etc).
 */
export interface AnalyticsProvider {
    trackEvent: (event: AnalyticsEvent) => Promise<void>;
}
