import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { validateAndSanitizeUrl, generateShortId } from "@/lib/validation";

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

        const { url } = body;

        // Validate and sanitize URL
        const validation = validateAndSanitizeUrl(url);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: validation.error },
                { status: 400 }
            );
        }

        // Generate a cryptographically secure short ID
        const shortId = generateShortId();
        // Save mapping to MongoDB
        const db = await getDb();
        await db.collection("urls").insertOne({
            shortId,
            originalUrl: url,
            createdAt: new Date(),
            clicks: 0
        });
        const shortUrl = `${request.nextUrl.origin}/s/${shortId}`;

        return NextResponse.json({
            originalUrl: url,
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
