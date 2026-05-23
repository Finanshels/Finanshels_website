import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { isCmsConfigured } from './config'

let cachedApp: App | null = null
let initWarned = false

/**
 * Robustly normalize the FIREBASE_ADMIN_PRIVATE_KEY env var.
 *
 * Vercel / Docker / shell environments mangle PEMs in many ways. We accept all of:
 *   - Real multi-line PEM (newlines preserved)
 *   - Single-line with literal "\n" sequences (most common)
 *   - Wrapped in surrounding single or double quotes
 *   - CRLF line endings
 *   - Base64-encoded entire PEM (we detect the absence of "-----BEGIN" and decode)
 */
export function normalizePrivateKey(input: string): string {
  if (!input) return ''
  let key = input

  // Strip a single layer of surrounding quotes if someone pasted with them.
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1)
  }

  // If the key doesn't already contain the PEM header, try base64 decoding.
  if (!key.includes('-----BEGIN')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8')
      if (decoded.includes('-----BEGIN')) key = decoded
    } catch {
      // ignore — we'll fall through and let cert() throw a clear error
    }
  }

  // Convert literal "\n" into real newlines, normalize CRLF.
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n')

  // Trim surrounding whitespace but preserve internal newlines.
  return key.trim() + '\n'
}

/** Singleton Firebase Admin App (Firestore + Storage). Returns null when CMS env is not configured. */
export function getAdminApp(): App | null {
  return initAdminApp()
}

function initAdminApp(): App | null {
  if (cachedApp) return cachedApp
  const existing = getApps()[0]
  if (existing) {
    cachedApp = existing
    return existing
  }
  if (!isCmsConfigured()) return null

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID!
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!
  const privateKey = normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '')

  if (!privateKey.includes('-----BEGIN')) {
    if (!initWarned) {
      initWarned = true
      console.warn(
        '[firestore] FIREBASE_ADMIN_PRIVATE_KEY does not contain a valid PEM header after normalization. ' +
          'Re-paste the service-account JSON `private_key` field exactly, or store it base64-encoded.'
      )
    }
    return null
  }

  try {
    cachedApp = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })
    return cachedApp
  } catch (err) {
    if (!initWarned) {
      initWarned = true
      console.warn(
        '[firestore] Failed to initialize Firebase Admin:',
        err instanceof Error ? err.message : err,
        '— check FIREBASE_ADMIN_* env vars on this deployment.'
      )
    }
    return null
  }
}

/** Returns Firestore instance, or `null` when service account env is missing/invalid. */
export function getDb(): Firestore | null {
  if (!isCmsConfigured()) return null
  const app = getAdminApp()
  if (!app) return null
  try {
    return getFirestore(app)
  } catch {
    return null
  }
}

export const COLLECTIONS = {
  mediaAssets: 'media_assets',
  ourCustomers: 'our_customers',
  tools: 'tools',
  customerReviews: 'customer_reviews',
  podcasts: 'podcasts',
  faqs: 'faqs',
  customerStories: 'customer_stories',
  ebooks: 'ebooks',
  webinars: 'webinars',
  blogPosts: 'blog_posts',
  glossaryTerms: 'glossary_terms',
  teamMembers: 'team_members',
} as const
