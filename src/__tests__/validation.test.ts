import { validateAndSanitizeUrl } from '@/lib/validation';

describe('URL Validation', () => {
    // Valid URLs
    test.each([
        ['https://example.com', true],
        ['http://example.com', true],
        ['https://app.netlify.com/teams/example/billing/general', true],
        ['https://github.com/user/repo', true],
        ['https://sub1.sub2.example.com/path?query=123', true],
        ['https://example.com/path/with/special/@#$%^&*()', true],
        ['https://example.com/path?param=value&another=123', true],
    ])('should validate correct URL: %s', (url, expected) => {
        const result = validateAndSanitizeUrl(url);
        expect(result.isValid).toBe(expected);
    });

    // Invalid URLs
    test.each([
        ['ftp://example.com', false, 'Only HTTP and HTTPS protocols are allowed'],
        ['not-a-url', false, 'Invalid URL format'],
        ['', false, 'URL is required'],
        ['https://localhost:3000', false, 'Local and private IP addresses are not allowed'],
        ['https://192.168.1.1', false, 'Local and private IP addresses are not allowed'],
        ['https://10.0.0.1', false, 'Local and private IP addresses are not allowed'],
        ['https://' + 'a'.repeat(2049), false, 'URL is too long (maximum 2048 characters)'],
    ])('should reject invalid URL: %s', (url, expected, errorMessage) => {
        const result = validateAndSanitizeUrl(url);
        expect(result.isValid).toBe(expected);
        expect(result.error).toBe(errorMessage);
    });

    // URL Sanitization
    test.each([
        ['example.com', 'https://example.com'],
        ['http://example.com/', 'http://example.com/'],
        ['  https://example.com  ', 'https://example.com'],
    ])('should sanitize URL: %s -> %s', (input, expected) => {
        const result = validateAndSanitizeUrl(input);
        expect(result.isValid).toBe(true);
        expect(result.sanitizedUrl).toBe(expected);
    });

    // Security Tests
    test('should not allow potential phishing URLs', () => {
        const phishingUrls = [
            'https://login-example.com',
            'https://banking-secure.com',
            'https://verify-account.com',
        ];

        phishingUrls.forEach(url => {
            const result = validateAndSanitizeUrl(url);
            expect(result.isValid).toBe(false);
            expect(result.error).toBe('This URL may be potentially harmful');
        });
    });
});
