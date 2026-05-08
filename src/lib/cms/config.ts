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

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.finanshels.com'
  return url.replace(/\/$/, '')
}

export function getRevalidateSecret(): string | undefined {
  return process.env.REVALIDATE_SECRET
}
