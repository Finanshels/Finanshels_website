import 'server-only'
import { NextResponse } from 'next/server'
import { requireAdminAuth, sessionRole } from '@/lib/cms/adminAuth'
import { getCmsCollectionDefinition, getAllFields } from '@/lib/cms/collectionDefinitions'
import { upsertCmsDocument } from '@/lib/cms/collectionRepository'
import { decodeFieldValue, InvalidFieldValueError } from '@/lib/cms/fieldCodec'
import type { CmsCollectionKey } from '@/lib/cms/collectionDefinitions'

export async function POST(request: Request) {
  let session
  try {
    session = await requireAdminAuth()
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const collectionRaw = String(body.collection ?? '')
  const slug = String(body.slug ?? '').trim()

  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !slug) {
    return NextResponse.json({ error: 'Invalid collection or slug' }, { status: 400 })
  }

  const role = sessionRole(session)
  const fields = getAllFields(definition)
  const parsed: Record<string, unknown> = {}

  try {
    for (const field of fields) {
      // FIX-051: autosave never writes workflow status — that's an explicit
      // action. The client also strips it; this is defense in depth.
      if (field.name === 'status') continue
      const raw = body[field.name]
      if (raw === undefined) continue
      if (field.type === 'multi_reference') {
        const parts = Array.isArray(raw)
          ? raw.map(String)
          : String(raw).split(',').map((s) => s.trim())
        parsed[field.name] = [...new Set(parts.filter(Boolean))]
        continue
      }
      parsed[field.name] = decodeFieldValue(field, String(raw))
    }
  } catch (err) {
    if (err instanceof InvalidFieldValueError) {
      return NextResponse.json({ error: `Invalid field: ${err.fieldName}` }, { status: 422 })
    }
    throw err
  }

  // FIX-051: do not set status here. upsert merges, so leaving it out preserves
  // the stored workflow status instead of reverting it to a stale client value.

  try {
    // PERF: autosave fires every few seconds. Don't snapshot a revision on each
    // tick — that doubled writes and bloated `_revisions` (which slows every
    // editor open). Explicit saves/publishes still create revision checkpoints.
    await upsertCmsDocument(definition.key as CmsCollectionKey, slug, parsed, role, {
      snapshotRevision: false,
    })
  } catch (err) {
    console.error('[autosave] upsert failed', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() })
}
