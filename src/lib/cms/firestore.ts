import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { isCmsConfigured } from './config'

let cachedApp: App | null = null

function initAdminApp(): App {
  if (cachedApp) return cachedApp
  const existing = getApps()[0]
  if (existing) {
    cachedApp = existing
    return existing
  }
  if (!isCmsConfigured()) {
    throw new Error('Firestore CMS env vars are not set')
  }
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID!
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n')

  cachedApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  })
  return cachedApp
}

/** Returns Firestore instance, or `null` when service account env is missing (local / preview). */
export function getDb(): Firestore | null {
  if (!isCmsConfigured()) return null
  try {
    return getFirestore(initAdminApp())
  } catch {
    return null
  }
}

export const COLLECTIONS = {
  mediaAssets: 'media_assets',
  videos: 'videos',
  ourCustomers: 'our_customers',
  tools: 'tools',
  reviewSources: 'review_sources',
  customerReviews: 'customer_reviews',
  podcasts: 'podcasts',
  faqQuestions: 'faq_questions',
  faqTopics: 'faq_topics',
  customerStories: 'customer_stories',
  ebooks: 'ebooks',
  webinars: 'webinars',
  blogPosts: 'blog_posts',
  glossaryTerms: 'glossary_terms',
  teamMembers: 'team_members',
} as const
