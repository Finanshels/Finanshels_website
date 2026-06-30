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

/**
 * FIX-076: is this the real production site (vs. a staging/preview deploy)?
 * Drives noindex + the optional staging password gate so only production is
 * crawlable. Resolution order:
 *   1. NEXT_PUBLIC_SITE_ENV (explicit override: "production" | "staging" | …)
 *   2. VERCEL_ENV (auto: "production" | "preview" | "development")
 *   3. NODE_ENV === 'production' AND a canonical NEXT_PUBLIC_SITE_URL is set
 * Anything without a clear production signal is treated as NON-production, so a
 * new environment never gets indexed by accident.
 */
export function isProductionSite(): boolean {
  const explicit = (process.env.NEXT_PUBLIC_SITE_ENV || '').trim().toLowerCase()
  if (explicit) return explicit === 'production'

  const vercelEnv = (process.env.VERCEL_ENV || '').trim().toLowerCase()
  if (vercelEnv) return vercelEnv === 'production'

  return process.env.NODE_ENV === 'production' && Boolean(process.env.NEXT_PUBLIC_SITE_URL)
}
