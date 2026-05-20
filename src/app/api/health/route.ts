import { NextResponse } from 'next/server'
import { isCmsConfigured } from '@/lib/cms/config'

/**
 * Lightweight health endpoint for uptime monitors (BetterStack, Pingdom, UptimeRobot).
 * Returns 200 with a small JSON payload; never depends on Firestore connectivity
 * so a CMS outage doesn't cascade into a "site down" alert. The cms_configured
 * flag lets monitors observe configuration drift without false-paging.
 */
export const dynamic = 'force-dynamic'

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      ok: true,
      ts: new Date().toISOString(),
      cms_configured: isCmsConfigured(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  )
}
