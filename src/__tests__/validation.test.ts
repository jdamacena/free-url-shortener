/// <reference types="jest" />
import { validateAndSanitizeUrl, validateCustomShortUrl, sanitizeShortId, generateShortId } from '../lib/validation';
import { config } from '../lib/config';

describe('validateCustomShortUrl', () => {
    test('rejects empty', () => {
        const res = validateCustomShortUrl('   ');
        expect(res.isValid).toBe(false);
        expect(res.error).toMatch(/required/i);
    });

    test('enforces length bounds', () => {
        const tooShort = 'aa'.repeat(Math.max(0, Math.floor(config.features.shortening.minSlugLength / 2)) || 1);
        const tooLong = 'a'.repeat(config.features.shortening.maxSlugLength + 1);
        expect(validateCustomShortUrl(tooShort).isValid).toBe(false);
        expect(validateCustomShortUrl(tooLong).isValid).toBe(false);
    });

    test('rejects invalid characters and patterns; uppercased input is normalized', () => {
        expect(validateCustomShortUrl('has space').isValid).toBe(false);
        const upper = validateCustomShortUrl('UPPER');
        expect(upper.isValid).toBe(true);
        expect(upper.sanitizedUrl).toBe('upper');
        expect(validateCustomShortUrl('--bad--').isValid).toBe(false);
        expect(validateCustomShortUrl('-start').isValid).toBe(false);
        expect(validateCustomShortUrl('end-').isValid).toBe(false);
    });

    test('accepts valid slug', () => {
        const ok = 'my-custom-slug';
        const res = validateCustomShortUrl(ok);
        expect(res.isValid).toBe(true);
        expect(res.sanitizedUrl).toBe(ok);
    });
});

describe('validateAndSanitizeUrl', () => {
    test('requires non-empty input', () => {
        const res = validateAndSanitizeUrl('   ');
        expect(res.isValid).toBe(false);
    });

    test('adds https when missing', () => {
        const res = validateAndSanitizeUrl('example.com');
        expect(res.isValid).toBe(true);
        expect(res.sanitizedUrl).toMatch(/^https:\/\//);
    });

    test('rejects localhost and private IPs', () => {
        expect(validateAndSanitizeUrl('http://localhost').isValid).toBe(false);
        expect(validateAndSanitizeUrl('http://127.0.0.1').isValid).toBe(false);
        expect(validateAndSanitizeUrl('http://192.168.1.1').isValid).toBe(false);
        expect(validateAndSanitizeUrl('http://10.0.0.1').isValid).toBe(false);
        expect(validateAndSanitizeUrl('http://172.16.0.1').isValid).toBe(false);
    });

    test('rejects blocked tlds and keywords', () => {
        expect(validateAndSanitizeUrl('http://example.xxx').isValid).toBe(false);
        expect(validateAndSanitizeUrl('http://my-porn-site.com').isValid).toBe(false);
    });

    test('rejects urls from own domain', () => {
        const own = new URL(config.brand.url).hostname;
        const res = validateAndSanitizeUrl(`https://${own}/anything`);
        expect(res.isValid).toBe(false);
    });

    test('accepts valid http/https', () => {
        const good = 'https://www.google.com/search?q=test';
        const res = validateAndSanitizeUrl(good);
        expect(res.isValid).toBe(true);
        // Should preserve protocol and be a valid URL
        expect(() => new URL(res.sanitizedUrl!)).not.toThrow();
    });

    test('enforces max length', () => {
        const max = config.features.shortening.maxUrlLength;
        const longPath = 'a'.repeat(max + 10);
        const res = validateAndSanitizeUrl(`https://example.com/${longPath}`);
        expect(res.isValid).toBe(false);
    });
});

describe('sanitizeShortId', () => {
    test('removes non-alphanumeric characters', () => {
        expect(sanitizeShortId('a-b_c!1@2#3')).toBe('abc123');
    });
});

describe('generateShortId', () => {
    test('generates correct length and charset', () => {
        const id = generateShortId();
        expect(id).toHaveLength(6);
        expect(/^[a-zA-Z0-9]{6}$/.test(id)).toBe(true);
    });

    test('likely produces different ids across calls', () => {
        const ids = new Set(Array.from({ length: 20 }, () => generateShortId()));
        expect(ids.size).toBeGreaterThan(15);
    });
});
