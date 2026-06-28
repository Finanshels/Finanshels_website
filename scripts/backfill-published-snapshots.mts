/**
 * One-time backfill for the two-version draft/publish workflow.
 *
 * For every PUBLISHED doc (landing pages + all CMS collections) that has no
 * `_published/current` snapshot yet, copy its current fields into the snapshot
 * and denormalise the published card onto the parent. Idempotent — re-running
 * only fills gaps; it never overwrites an existing snapshot.
 *
 * Run (hits the configured Firestore — production in this repo):
 *   node --conditions=react-server --import tsx scripts/backfill-published-snapshots.mts
 *
 * The two-version public reads fall back to the draft when a snapshot is
 * missing, so running this is safe at any time and pages never break mid-rollout.
 */
import { readFileSync } from 'node:fs'

function loadEnvLocal(): void {
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
    console.warn('[warn] could not read .env.local:', (err as Error).message)
  }
}

// Env must be loaded BEFORE importing the Firestore modules (they read it at
// init), so the imports are dynamic and happen after loadEnvLocal().
loadEnvLocal()

const { getDb, COLLECTIONS } = await import('../src/lib/cms/firestore')
const { backfillSnapshotIfMissing } = await import('../src/lib/cms/publishWorkflow/operations')

async function main(): Promise<void> {
  const db = getDb()
  if (!db) {
    console.error('No Firestore connection — check FIREBASE_ADMIN_* env vars.')
    process.exit(1)
  }

  // All CMS collection names + the landing pages collection. Non-content
  // collections (media/team) simply have no published docs and are no-ops.
  const collections = Array.from(new Set([...Object.values(COLLECTIONS), 'landing_pages']))

  let created = 0
  let skipped = 0
  for (const coll of collections) {
    let snap
    try {
      snap = await db.collection(coll).where('status', '==', 'published').get()
    } catch (err) {
      console.warn(`[warn] ${coll}: query failed — ${(err as Error).message}`)
      continue
    }
    if (snap.empty) continue
    console.log(`\n${coll} — ${snap.size} published`)
    for (const doc of snap.docs) {
      const result = await backfillSnapshotIfMissing(coll, doc.id)
      if (result === 'created') created++
      else skipped++
      console.log(`  ${result === 'created' ? '✓ created' : '· skipped'}  ${doc.id}`)
    }
  }

  console.log(`\nDone. snapshots created=${created}, skipped=${skipped}`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
