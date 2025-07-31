import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics/index';

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    await trackEvent(event);
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error server-side only
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
