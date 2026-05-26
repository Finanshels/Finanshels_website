import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
  transformDate,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247afa'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importCustomerReviews(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} customer_reviews items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const reviewTitle = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? reviewTitle
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'customer_reviews', slug }
      const customerPhoto = await transformImage(fd['client-image'], assetCtx, ctx.assetMigrator)

      const reviewDate =
        transformDate(item.lastPublished) ??
        transformDate(item.createdOn)

      // Webflow `review-source` is a reference to the reviews-source collection
      // (e.g. Google, Trustpilot). Firestore customer_reviews has no direct
      // field for it — dropped. The `source-link` URL becomes
      // `video_review_url` (it's the original external review URL).

      const data: Record<string, unknown> = {
        review_title: reviewTitle,
        customer_name: transformDirect(fd['client-name']),
        customer_designation: transformDirect(fd['designation']),
        review_text: transformDirect(fd['review']),
        video_review_url: transformDirect(fd['source-link']),
        customer_photo: customerPhoto,
        review_date: reviewDate,
        approved_for_publication: true,
      }

      await ctx.writer.write({
        collection: 'customer_reviews',
        slug,
        data,
      })

      ctx.referenceMap.set('customer_reviews', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
