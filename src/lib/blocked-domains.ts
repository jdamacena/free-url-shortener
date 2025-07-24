export const blockedPatterns = {
    // Known malicious or spam domains
    domains: [
        'malicious-site.com',
        'spam-domain.com',
        'phishing-example.com'
    ],

    // Keywords that might indicate malicious/inappropriate content
    keywords: [
        'porn',
        'xxx',
        'adult',
        'gambling',
        'bet',
        'warez',
        'crack',
        'hack',
        'pirate',
        'malware',
        'phishing'
    ],

    // Blocked top-level domains
    tlds: [
        '.xxx',
        '.sex',
        '.porn',
        '.adult'
    ]
} as const;
