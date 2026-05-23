/**
 * Writer wraps an injected upsert function so the orchestrator can stay
 * decoupled from Firestore in tests and dry-run mode.
 *
 * NOTE on signature divergence: the real `upsertCmsDocument` in
 * `src/lib/cms/collectionRepository.ts` takes positional args
 * `(collection, id, payload, updatedBy)` and returns `Promise<void>`.
 * This writer declares a params-object shape because that is friendlier
 * for orchestration, mocking, and future extension. Task 13 (orchestrator)
 * will provide a small adapter that translates this shape into the
 * positional call and synthesizes the `{slug, id}` result from the inputs.
 */

export type CmsDocStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published'

export interface UpsertParams {
  collection: string
  slug: string
  data: Record<string, unknown>
  status?: CmsDocStatus
  updatedBy?: string
}

export interface UpsertResult {
  slug: string
  id: string
}

export interface UpsertFn {
  (params: UpsertParams): Promise<UpsertResult>
}

export interface WriterOptions {
  upsert: UpsertFn
  dryRun?: boolean
  defaultStatus?: CmsDocStatus
  updatedBy?: string
}

export interface WriteParams {
  collection: string
  slug: string
  data: Record<string, unknown>
  status?: CmsDocStatus
}

export interface Writer {
  write(params: WriteParams): Promise<UpsertResult | null>
}

export function createWriter(opts: WriterOptions): Writer {
  const defaultStatus: CmsDocStatus = opts.defaultStatus ?? 'published'
  const updatedBy = opts.updatedBy ?? 'webflow-importer'

  return {
    async write({ collection, slug, data, status }) {
      const effectiveStatus = status ?? defaultStatus
      if (opts.dryRun) {
        return { slug, id: `dry-run-${slug}` }
      }
      return await opts.upsert({
        collection,
        slug,
        data,
        status: effectiveStatus,
        updatedBy,
      })
    },
  }
}
