import { NextRequest, NextResponse } from 'next/server';
import { middleware } from '@/middleware';

// Mock Redis and Ratelimit
const mockLimit = jest.fn();
jest.mock('@upstash/redis', () => ({
    Redis: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@upstash/ratelimit', () => ({
    Ratelimit: jest.fn().mockImplementation(() => ({
        limit: mockLimit
    }))
}));

// Mock Next.js Request
const createMockRequest = (path: string, headers: Record<string, string> = {}) => {
    return new NextRequest('http://localhost:3000' + path, {
        headers: new Headers(headers)
    });
};

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

        const request = createMockRequest('/api/shorten', {
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

        const request = createMockRequest('/api/shorten', {
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

            const request = createMockRequest('/api/shorten', {
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

            const request = createMockRequest(path, {
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

        const request = createMockRequest('/api/shorten', {
            'x-forwarded-for': '192.0.2.1'
        });

        const response = await middleware(request);

        expect(response?.headers.get('X-RateLimit-Limit')).toBe('20');
        expect(response?.headers.get('X-RateLimit-Remaining')).toBe('15');
        expect(response?.headers.get('X-RateLimit-Reset')).toBe('1234567890');
    });
});

beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup basic request mock
    mockRequest = {
        nextUrl: {
            pathname: '/api/shorten',
        },
        headers: new Headers({
            'x-forwarded-for': '192.0.2.1',
        }),
    };
});

test('should allow requests within rate limit', async () => {
    // Mock successful rate limit check
    (Ratelimit as jest.Mock).mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue({
            success: true,
            limit: 20,
            remaining: 19,
            reset: 1234567890,
        }),
    }));

    const response = await middleware(mockRequest as NextRequest);
    expect(response?.status).not.toBe(429);
});

test('should block requests exceeding rate limit', async () => {
    // Mock rate limit exceeded
    (Ratelimit as jest.Mock).mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue({
            success: false,
            limit: 20,
            remaining: 0,
            reset: 1234567890,
        }),
    }));

    const response = await middleware(mockRequest as NextRequest);
    expect(response?.status).toBe(429);

    const responseBody = await response?.json();
    expect(responseBody).toEqual({
        error: 'Too many requests',
        limit: 20,
        remaining: 0,
        reset: 1234567890,
    });
});

test('should correctly handle different IP headers', async () => {
    const testCases = [
        { header: 'x-real-ip', value: '203.0.113.1' },
        { header: 'x-forwarded-for', value: '203.0.113.2' },
        { header: 'cf-connecting-ip', value: '203.0.113.3' },
    ];

    for (const { header, value } of testCases) {
        const headers = new Headers();
        headers.set(header, value);

        mockRequest.headers = headers;

        (Ratelimit as jest.Mock).mockImplementation(() => ({
            limit: jest.fn().mockResolvedValue({
                success: true,
                limit: 20,
                remaining: 19,
                reset: 1234567890,
            }),
        }));

        await middleware(mockRequest as NextRequest);

        // Verify the correct IP was used for rate limiting
        const ratelimitInstance = (Ratelimit as jest.Mock).mock.results[0].value;
        expect(ratelimitInstance.limit).toHaveBeenCalledWith(value);
    }
});

test('should only apply rate limiting to specific routes', async () => {
    const testCases = [
        { path: '/api/shorten', shouldLimit: true },
        { path: '/s/abc123', shouldLimit: true },
        { path: '/about', shouldLimit: false },
        { path: '/', shouldLimit: false },
    ];

    for (const { path, shouldLimit } of testCases) {
        mockRequest.nextUrl = { pathname: path } as URL;

        await middleware(mockRequest as NextRequest);

        const ratelimitInstance = (Ratelimit as jest.Mock).mock.results[0]?.value;
        if (shouldLimit) {
            expect(ratelimitInstance?.limit).toHaveBeenCalled();
        } else {
            expect(ratelimitInstance?.limit).not.toHaveBeenCalled();
        }
    }
});

test('should include correct rate limit headers', async () => {
    (Ratelimit as jest.Mock).mockImplementation(() => ({
        limit: jest.fn().mockResolvedValue({
            success: true,
            limit: 20,
            remaining: 15,
            reset: 1234567890,
        }),
    }));

    const response = await middleware(mockRequest as NextRequest);

    expect(response?.headers.get('X-RateLimit-Limit')).toBe('20');
    expect(response?.headers.get('X-RateLimit-Remaining')).toBe('15');
    expect(response?.headers.get('X-RateLimit-Reset')).toBe('1234567890');
});
});
