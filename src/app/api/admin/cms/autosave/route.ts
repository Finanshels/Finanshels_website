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
  const currentStatus = String(body.currentStatus ?? 'draft')

  const definition = getCmsCollectionDefinition(collectionRaw)
  if (!definition || !slug) {
    return NextResponse.json({ error: 'Invalid collection or slug' }, { status: 400 })
  }

  const role = sessionRole(session)
  const fields = getAllFields(definition)
  const parsed: Record<string, unknown> = {}

  try {
    for (const field of fields) {
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

  parsed.status = currentStatus

  try {
    await upsertCmsDocument(definition.key as CmsCollectionKey, slug, parsed, role)
  } catch (err) {
    console.error('[autosave] upsert failed', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() })
}
