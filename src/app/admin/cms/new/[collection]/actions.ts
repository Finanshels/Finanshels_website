'use server'

import { redirect } from 'next/navigation'
import {
  getCmsCollectionDefinition,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import { getCreateProfile, getCreateProfileFields } from '@/lib/cms/createProfiles'
import { getCmsDocument, upsertCmsDocument } from '@/lib/cms/collectionRepository'
import { decodeFieldValue, InvalidFieldValueError } from '@/lib/cms/fieldCodec'
import { requireAdminAuth, sessionDisplayName } from '@/lib/cms/adminAuth'
import { slugifyForCms } from '@/lib/cms/slugify'

export async function createCmsDraft(
  collectionKey: CmsCollectionKey,
  formData: FormData
): Promise<{ ok: false; error: string } | void> {
  const session = await requireAdminAuth()
  const definition = getCmsCollectionDefinition(collectionKey)
  if (!definition) return { ok: false, error: `Unknown collection ${collectionKey}` }

  const profile = getCreateProfile(collectionKey)
  const fields = getCreateProfileFields(profile, definition)

  const titleRaw = String(formData.get(definition.titleField) ?? '').trim()
  if (!titleRaw) {
    return { ok: false, error: `${definition.titleField} is required` }
  }

  const slug = slugifyForCms(titleRaw)
  if (!slug) {
    return { ok: false, error: 'Could not derive a URL slug from the title' }
  }

  const collision = await getCmsDocument(collectionKey, slug)
  if (collision) {
    return { ok: false, error: `A document with slug "${slug}" already exists` }
  }

  const templateId = String(formData.get('templateId') ?? '')
  const template = profile.templates?.find((t) => t.id === templateId)
  const payload: Record<string, unknown> = { ...(template?.values ?? {}) }

  try {
    for (const field of fields) {
      const raw = formData.get(field.name)
      if (raw === null) continue
      const value = decodeFieldValue(field, typeof raw === 'string' ? raw : '')
      if (value !== undefined) payload[field.name] = value
    }
  } catch (err) {
    if (err instanceof InvalidFieldValueError) return { ok: false, error: err.message }
    throw err
  }

  payload[definition.slugField] = slug
  payload.status = 'draft'

  await upsertCmsDocument(collectionKey, slug, payload, sessionDisplayName(session))
  redirect(
    `/admin/cms?collection=${collectionKey}&slug=${encodeURIComponent(slug)}&saved=created`
  )
}
