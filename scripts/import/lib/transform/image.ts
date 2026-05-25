import type { AssetMigrator } from '../assetMigrator'

export interface CmsImageValue {
  url: string
  alt: string
  storagePath?: string
}

export interface TransformImageContext {
  collection: string
  slug: string
}

export async function transformImage(
  value: unknown,
  ctx: TransformImageContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<CmsImageValue | null> {
  let sourceUrl = ''
  let alt = ''

  if (typeof value === 'string' && value.trim()) {
    sourceUrl = value
  } else if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    sourceUrl = typeof v.url === 'string' ? v.url : ''
    alt = typeof v.alt === 'string' ? v.alt : ''
  }

  if (!sourceUrl) return null

  const migrated = await migrator.migrate({
    sourceUrl,
    collection: ctx.collection,
    slug: ctx.slug,
  })
  if (!migrated) return null

  return {
    url: migrated.url,
    alt,
    storagePath: migrated.storagePath,
  }
}
