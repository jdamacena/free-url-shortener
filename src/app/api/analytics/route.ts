import { NextRequest, NextResponse } from 'next/server';
import { trackEvent } from '@/lib/analytics/index';
import { config as appConfig } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    if (!appConfig.features.analytics.enabled) {
      return NextResponse.json({ success: false, error: 'Analytics disabled' }, { status: 404 });
    }
    const event = await req.json();
    await trackEvent(event);
    return NextResponse.json({ success: true });
  } catch (error) {
    // Log error server-side only
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
