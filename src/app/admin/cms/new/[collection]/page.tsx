import { notFound } from 'next/navigation'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import {
  getCreateProfile,
  getCreateProfileFields,
} from '@/lib/cms/createProfiles'
import { listReferenceOptions } from '@/lib/cms/collectionRepository'
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

  const referenceOptions: Record<string, ReferenceOption[]> = {}
  for (const field of fields) {
    if (
      (field.type === 'reference' || field.type === 'multi_reference') &&
      field.referenceCollection
    ) {
      const opts = await listReferenceOptions(field.referenceCollection)
      referenceOptions[field.name] = opts.map((o) => ({ id: o.id, label: o.label }))
    }
  }

  const boundAction = async (formData: FormData) => {
    'use server'
    return createCmsDraft(definition.key, formData)
  }

  return (
    <div className="min-h-dvh bg-[#f7f3ee]">
      <CmsCreateForm
        profile={profile}
        fields={fields}
        titleField={definition.titleField}
        collectionLabel={definition.label}
        collectionKey={definition.key}
        referenceOptions={referenceOptions}
        action={boundAction}
      />
    </div>
  )
}
