import { URL } from 'url';

export interface ValidationResult {
    isValid: boolean;
    sanitizedUrl?: string;
    error?: string;
}

export function validateAndSanitizeUrl(input: string): ValidationResult {
    // Trim whitespace
    let url = input.trim();

    // Check if URL is empty after trimming
    if (!url) {
        return { isValid: false, error: 'URL is required' };
    }

    // Check if URL has a protocol, if not prepend https://
    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        // Try to construct a URL object to validate the URL
        const urlObject = new URL(url);

        // Check for allowed protocols
        if (!['http:', 'https:'].includes(urlObject.protocol)) {
            return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
        }

        // Check minimum length
        if (url.length < 3) {
            return { isValid: false, error: 'URL is too short' };
        }

        // Check maximum length (e.g., 2048 characters is a common limit)
        if (url.length > 2048) {
            return { isValid: false, error: 'URL is too long (maximum 2048 characters)' };
        }

        // Sanitize and normalize the URL
        const sanitizedUrl = urlObject.toString();

        return { isValid: true, sanitizedUrl };
    } catch (error) {
        return { isValid: false, error: 'Invalid URL format' };
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
