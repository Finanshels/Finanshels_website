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

const WEBFLOW_COLLECTION_ID = '678e356372b3f78cb272e6ad'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importVideos(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} videos items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const videoTitle = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? videoTitle
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'videos', slug }
      // Prefer `image` (general thumbnail) over `poster` (File type often
      // restricted to PDF/uploads, not always a valid image).
      const thumbnailImage = await transformImage(fd['image'], assetCtx, ctx.assetMigrator)

      const videoUrl = transformDirect(fd['video-link'])
      if (!videoUrl) {
        ctx.report.recordWarning({
          webflowId: item.id,
          message: `missing video-link; doc imported with empty video_url`,
        })
      }

      const data: Record<string, unknown> = {
        video_title: videoTitle,
        video_url: videoUrl,
        thumbnail_image: thumbnailImage,
        featured: false,
      }

      await ctx.writer.write({
        collection: 'videos',
        slug,
        data,
      })

      ctx.referenceMap.set('videos', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
