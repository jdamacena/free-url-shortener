import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { sanitizeShortId } from "@/lib/validation";

export async function POST(request: Request, { params }: { params: Promise<{ shortId: string }> }) {
    const { shortId } = await params;
    const sanitizedShortId = sanitizeShortId(shortId);
    if (!sanitizedShortId || sanitizedShortId !== shortId) {
        return NextResponse.json({ error: "Invalid short URL" }, { status: 400 });
    }

    const db = await getDb();
    const result = await db.collection("urls").findOneAndUpdate(
        { shortId: sanitizedShortId },
        { $inc: { clicks: 1 } },
        { returnDocument: "after" }
    );

    if (!result) {
        return NextResponse.json({ error: "URL not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, clicks: result.clicks });
}
