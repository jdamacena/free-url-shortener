import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Create Redis instance
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Create rate limiter instance - 20 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '10 s'),
    analytics: true,
})

export async function middleware(request: NextRequest) {
    // Get IP from various headers or default to 127.0.0.1
    const ip = request.headers.get('x-real-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('cf-connecting-ip') ||
        '127.0.0.1'
    const { pathname } = request.nextUrl

    // Only apply rate limiting to API routes and URL redirects
    if (pathname.startsWith('/api') || pathname.startsWith('/s/')) {
        // Check rate limit
        const { success, limit, reset, remaining } = await ratelimit.limit(ip)

        if (!success) {
            return new NextResponse(JSON.stringify({
                error: 'Too many requests',
                limit,
                remaining: 0,
                reset: reset,
            }), {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'X-RateLimit-Limit': limit.toString(),
                    'X-RateLimit-Remaining': remaining.toString(),
                    'X-RateLimit-Reset': reset.toString(),
                },
            })
        }

        // Add rate limit headers to successful requests
        const response = NextResponse.next()
        response.headers.set('X-RateLimit-Limit', limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', reset.toString())

        return response
    }

    // For non-API routes, just continue
    return NextResponse.next()
}

// Configure which routes to apply the middleware to
export const config = {
    matcher: [
        '/api/:path*',
        '/s/:path*',
    ],
}
