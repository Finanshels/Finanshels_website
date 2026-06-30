import { NextResponse } from 'next/server'
import { getActiveRedirects } from '@/lib/cms/redirectsRepository'

/**
 * FIX-073: active redirect map for `src/middleware.ts`.
 *
 * The middleware runs on the edge and cannot use firebase-admin, so it reads
 * the rule set from this Node route instead. Cached for 60s (and again in the
 * middleware's module scope) so a redirect lookup never hits Firestore per
 * request. Only enabled rules + their public from/to/permanent are exposed.
 */

export const runtime = 'nodejs'
export const revalidate = 60

export async function GET() {
  try {
    const rules = await getActiveRedirects()
    return NextResponse.json(
      { rules },
      { headers: { 'cache-control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch {
    // Fail open: an empty map means no redirects, never a broken site.
    return NextResponse.json({ rules: [] })
  }
}
