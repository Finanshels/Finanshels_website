export interface MigrateParams {
  sourceUrl: string
  collection: string
  slug: string
}

export interface MigrateResult {
  url: string
  storagePath: string
  size: number
  sourceUrl: string
}

/**
 * Upload contract for the asset migrator.
 *
 * NOTE: This intentionally differs from the real `uploadCmsMediaBytes` in
 * `src/lib/cms/storageUpload.ts`. The real function's signature is:
 *
 *   uploadCmsMediaBytes({ buffer, originalFilename, slug, contentType })
 *     => Promise<{ url, byteSize }>
 *
 * The orchestrator (Task 13) is responsible for adapting the real function to
 * this `UploadFn` shape — combining `collection`/`slug` into the real `slug`
 * argument (e.g. `${collection}/${slug}/${filename}`) and mapping `byteSize`
 * to `size` plus synthesising `storagePath`. Keeping this interface
 * collection-aware lets the migrator stay unit-testable without Firebase
 * Storage credentials and lets future callers reuse it with non-Firebase
 * uploaders (S3, R2, etc.).
 */
export interface UploadFn {
  (params: {
    bytes: Buffer
    filename: string
    contentType: string
    collection: string
    slug: string
  }): Promise<{ url: string; storagePath: string; size: number }>
}

export interface AssetMigratorOptions {
  fetch?: typeof fetch
  upload: UploadFn
  dryRun?: boolean
}

export interface AssetMigrator {
  migrate(params: MigrateParams): Promise<MigrateResult | null>
}

function inferFilename(url: string): string {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop() ?? 'asset'
    return last.replace(/[^A-Za-z0-9._-]/g, '_')
  } catch {
    return 'asset'
  }
}

export function createAssetMigrator(opts: AssetMigratorOptions): AssetMigrator {
  const fetchFn = opts.fetch ?? globalThis.fetch

  return {
    async migrate({ sourceUrl, collection, slug }) {
      if (!sourceUrl || typeof sourceUrl !== 'string') return null

      const filename = inferFilename(sourceUrl)

      if (opts.dryRun) {
        return {
          url: `DRY-RUN://cms-media/${collection}/${slug}/${filename}`,
          storagePath: `cms-media/${collection}/${slug}/${filename}`,
          size: 0,
          sourceUrl,
        }
      }

      const res = await fetchFn(sourceUrl)
      if (!res.ok) {
        throw new Error(`Asset fetch failed ${res.status}: ${sourceUrl}`)
      }
      const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
      const bytes = Buffer.from(await res.arrayBuffer())

      const uploaded = await opts.upload({
        bytes,
        filename,
        contentType,
        collection,
        slug,
      })

      return {
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        size: uploaded.size,
        sourceUrl,
      }
    },
  }
}
