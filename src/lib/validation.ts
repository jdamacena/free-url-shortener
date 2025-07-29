import { blockedPatterns } from './blocked-domains';
import { config } from './config';

export interface ValidationResult {
    isValid: boolean;
    sanitizedUrl?: string;
    error?: string;
}

export function validateCustomShortUrl(customUrl: string): ValidationResult {
    // Trim whitespace
    const cleaned = customUrl.trim().toLowerCase();

    // Check if empty
    if (!cleaned) {
        return { isValid: false, error: 'Custom URL is required' };
    }

    // Check length (between 3 and 32 characters)
    if (cleaned.length < 3 || cleaned.length > 32) {
        return { isValid: false, error: 'Custom URL must be between 3 and 32 characters' };
    }

    // Only allow alphanumeric characters and hyphens
    if (!/^[a-z0-9-]+$/.test(cleaned)) {
        return { isValid: false, error: 'Custom URL can only contain letters, numbers, and hyphens' };
    }

    // Don't allow consecutive hyphens
    if (cleaned.includes('--')) {
        return { isValid: false, error: 'Custom URL cannot contain consecutive hyphens' };
    }

    // Don't allow starting or ending with hyphen
    if (cleaned.startsWith('-') || cleaned.endsWith('-')) {
        return { isValid: false, error: 'Custom URL cannot start or end with a hyphen' };
    }

    return { isValid: true, sanitizedUrl: cleaned };
}

export function validateAndSanitizeUrl(input: string): ValidationResult {
    // Trim whitespace
    let url = input.trim();

    // Check if URL is empty after trimming
    if (!url) {
        return { isValid: false, error: 'URL is required' };
    }

    // Add protocol if missing
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        // Basic URL format validation
        if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url)) {
            return { isValid: false, error: 'Invalid URL format. Example: https://www.google.com' };
        }

        // Try to construct a URL object to validate the URL
        let urlObject: URL;
        try {
            urlObject = new URL(url);
        } catch {
            return { isValid: false, error: 'Invalid URL format. Please enter a valid URL like https://www.google.com' };
        }

        // Check if URL is from our own domain
        if (urlObject.hostname === new URL(config.brand.url).hostname) {
            return { isValid: false, error: 'Cannot shorten URLs that are already shortened by this service' };
        }

        // Check for allowed protocols
        if (!['http:', 'https:'].includes(urlObject.protocol)) {
            return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
        }

        // Ensure the hostname is not empty and has at least one dot
        const hostname = urlObject.hostname.toLowerCase();
        if (!hostname || !hostname.includes('.')) {
            return { isValid: false, error: 'Invalid domain format. Example: www.google.com' };
        }

        // Block localhost and private IP addresses
        if (
            hostname === 'localhost' ||
            hostname.endsWith('.local') ||
            hostname.match(/^127\./) ||
            hostname.match(/^192\.168\./) ||
            hostname.match(/^10\./) ||
            hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
            hostname.match(/^0\.0\.0\.0/)
        ) {
            return { isValid: false, error: 'Local and private IP addresses are not allowed' };
        }

        // Check against blocked domains
        if (blockedPatterns.domains.some((domain: string) => hostname === domain || hostname.endsWith(`.${domain}`))) {
            return { isValid: false, error: 'This domain has been blocked for security reasons' };
        }

        // Check against blocked TLDs
        if (blockedPatterns.tlds.some((tld: string) => hostname.endsWith(tld))) {
            return { isValid: false, error: 'This domain extension is not allowed' };
        }

        // Check for blocked keywords in the hostname
        if (blockedPatterns.keywords.some((keyword: string) => hostname.includes(keyword))) {
            return { isValid: false, error: 'This domain contains blocked keywords' };
        }

        // Block common phishing keywords
        const suspiciousKeywords = ['login', 'signin', 'account', 'password', 'banking', 'verify'];
        if (suspiciousKeywords.some(keyword => hostname.includes(keyword))) {
            return { isValid: false, error: 'This URL may be potentially harmful' };
        }

        // Check minimum length
        if (url.length < 3) {
            return { isValid: false, error: 'URL is too short' };
        }

        // Check maximum length
        if (url.length > 2048) {
            return { isValid: false, error: 'URL is too long (maximum 2048 characters)' };
        }

        // URL is valid, return the sanitized version
        return { isValid: true, sanitizedUrl: urlObject.toString() };
    } catch (error) {
        return { isValid: false, error: 'Invalid URL format. Please enter a valid URL like https://www.google.com' };
    }
}

export function sanitizeShortId(shortId: string): string {
    // Remove any characters that aren't alphanumeric
    return shortId.replace(/[^a-zA-Z0-9]/g, '');
}

export function generateShortId(): string {
    // Generate a random string of 6 alphanumeric characters
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let shortId = '';
    for (let i = 0; i < 6; i++) {
        shortId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortId;
}
