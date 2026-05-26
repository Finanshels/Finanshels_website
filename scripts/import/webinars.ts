import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
  transformBoolean,
  transformDate,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'
import { transformRichText } from './lib/transform/richText'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247af0'
const DEFAULT_TIMEZONE = 'Asia/Dubai'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importWebinars(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} webinars items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const title = transformDirect(fd['name']) || transformDirect(fd['long-title'])
      const rawSlug = fd['slug'] ?? title
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'webinars', slug }
      const bannerImage = await transformImage(fd['banner'], assetCtx, ctx.assetMigrator)
      const description = await transformRichText(fd['random'], assetCtx, ctx.assetMigrator)

      const startDatetime =
        transformDate(fd['webinar-date']) ??
        transformDate(item.lastPublished) ??
        transformDate(item.createdOn)

      const isUpcoming = transformBoolean(fd['upcoming-event'])
      const webinarStatus = isUpcoming ? 'upcoming' : 'completed'

      const speakersTag = [transformDirect(fd['speakers']), transformDirect(fd['speaker2'])]
        .filter(Boolean)
      const categoryTag = transformDirect(fd['category-tag'])
      const keyTopics = categoryTag ? [categoryTag] : []

      const data: Record<string, unknown> = {
        webinar_title: title,
        webinar_status: webinarStatus,
        banner_image: bannerImage,
        summary: transformDirect(fd['short-description-2']),
        description,
        start_datetime: startDatetime,
        timezone: DEFAULT_TIMEZONE,
        recording_url: transformDirect(fd['video-url']),
        key_topics: keyTopics,
        featured: transformBoolean(fd['featured']),
        speakers_text: speakersTag,
      }

      await ctx.writer.write({
        collection: 'webinars',
        slug,
        data,
      })

      ctx.referenceMap.set('webinars', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}  [${webinarStatus}]\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
