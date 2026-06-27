// Wipe CMS content collections so the Webflow migration can be re-run from a
// clean slate. Deletes every document (and its `_revisions` subcollection) in
// the CMS content collections listed below.
//
//   node scripts/wipe-cms.mjs            # DRY RUN — counts only, deletes nothing
//   node scripts/wipe-cms.mjs --confirm  # actually deletes
//
// SAFETY: this script deliberately NEVER touches these collections:
//   - cms_users               (admin/owner logins — wiping this locks you out)
//   - landing_pages           (landing-page builder content, not Webflow CMS)
//   - landing_page_leads      (captured leads — real customer data)
//   - landing_page_rate_limits
//   - redirects               (Webflow redirect map; re-imported separately)
import { readFileSync } from 'node:fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// The 14 collections in CmsCollectionKey (src/lib/cms/collectionDefinitions.ts).
// These are exactly the collections the Webflow importer repopulates.
const CONTENT_COLLECTIONS = [
  'media_assets',
  'our_customers',
  'tools',
  'customer_reviews',
  'podcasts',
  'faqs',
  'customer_stories',
  'ebooks',
  'webinars',
  'glossary_terms',
  'blog_posts',
  'team_members',
  'videos',
  'review_sources',
]

// Never delete these — printed in the report for transparency.
const PRESERVED_COLLECTIONS = [
  'cms_users',
  'landing_pages',
  'landing_page_leads',
  'landing_page_rate_limits',
  'redirects',
]

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

async function countCollection(db, name) {
  const snap = await db.collection(name).count().get()
  return snap.data().count
}

async function main() {
  const confirm = process.argv.includes('--confirm')
  loadEnvLocal()

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    console.error('[fail] Missing one or more Firebase Admin env vars (FIREBASE_ADMIN_*).')
    process.exit(1)
  }
  privateKey = privateKey.replace(/\\n/g, '\n')

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
  }
  const db = getFirestore()

  console.log(`\n=== CMS wipe (${confirm ? 'LIVE — will delete' : 'DRY RUN — counts only'}) ===`)
  console.log(`project: ${projectId}\n`)

  console.log('--- preserved (never touched) ---')
  for (const name of PRESERVED_COLLECTIONS) {
    try {
      const n = await countCollection(db, name)
      console.log(`  keep   ${String(n).padStart(6)}  ${name}`)
    } catch (err) {
      console.log(`  keep      err  ${name}  (${err.code || err.message})`)
    }
  }

  console.log('\n--- content collections to wipe ---')
  let totalDocs = 0
  const nonEmpty = []
  for (const name of CONTENT_COLLECTIONS) {
    try {
      const n = await countCollection(db, name)
      totalDocs += n
      if (n > 0) nonEmpty.push(name)
      console.log(`  wipe   ${String(n).padStart(6)}  ${name}`)
    } catch (err) {
      console.log(`  wipe      err  ${name}  (${err.code || err.message})`)
    }
  }
  console.log(`\n  total documents targeted: ${totalDocs}`)

  if (!confirm) {
    console.log('\n[dry run] Nothing was deleted.')
    console.log('[dry run] Re-run with --confirm to delete the documents above (and their _revisions).')
    process.exit(0)
  }

  if (totalDocs === 0) {
    console.log('\nNothing to delete — content collections are already empty.')
    process.exit(0)
  }

  console.log('\n--- deleting (recursive: docs + _revisions) ---')
  let deletedCollections = 0
  for (const name of nonEmpty) {
    process.stdout.write(`  deleting ${name} ... `)
    // recursiveDelete uses a BulkWriter and removes every doc + all subcollections.
    await db.recursiveDelete(db.collection(name))
    deletedCollections += 1
    console.log('done')
  }

  console.log('\n--- verify (post-delete counts) ---')
  let remaining = 0
  for (const name of CONTENT_COLLECTIONS) {
    const n = await countCollection(db, name)
    remaining += n
    if (n > 0) console.log(`  !! ${String(n).padStart(6)}  ${name}  (still has docs)`)
  }
  console.log(
    remaining === 0
      ? `\n✓ All ${totalDocs} documents across ${deletedCollections} collections deleted.`
      : `\n!! ${remaining} document(s) remain — re-run to retry.`
  )
  process.exit(remaining === 0 ? 0 : 3)
}

main().catch((err) => {
  console.error('[fatal]', err)
  process.exit(99)
})
