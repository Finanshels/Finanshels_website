/**
 * CMS runs on GCP (Firestore). Next.js on Vercel reads via Firebase Admin using a service account.
 * Set these in Vercel → Environment Variables (Production + Preview as needed).
 */
export function isCmsConfigured(): boolean {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  )
}

/**
 * Resolves the canonical public URL for this deployment, in priority order:
 *   1. NEXT_PUBLIC_SITE_URL (canonical production override)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (auto-set in Vercel production)
 *   3. VERCEL_URL (auto-set on every Vercel deploy, including previews)
 *   4. https://www.finanshels.com (last-resort default)
 *
 * Quotes are stripped (Vercel users sometimes paste with surrounding quotes).
 */
export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
    'https://www.finanshels.com'

  const stripped = fromEnv.trim().replace(/^['"]|['"]$/g, '')
  return stripped.replace(/\/$/, '')
}

export function getRevalidateSecret(): string | undefined {
  return process.env.REVALIDATE_SECRET
}
