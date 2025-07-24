import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// Define mock response type
type MockRatelimitResponse = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

// Create mock NextURL implementation
class MockNextURL {
    constructor(pathname: string) {
        this.pathname = pathname;
    }
    pathname: string;
    origin = 'http://localhost:3000';
    search = '';
    searchParams = new URLSearchParams();
    username = '';
    password = '';
    port = '';
    hash = '';
    host = 'localhost:3000';
    hostname = 'localhost';
    href = '';
    protocol = 'http:';
    toString() { return this.origin + this.pathname; }
    clone() { return new MockNextURL(this.pathname); }
}

// Setup mocks
const mockLimit = jest.fn<Promise<MockRatelimitResponse>, [string]>();

// Mock the Redis and Ratelimit modules
jest.mock('@upstash/redis', () => ({
    Redis: jest.fn()
}));

jest.mock('@upstash/ratelimit', () => ({
    Ratelimit: jest.fn().mockImplementation(() => ({
        limit: mockLimit
    }))
}));

// Helper function to create mock requests
function createTestRequest(pathname: string, headers: Record<string, string> = {}) {
    const url = new URL('http://localhost:3000' + pathname);
    const request = new NextRequest(url, {
        headers: new Headers(headers)
    });

    // Override the nextUrl property
    Object.defineProperty(request, 'nextUrl', {
        get: () => new MockNextURL(pathname),
        enumerable: true,
        configurable: true
    });

    return request;
}

describe('Rate Limiting Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should allow requests within rate limit', async () => {
        mockLimit.mockResolvedValueOnce({
            success: true,
            limit: 20,
            remaining: 19,
            reset: 1234567890
        });

        const request = createTestRequest('/api/shorten', {
            'x-forwarded-for': '192.0.2.1'
        });

        const response = await middleware(request);
        expect(response?.status).not.toBe(429);
    });

    it('should block requests exceeding rate limit', async () => {
        mockLimit.mockResolvedValueOnce({
            success: false,
            limit: 20,
            remaining: 0,
            reset: 1234567890
        });

        const request = createTestRequest('/api/shorten', {
            'x-forwarded-for': '192.0.2.1'
        });

        const response = await middleware(request);
        expect(response?.status).toBe(429);

        const responseData = await response?.json();
        expect(responseData).toEqual({
            error: 'Too many requests',
            limit: 20,
            remaining: 0,
            reset: 1234567890
        });
    });

    it('should handle different IP headers', async () => {
        const testCases = [
            { header: 'x-real-ip', value: '203.0.113.1' },
            { header: 'x-forwarded-for', value: '203.0.113.2' },
            { header: 'cf-connecting-ip', value: '203.0.113.3' }
        ];

        for (const { header, value } of testCases) {
            mockLimit.mockReset();
            mockLimit.mockResolvedValueOnce({
                success: true,
                limit: 20,
                remaining: 19,
                reset: 1234567890
            });

            const request = createTestRequest('/api/shorten', {
                [header]: value
            });

            await middleware(request);
            expect(mockLimit).toHaveBeenCalledWith(value);
        }
    });

    it('should only apply rate limiting to specific routes', async () => {
        const testCases = [
            { path: '/api/shorten', shouldLimit: true },
            { path: '/s/abc123', shouldLimit: true },
            { path: '/about', shouldLimit: false },
            { path: '/', shouldLimit: false }
        ];

        for (const { path, shouldLimit } of testCases) {
            mockLimit.mockReset();
            mockLimit.mockResolvedValueOnce({
                success: true,
                limit: 20,
                remaining: 19,
                reset: 1234567890
            });

            const request = createTestRequest(path, {
                'x-forwarded-for': '192.0.2.1'
            });

            await middleware(request);

            if (shouldLimit) {
                expect(mockLimit).toHaveBeenCalled();
            } else {
                expect(mockLimit).not.toHaveBeenCalled();
            }
        }
    });

    it('should include correct rate limit headers', async () => {
        mockLimit.mockResolvedValueOnce({
            success: true,
            limit: 20,
            remaining: 15,
            reset: 1234567890
        });

        const request = createTestRequest('/api/shorten', {
            'x-forwarded-for': '192.0.2.1'
        });

        const response = await middleware(request);

        expect(response?.headers.get('X-RateLimit-Limit')).toBe('20');
        expect(response?.headers.get('X-RateLimit-Remaining')).toBe('15');
        expect(response?.headers.get('X-RateLimit-Reset')).toBe('1234567890');
    });
});
