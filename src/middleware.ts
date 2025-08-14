import { NextResponse, NextRequest } from 'next/server'
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { config as appConfig } from '@/lib/config'

// Create Redis instance only if credentials are present (from central config)
const hasUpstash = Boolean(appConfig.infrastructure.redis.url && appConfig.infrastructure.redis.token)
const redis = hasUpstash
    ? new Redis({
        url: appConfig.infrastructure.redis.url,
        token: appConfig.infrastructure.redis.token,
    })
    : null

// Create rate limiter instance based on central config (requests/windowMs)
const { requests, windowMs } = appConfig.features.rateLimit
const rateWindowSeconds = Math.max(1, Math.floor(windowMs / 1000))
const ratelimit = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, `${rateWindowSeconds} s`),
        analytics: true,
    })
    : null

export async function middleware(request: NextRequest) {
    // Get IP from various headers or default to 127.0.0.1
    const ip = request.headers.get('x-real-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('cf-connecting-ip') ||
        '127.0.0.1'
    const { pathname } = request.nextUrl
    const shortPath = (appConfig.url.shortUrlPath || '/s').startsWith('/')
        ? appConfig.url.shortUrlPath
        : `/${appConfig.url.shortUrlPath}`

    // Rewrite from configured short path to canonical '/s' route if they differ
    if (shortPath !== '/s' && pathname.startsWith(`${shortPath}/`)) {
        const rest = pathname.slice(shortPath.length)
        const url = request.nextUrl.clone()
        url.pathname = `/s${rest}`
        return NextResponse.rewrite(url)
    }

    // Only apply rate limiting to API routes and URL redirects
    if ((pathname.startsWith('/api') || pathname.startsWith(`${shortPath}/`)) && ratelimit) {
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
    matcher: ['/:path*'],
}
