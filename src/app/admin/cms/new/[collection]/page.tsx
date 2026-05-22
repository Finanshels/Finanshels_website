import { notFound } from 'next/navigation'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import {
  getCreateProfile,
  getCreateProfileFields,
} from '@/lib/cms/createProfiles'
import {
  listCmsMediaLibraryItems,
  listReferenceOptions,
} from '@/lib/cms/collectionRepository'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import CmsCreateForm, { type ReferenceOption } from '@/components/cms/admin/CmsCreateForm'
import { createCmsDraft } from './actions'

export const dynamic = 'force-dynamic'

type Params = Promise<{ collection: string }>

export default async function NewCmsDocumentPage({ params }: { params: Params }) {
  await requireAdminAuth()
  const { collection } = await params
  const definition = CMS_COLLECTION_DEFINITION_MAP[collection as CmsCollectionKey]
  if (!definition) notFound()

  const profile = getCreateProfile(definition.key)
  const fields = getCreateProfileFields(profile, definition)

  // FIX-039: key reference options by collection (matching FieldEditor's contract),
  // deduped across multi/single-ref fields that hit the same collection.
  const referencedCollections = [
    ...new Set(
      fields
        .filter((f) => (f.type === 'reference' || f.type === 'multi_reference') && Boolean(f.referenceCollection))
        .map((f) => f.referenceCollection as CmsCollectionKey)
    ),
  ]

  const [referenceEntries, mediaLibraryItems] = await Promise.all([
    Promise.all(
      referencedCollections.map(async (key) => {
        const opts = await listReferenceOptions(key)
        return [key, opts.map((o) => ({ id: o.id, label: o.label }))] as const
      })
    ),
    listCmsMediaLibraryItems(120),
  ])
  const referenceOptions: Record<string, ReferenceOption[]> = Object.fromEntries(referenceEntries)
  const mediaAssetUrls = [
    ...new Set(
      mediaLibraryItems
        .map((item) => (typeof item.assetUrl === 'string' ? item.assetUrl : ''))
        .filter(Boolean)
    ),
  ]

  const boundAction = async (formData: FormData) => {
    'use server'
    return createCmsDraft(definition.key, formData)
  }

  return (
    <div className="min-h-dvh bg-cms-canvas">
      <CmsCreateForm
        profile={profile}
        fields={fields}
        titleField={definition.titleField}
        collectionLabel={definition.label}
        collectionKey={definition.key}
        referenceOptions={referenceOptions}
        mediaAssetUrls={mediaAssetUrls}
        action={boundAction}
      />
    </div>
  )
}
