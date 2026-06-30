import type { CmsBlockType } from '@/lib/cms/collectionDefinitions'

// id is always assigned by defaultBlockValue/coerceInitial, so it is required.
export type BlockValue = Record<string, unknown> & { type: string; id: string }

export function safeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID().slice(0, 8)
  }
  return Math.random().toString(36).slice(2, 10)
}

/** Empty field-value map seeded from a block type's field schema. */
export function defaultBlockProps(type: CmsBlockType): Record<string, unknown> {
  const props: Record<string, unknown> = {}
  for (const field of type.fields) {
    if (field.type === 'boolean') props[field.name] = false
    else if (field.type === 'tags' || field.type === 'multi_reference') props[field.name] = []
    else props[field.name] = ''
  }
  return props
}

export function defaultBlockValue(type: CmsBlockType): BlockValue {
  return { type: type.type, id: safeId(), ...defaultBlockProps(type) }
}
