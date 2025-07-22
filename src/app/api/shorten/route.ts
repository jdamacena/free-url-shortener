import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Generate a mock short ID (in a real app, this would be stored in a database)
        const shortId = Math.random().toString(36).substring(2, 8);
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
