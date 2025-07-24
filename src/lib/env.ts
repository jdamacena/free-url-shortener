/**
 * Type-safe environment variables configuration
 */

const env = {
    /** App instance configuration */
    instance: {
        name: process.env.NEXT_PUBLIC_APP_NAME,
        domain: process.env.NEXT_PUBLIC_APP_DOMAIN,
        url: process.env.NEXT_PUBLIC_APP_URL,
    },

    /** Database configuration */
    database: {
        uri: process.env.MONGODB_URI || (() => {
            console.error('MONGODB_URI is not set in environment variables');
            console.log('Available env vars:', Object.keys(process.env).filter(key => !key.includes('=')));
            return '';
        })(),
    },

    /** Redis configuration */
    redis: {
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },    /** Security settings */
    security: {
        rateLimit: {
            requests: Number(process.env.RATE_LIMIT_REQUESTS) || 10,
            windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        },
        shortUrlLength: Number(process.env.SHORT_URL_LENGTH) || 6,
    },

    /** Feature flags */
    features: {
        analytics: process.env.ENABLE_ANALYTICS === "false",
        ads: process.env.ENABLE_ADS === "true",
        customDomains: process.env.ENABLE_CUSTOM_DOMAINS === "true",
    },

    /** Contact information */
    contact: {
        supportEmail: process.env.SUPPORT_EMAIL,
    },
} as const;

/**
 * Validate required environment variables
 */
const requiredVars = [
    "MONGODB_URI",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN"
] as const;
for (const key of requiredVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export default env;
