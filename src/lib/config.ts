/**
 * Validate required environment variables
 */
const requiredVars = [
    "NEXT_PUBLIC_APP_NAME",
    "NEXT_PUBLIC_APP_DOMAIN",
    "NEXT_PUBLIC_APP_URL",
    "MONGODB_URI",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN"
] as const;

// Only run environment validation on the server side
if (typeof window === 'undefined') {
    for (const key of requiredVars) {
        if (!process.env[key]) {
            console.error(`Environment variable ${key} is missing`);
            throw new Error(`Missing required environment variable: ${key}`);
        }

        // Only log public variables, mask sensitive ones
        // if (key.startsWith('NEXT_PUBLIC_')) {
        //     console.log(`[Server] ${key}: ${process.env[key]}`);
        // } else {
        //     console.log(`[Server] ${key}: ********`);
        // }
    }
}

/** Global configuration for the URL shortener application.
 * This is the central configuration file for white-labeling the application.
 * 
 * Configuration Hierarchy:
 * 1. Environment Variables (highest priority, override config.ts)
 * 2. config.ts (default values and brand-specific settings)
 * 
 * Usage:
 * 1. Required fields must have values
 * 2. Optional fields can be set to empty string ("") or removed to disable
 * 3. Feature flags can be overridden by environment variables
 * 4. All branding elements (colors, text, links) are customizable
 * 
 * @example
 * ```ts
 * // Minimal configuration
 * export const config = {
 *   brand: {
 *     name: "MyShortener",
 *     domain: "myshortener.com",
 *     title: "URL Shortener",
 *     description: "Shorten your links easily",
 *   }
 *   // ... other required fields
 * }
 * ```
 */
export const config = {
    // Infrastructure
    infrastructure: {
        database: {
            uri: process.env.MONGODB_URI!,
        },
        redis: {
            url: process.env.UPSTASH_REDIS_REST_URL!,
            token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        },
    },

    // Branding
    brand: {
        name: process.env.NEXT_PUBLIC_APP_NAME!,
        domain: process.env.NEXT_PUBLIC_APP_DOMAIN!,
        url: process.env.NEXT_PUBLIC_APP_URL!,
        title: "Free URL Shortener",
        description: "Transform long URLs into short, custom, shareable links instantly. No registration required.",
        slogan: "Making the web more accessible, one short link at a time.",
    },

    // SEO & Metadata
    seo: {
        title: "Free URL Shortener - Shorten Your Links for Free!",
        description: "Transform long URLs into short, custom, shareable links instantly. No registration required.",
        keywords: ["url shortener", "link shortener", "free", "instant", "no registration"],
    },

    // URL Configuration
    url: {
        shortUrlPath: "/s", // The path prefix for shortened URLs (e.g., /s/abc123)
        maxLength: 2048, // Maximum allowed URL length
    },

    // API Configuration
    api: {
        endpoints: {
            shorten: "/api/shorten",
        },
        rateLimit: {
            requestsPerMinute: 10,
        },
    },

    // Feature Configuration
    features: {
        // Core Features (required)
        shortening: {
            enabled: true,
            maxUrlLength: 2048,
            customSlugs: false,
            shortUrlLength: Number(process.env.SHORT_URL_LENGTH) || 6,
            minSlugLength: 3, // Minimum custom slug length
            maxSlugLength: 32, // Maximum custom slug length
        },
        redirectPage: {
            enabled: process.env.REDIRECT_PAGE_ENABLED ? process.env.REDIRECT_PAGE_ENABLED === "true" : true,
            timerDuration: Number(process.env.REDIRECT_PAGE_TIMER_DURATION) || 15, // Duration in seconds
            showOnlyAfterXAccesses: Number(process.env.REDIRECT_PAGE_SHOW_ONLY_AFTER_X_ACCESSES) || 10,
        },

        // Optional Features (can be overridden by environment variables)
        analytics: {
            enabled: process.env.ENABLE_ANALYTICS === "true",
            publicStats: false,
            detailedMetrics: false,
        },
        adSupported: {
            enabled: process.env.ENABLE_ADS === "true",
            skipDelay: 5, // seconds to wait before redirect
            position: "pre-redirect", // "pre-redirect" | "sidebar" | "banner"
        },
        customDomains: {
            enabled: process.env.ENABLE_CUSTOM_DOMAINS === "true",
            allowList: [], // List of allowed domains
            maxDomainsPerUser: 1,
        },
        qrCodes: {
            enabled: false,
            downloadFormats: ["png", "svg"],
        },
        // Security settings (from environment)
        rateLimit: {
            requests: Number(process.env.RATE_LIMIT_REQUESTS) || 10,
            windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
        },
    },
    // Content Configuration (optional - set empty array to hide section)
    content: {
        features: [
            {
                title: "Instant Shortening",
                description: "Create short links in seconds with our lightning-fast URL shortening technology.",
                icon: "Zap",
            },
            {
                title: "Secure & Reliable",
                description: "All links are securely processed and guaranteed to work reliably across all platforms.",
                icon: "Shield",
            },
            {
                title: "Custom Short URLs",
                description: "Create branded, memorable links that boost click-through rates and enhance brand recognition.",
                icon: "Link",
            },
        ],
        benefits: [
            "Easy to share on social media",
            "Cleaner look for presentations",
            "Custom URLs that gets more clicks",
            "Save character space in messages",
            "Better QR codes, as there are fewer characters",
        ],
        faq: [], // Empty array to hide FAQ section
    },

    // Footer Configuration
    footer: {
        sections: {
            company: {
                title: "Company",
                links: [
                    // Add links as needed
                    // { label: "About Us", href: "/about" },
                ]
            },
            resources: {
                title: "Resources",
                links: [
                    // Add when API documentation is ready
                    // { label: "API Documentation", href: "/docs/api" },
                ]
            },
            legal: {
                title: "Legal",
                links: [
                    { label: "Terms of Service", href: "/terms" },
                    { label: "Privacy Policy", href: "/privacy" },
                ]
            }
        }
    },

    // Social Media Links (optional - set to empty string or remove to hide)
    social: {
        twitter: "",
        facebook: "",
        instagram: "",
        linkedin: "",
    },

    // Contact Information (can be overridden by environment variables)
    contact: {
        email: process.env.SUPPORT_EMAIL || "",
        website: "",
        address: "",
        phone: "",
    },

    // Legal Links (optional - set to empty string or remove to hide)
    legal: {
        privacyPolicy: "",
        termsOfService: "",
        cookiePolicy: "",
        disclaimer: "",
    },

    // Theme Configuration
    theme: {
        colors: {
            primary: "256 100% 65%", // HSL format
            secondary: "190 100% 60%",
            accent: "326 100% 65%",
        },
        gradients: {
            primary: "linear-gradient(135deg, hsl(256 100% 65%), hsl(326 100% 65%))",
        },
    },

} as const;

/**
 * Google Ads configuration
 *
 * @property enabled - Whether Google Ads are enabled
 * @property clientId - Google AdSense client ID (e.g., 'ca-pub-xxxxxxxxxxxx')
 * @property adSlots - Object containing ad slot IDs for different placements
 */
export const googleAdsConfig = {
    enabled: 'false',
    enabledScript: 'true',
    clientId: 'ca-pub-6752476269932874',
    adSlots: {
        redirectPage: {
            primary: process.env.NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_PRIMARY || '', // Main ad slot
            secondary: process.env.NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_SECONDARY || '', // Secondary ad slot
            banner: process.env.NEXT_PUBLIC_GOOGLE_ADS_REDIRECT_BANNER || '', // Banner ad slot
        },
        homepage: process.env.NEXT_PUBLIC_GOOGLE_ADS_HOMEPAGE || '',
    },
    displayRules: {
        minViewportWidth: 320, // Minimum viewport width to show ads
        responsiveBreakpoints: {
            mobile: 768,
            tablet: 1024,
            desktop: 1200,
        },
    },
};

// Type for the config object
export type Config = typeof config;
