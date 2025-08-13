// Minimal public envs for tests so config.ts doesn't throw
process.env.NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'TestApp';
process.env.NEXT_PUBLIC_APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';
process.env.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Avoid requiring external services in unit tests; provide dummy values
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';
process.env.UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL || 'https://dummy.upstash.io';
process.env.UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || 'dummy';

// Feature flags defaults
process.env.ENABLE_ANALYTICS = process.env.ENABLE_ANALYTICS || 'false';
process.env.ENABLE_ADS = process.env.ENABLE_ADS || 'false';
process.env.ENABLE_CUSTOM_DOMAINS = process.env.ENABLE_CUSTOM_DOMAINS || 'false';
