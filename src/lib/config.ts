import env from "./env";

/**    // Branding (can be overridden by environment variables)
    brand: {
        name: env.instance.name || "LinkSnip",
        domain: env.instance.domain || "linksnip.com",
        title: "Free URL Shortener",
        description: "Transform long URLs into short, shareable links instantly. No registration required.",
        slogan: "Making the web more accessible, one short link at a time.",
    },bal configuration for the URL shortener application.
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
    // Branding
    brand: {
        name: "Encurtador de links",
        domain: "linksnip.com",
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
            shortUrlLength: env.security.shortUrlLength,
        },

        // Optional Features (can be overridden by environment variables)
        analytics: {
            enabled: env.features.analytics,
            publicStats: false,
            detailedMetrics: false,
        },
        adSupported: {
            enabled: env.features.ads,
            skipDelay: 5, // seconds to wait before redirect
            position: "pre-redirect", // "pre-redirect" | "sidebar" | "banner"
        },
        customDomains: {
            enabled: env.features.customDomains,
            allowList: [], // List of allowed domains
            maxDomainsPerUser: 1,
        },
        qrCodes: {
            enabled: false,
            downloadFormats: ["png", "svg"],
        },

        // Security settings (from environment)
        rateLimit: {
            requests: env.security.rateLimit.requests,
            windowMs: env.security.rateLimit.windowMs,
        },
    },    // Content Configuration (optional - set empty array to hide section)
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
        email: env.contact.supportEmail || "",
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

// Type for the config object
export type Config = typeof config;
