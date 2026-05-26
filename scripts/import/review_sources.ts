import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247afb'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importReviewSources(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} review_sources items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const sourceName = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? sourceName
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'review_sources', slug }
      const icon = await transformImage(fd['icon-image'], assetCtx, ctx.assetMigrator)

      const data: Record<string, unknown> = {
        source_name: sourceName,
        icon,
      }

      await ctx.writer.write({
        collection: 'review_sources',
        slug,
        data,
      })

      ctx.referenceMap.set('review_sources', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}  (${sourceName})\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
