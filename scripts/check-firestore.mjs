// Diagnostic: verifies Firestore connection + lists CMS collection contents.
// Run with: node scripts/check-firestore.mjs
import { readFileSync } from 'node:fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

function loadEnvLocal() {
  try {
    const txt = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    console.warn('[warn] could not read .env.local:', err.message)
  }
}

const COLLECTIONS = [
  'blog_posts',
  'glossary_terms',
  'videos',
  'our_customers',
  'tools',
  'review_sources',
  'customer_reviews',
  'podcasts',
  'faq_questions',
  'faq_topics',
  'customer_stories',
  'ebooks',
  'webinars',
  'team_members',
  'media_assets',
  'cms_users',
]

async function main() {
  loadEnvLocal()

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  console.log('--- env check ---')
  console.log('FIREBASE_ADMIN_PROJECT_ID    :', projectId || '(missing)')
  console.log('FIREBASE_ADMIN_CLIENT_EMAIL  :', clientEmail || '(missing)')
  console.log('FIREBASE_ADMIN_PRIVATE_KEY   :', privateKey ? `(set, ${privateKey.length} chars)` : '(missing)')
  if (!projectId || !clientEmail || !privateKey) {
    console.error('\n[fail] Missing one or more Firebase Admin env vars.')
    process.exit(1)
  }
  privateKey = privateKey.replace(/\\n/g, '\n')

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  }
  const db = getFirestore()

  console.log('\n--- listing root collections ---')
  let roots
  try {
    roots = await db.listCollections()
  } catch (err) {
    console.error('[fail] listCollections error:', err.code || err.name, err.message)
    if (String(err.message || '').includes('NOT_FOUND') || err.code === 5) {
      console.error('\n>> Firestore database has NOT been created in your Firebase project.')
      console.error('>> Open: https://console.firebase.google.com/project/' + projectId + '/firestore')
      console.error('>> Click "Create database" → choose region → "Start in production mode" → Create.')
    }
    process.exit(2)
  }
  if (roots.length === 0) {
    console.log('(no root collections — database is reachable but empty)')
  } else {
    for (const c of roots) console.log(' •', c.id)
  }

  console.log('\n--- doc counts in known CMS collections ---')
  let total = 0
  for (const name of COLLECTIONS) {
    try {
      const snap = await db.collection(name).count().get()
      const n = snap.data().count
      total += n
      console.log(`  ${String(n).padStart(5)}  ${name}`)
    } catch (err) {
      console.log(`   err  ${name}  (${err.code || err.message})`)
    }
  }
  console.log(`\n  total documents across known CMS collections: ${total}`)

  if (total === 0) {
    console.log('\n>> Firestore is reachable but has no CMS documents yet.')
    console.log('>> Sign in at /admin/login and create something via /admin/cms or /admin/settings/users.')
    console.log('>> Then refresh the Firebase console: https://console.firebase.google.com/project/' + projectId + '/firestore/data')
  }

  process.exit(0)
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(99)
})
