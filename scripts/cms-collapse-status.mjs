// One-time migration: collapse the CMS status enum from 6 values to 3.
//
//   scheduled, approved  -> in_review
//   archived             -> draft
//   draft, in_review, published  -> unchanged
//
// Also clears `scheduledAt` (scheduled publishing is being removed).
//
// Run with:
//   node scripts/cms-collapse-status.mjs           # dry-run, prints counts
//   node scripts/cms-collapse-status.mjs --apply   # actually writes changes
//
// Does NOT touch the separate `landing_pages` system (which keeps `archived`).

import { readFileSync } from 'node:fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, Timestamp } from 'firebase-admin/firestore'

const COLLECTIONS = [
  'media_assets',
  'blog_posts',
  'glossary_terms',
  'our_customers',
  'tools',
  'customer_reviews',
  'podcasts',
  'faqs',
  'customer_stories',
  'ebooks',
  'webinars',
  'team_members',
]

const STATUS_MAP = {
  scheduled: 'in_review',
  approved: 'in_review',
  archived: 'draft',
}

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
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    console.warn('[warn] could not read .env.local:', err.message)
  }
}

function initFirebase() {
  loadEnvLocal()
  const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    })
  }
  return getFirestore()
}

async function migrateCollection(db, collection, apply) {
  const snap = await db.collection(collection).get()
  const stats = { total: snap.size, changed: 0, byMapping: {} }
  let batch = db.batch()
  let pending = 0
  for (const doc of snap.docs) {
    const data = doc.data() || {}
    const currentStatus = typeof data.status === 'string' ? data.status : null
    const hasScheduledAt = data.scheduledAt != null
    const mappedStatus = currentStatus && STATUS_MAP[currentStatus] ? STATUS_MAP[currentStatus] : null
    if (!mappedStatus && !hasScheduledAt) continue
    stats.changed += 1
    if (mappedStatus) {
      const key = `${currentStatus} -> ${mappedStatus}`
      stats.byMapping[key] = (stats.byMapping[key] || 0) + 1
    }
    if (hasScheduledAt && !mappedStatus) {
      stats.byMapping['clear scheduledAt only'] = (stats.byMapping['clear scheduledAt only'] || 0) + 1
    }
    if (apply) {
      const patch = { updatedAt: Timestamp.now() }
      if (mappedStatus) patch.status = mappedStatus
      if (hasScheduledAt) patch.scheduledAt = null
      batch.set(doc.ref, patch, { merge: true })
      pending += 1
      if (pending >= 400) {
        await batch.commit()
        batch = db.batch()
        pending = 0
      }
    }
  }
  if (apply && pending > 0) await batch.commit()
  return stats
}

async function main() {
  const apply = process.argv.includes('--apply')
  const db = initFirebase()
  console.log(apply ? '=== APPLYING migration ===' : '=== DRY RUN (no writes) — pass --apply to commit ===')
  let totalDocs = 0
  let totalChanged = 0
  for (const collection of COLLECTIONS) {
    const stats = await migrateCollection(db, collection, apply)
    totalDocs += stats.total
    totalChanged += stats.changed
    if (stats.changed === 0) {
      console.log(`  ${collection.padEnd(20)} ${stats.total.toString().padStart(4)} docs   (no changes)`)
    } else {
      console.log(`  ${collection.padEnd(20)} ${stats.total.toString().padStart(4)} docs   ${stats.changed} changed`)
      for (const [k, v] of Object.entries(stats.byMapping)) {
        console.log(`    - ${k}: ${v}`)
      }
    }
  }
  console.log('---')
  console.log(`Total: ${totalDocs} docs, ${totalChanged} would change${apply ? ' (committed)' : ''}`)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
