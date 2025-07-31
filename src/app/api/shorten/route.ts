import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { validateAndSanitizeUrl, validateCustomShortUrl, generateShortId } from "@/lib/validation";
import { trackEvent } from "@/lib/analytics";

export async function POST(request: NextRequest) {
    try {
        // Check request size (10kb limit)
        const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
        if (contentLength > 10 * 1024) { // 10kb
            return NextResponse.json(
                { error: "Request too large" },
                { status: 413 }
            );
        }

        // Validate request content type
        const contentType = request.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            return NextResponse.json(
                { error: "Content-Type must be application/json" },
                { status: 415 }
            );
        }

        // Validate origin for CSRF protection
        const origin = request.headers.get('origin');
        if (origin && new URL(origin).hostname !== new URL(request.url).hostname) {
            return NextResponse.json(
                { error: "Invalid origin" },
                { status: 403 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json(
                { error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { url, customUrl } = body;

        // Validate the target URL first
        const urlValidation = validateAndSanitizeUrl(url);
        if (!urlValidation.isValid) {
            return NextResponse.json(
                { error: urlValidation.error },
                { status: 400 }
            );
        }

        // If custom URL is provided, validate it
        let shortId;
        if (customUrl) {
            const customValidation = validateCustomShortUrl(customUrl);
            if (!customValidation.isValid) {
                return NextResponse.json(
                    { error: customValidation.error },
                    { status: 400 }
                );
            }
            shortId = customValidation.sanitizedUrl;

            // Check if custom URL is already taken
            const db = await getDb();
            const existing = await db.collection('urls').findOne({ shortId });
            if (existing) {
                return NextResponse.json(
                    { error: "This custom URL is already taken" },
                    { status: 409 }
                );
            }
        } else {
            shortId = generateShortId();
        }

        // Save mapping to MongoDB
        const db = await getDb();
        await db.collection("urls").insertOne({
            shortId,
            originalUrl: urlValidation.sanitizedUrl,
            createdAt: new Date(),
            clicks: 0
        });

        const shortUrl = `${request.nextUrl.origin}/s/${shortId}`;

        // Analytics: Track link creation event
        trackEvent({
            type: "link_created",
            shortId,
            originalUrl: urlValidation.sanitizedUrl,
            customAlias: customUrl || null,
            timestamp: Date.now(),
        });

        return NextResponse.json({
            originalUrl: urlValidation.sanitizedUrl,
            shortUrl,
            shortId,
        });
    } catch (error) {
        console.error("Error shortening URL:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
