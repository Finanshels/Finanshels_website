// Read-only Firestore sampler for the CMS audit.
// Outputs docs/cms/admin-audit.data.json with population stats per field per collection.
// Run with: node scripts/cms-audit/sample-firestore.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const SAMPLE_LIMIT = 200
const OUTPUT_PATH = new URL('../../docs/cms/admin-audit.data.json', import.meta.url)

function loadEnvLocal() {
  try {
    const txt = readFileSync(new URL('../../.env.local', import.meta.url), 'utf8')
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

function normalizePrivateKey(input) {
  if (!input) return ''
  let key = input
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1)
  }
  if (!key.includes('-----BEGIN')) {
    try {
      const decoded = Buffer.from(key, 'base64').toString('utf8')
      if (decoded.includes('-----BEGIN')) key = decoded
    } catch {}
  }
  key = key.replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\r\n/g, '\n')
  return key.trim() + '\n'
}

function getDb() {
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    throw new Error('CMS env not configured (FIREBASE_ADMIN_* missing)')
  }
  if (!getApps().length) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY),
      }),
    })
  }
  return getFirestore()
}

loadEnvLocal()
const db = getDb()
console.log('[ok] firestore initialized for project', process.env.FIREBASE_ADMIN_PROJECT_ID)

// Mirror of CMS collection keys from src/lib/cms/collectionDefinitions.ts.
// We intentionally do NOT mirror the field list here — the script discovers
// stored keys empirically and the audit doc cross-references the source file.
const COLLECTIONS = [
  'media_assets',
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
  'glossary_terms',
  'blog_posts',
  'team_members',
]

function isPopulated(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') {
    if (typeof value.toDate === 'function') return true
    return Object.keys(value).length > 0
  }
  if (typeof value === 'number') return Number.isFinite(value)
  return Boolean(value)
}

async function sampleCollection(collectionId) {
  let snapshot
  try {
    snapshot = await db.collection(collectionId).limit(SAMPLE_LIMIT).get()
  } catch (err) {
    return { error: err.message }
  }
  const totalSampled = snapshot.size
  const keyCounts = new Map()
  for (const doc of snapshot.docs) {
    const data = doc.data()
    for (const key of Object.keys(data)) {
      if (isPopulated(data[key])) {
        keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1)
      } else {
        keyCounts.set(key, keyCounts.get(key) ?? 0)
      }
    }
  }
  const populationByKey = {}
  for (const [key, count] of keyCounts.entries()) {
    populationByKey[key] = totalSampled === 0 ? 0 : Number((count / totalSampled).toFixed(3))
  }
  return { totalSampled, populationByKey }
}

async function main() {
  const sampledAt = new Date().toISOString()
  const collections = {}
  for (const id of COLLECTIONS) {
    process.stdout.write(`[..] ${id} `)
    const result = await sampleCollection(id)
    collections[id] = result
    if (result.error) console.log(`error: ${result.error}`)
    else console.log(`sampled ${result.totalSampled}, ${Object.keys(result.populationByKey).length} distinct keys`)
  }
  const outFile = fileURLToPath(OUTPUT_PATH)
  mkdirSync(dirname(outFile), { recursive: true })
  writeFileSync(outFile, JSON.stringify({ sampledAt, sampleLimit: SAMPLE_LIMIT, collections }, null, 2) + '\n')
  console.log(`[ok] wrote ${outFile}`)
}

main().catch((err) => {
  console.error('[fail]', err)
  process.exit(1)
})
