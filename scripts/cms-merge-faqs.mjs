// One-time migration for the May-2026 CMS consolidation:
//
//   1. Merge `faq_questions` + `faq_topics`  ->  single `faqs` collection
//      - Reads each topic into a map: { topicId -> { name, slug } }
//      - For each question, writes a `faqs/<docId>` doc with the original
//        fields plus `topic` (topic name) and `topic_slug`.
//      - Drops the now-stale `topicRef` / `faq_topic` reference fields.
//   2. Removes the empty `videos` and `review_sources` collections (caller
//      confirmed no production data exists).
//
// Run with:
//   node scripts/cms-merge-faqs.mjs                # dry-run, prints what would change
//   node scripts/cms-merge-faqs.mjs --apply        # write new `faqs/*` docs
//   node scripts/cms-merge-faqs.mjs --apply --delete-old
//                                                  # also delete old faq_* + videos + review_sources docs
//
// Safe to re-run: writes use slug as doc id (idempotent). Use --delete-old in
// a second run after manual verification that the new collection looks right.

import { readFileSync } from 'node:fs'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const OLD_FAQ_QUESTIONS = 'faq_questions'
const OLD_FAQ_TOPICS = 'faq_topics'
const NEW_FAQS = 'faqs'
const ZERO_DATA_COLLECTIONS = ['videos', 'review_sources']

const TOPIC_REF_FIELDS = ['topicRef', 'faq_topic']
const STRIP_FROM_FAQ = new Set([...TOPIC_REF_FIELDS, 'featuredQuestionRefs', 'relatedTopicRefs'])

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

async function loadTopicMap(db) {
  const snap = await db.collection(OLD_FAQ_TOPICS).get()
  const map = new Map()
  for (const doc of snap.docs) {
    const data = doc.data() ?? {}
    const name =
      (typeof data.topic_name === 'string' && data.topic_name) ||
      (typeof data.name === 'string' && data.name) ||
      (typeof data.title === 'string' && data.title) ||
      ''
    const slug = typeof data.slug === 'string' && data.slug ? data.slug : doc.id
    map.set(doc.id, { name, slug })
  }
  return map
}

function resolveTopicId(question) {
  for (const field of TOPIC_REF_FIELDS) {
    const value = question[field]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function buildFaqDoc(question, topicMap) {
  const out = {}
  for (const [key, value] of Object.entries(question)) {
    if (STRIP_FROM_FAQ.has(key)) continue
    out[key] = value
  }
  const topicId = resolveTopicId(question)
  if (topicId) {
    const topic = topicMap.get(topicId)
    if (topic) {
      out.topic = topic.name || topicId
      out.topic_slug = topic.slug
    } else {
      out.topic = ''
      out.topic_slug = topicId
    }
  }
  return out
}

async function migrateFaqs(db, { apply }) {
  const topicMap = await loadTopicMap(db)
  const questionsSnap = await db.collection(OLD_FAQ_QUESTIONS).get()
  const stats = {
    totalQuestions: questionsSnap.size,
    totalTopics: topicMap.size,
    written: 0,
    topicless: 0,
    unresolvedTopic: 0,
  }

  for (const doc of questionsSnap.docs) {
    const question = doc.data() ?? {}
    const newDoc = buildFaqDoc(question, topicMap)
    const topicId = resolveTopicId(question)
    if (!topicId) stats.topicless++
    else if (!topicMap.has(topicId)) stats.unresolvedTopic++

    const targetSlug =
      typeof question.slug === 'string' && question.slug ? question.slug : doc.id

    if (apply) {
      await db.collection(NEW_FAQS).doc(targetSlug).set(newDoc, { merge: true })
      stats.written++
    } else {
      console.log(
        `[dry-run] would write faqs/${targetSlug} (topic="${newDoc.topic ?? ''}", topic_slug="${newDoc.topic_slug ?? ''}")`
      )
      stats.written++
    }
  }

  console.log('\n=== FAQ merge summary ===')
  console.log(`  topics loaded:           ${stats.totalTopics}`)
  console.log(`  questions read:          ${stats.totalQuestions}`)
  console.log(`  faqs ${apply ? 'written' : 'would-write'}:        ${stats.written}`)
  console.log(`  questions w/o topicRef:  ${stats.topicless}`)
  console.log(`  questions w/ stale ref:  ${stats.unresolvedTopic}`)
}

async function deleteCollection(db, name) {
  const snap = await db.collection(name).get()
  if (snap.empty) {
    console.log(`  ${name}: empty, nothing to delete`)
    return
  }
  let deleted = 0
  let batch = db.batch()
  let inBatch = 0
  for (const doc of snap.docs) {
    batch.delete(doc.ref)
    inBatch++
    if (inBatch === 400) {
      await batch.commit()
      deleted += inBatch
      batch = db.batch()
      inBatch = 0
    }
  }
  if (inBatch > 0) {
    await batch.commit()
    deleted += inBatch
  }
  console.log(`  ${name}: deleted ${deleted} docs`)
}

async function main() {
  const apply = process.argv.includes('--apply')
  const deleteOld = process.argv.includes('--delete-old')
  const db = initFirebase()

  console.log(
    `Mode: ${apply ? 'APPLY (writes)' : 'DRY-RUN'}${deleteOld ? ' + DELETE-OLD' : ''}`
  )

  await migrateFaqs(db, { apply })

  if (deleteOld) {
    if (!apply) {
      console.log('\n[skip] --delete-old requires --apply too. Re-run with both flags.')
      return
    }
    console.log('\n=== Deleting old collections ===')
    await deleteCollection(db, OLD_FAQ_QUESTIONS)
    await deleteCollection(db, OLD_FAQ_TOPICS)
    for (const name of ZERO_DATA_COLLECTIONS) {
      await deleteCollection(db, name)
    }
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
