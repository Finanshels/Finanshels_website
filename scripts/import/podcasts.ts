import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
  transformNumber,
  transformDate,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'
import { transformRichText } from './lib/transform/richText'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247ae9'
const DEFAULT_PODCAST_NAME = 'Finanshels Podcast'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

function spotifyUrlFromEmbedId(embedId: string): { audioUrl: string; embedCode: string } {
  if (!embedId) return { audioUrl: '', embedCode: '' }
  const cleanId = embedId.trim()
  const audioUrl = `https://open.spotify.com/episode/${cleanId}`
  const embedCode = `<iframe src="https://open.spotify.com/embed/episode/${cleanId}" width="100%" height="232" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>`
  return { audioUrl, embedCode }
}

export async function importPodcasts(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} podcasts items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const episodeTitle = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? episodeTitle
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'podcasts', slug }
      const thumbnailImage = await transformImage(fd['image'], assetCtx, ctx.assetMigrator)
      const showNotes = await transformRichText(fd['description'], assetCtx, ctx.assetMigrator)

      const summary =
        transformDirect(fd['short-description']) ||
        transformDirect(fd['podcast-description'])

      const { audioUrl, embedCode } = spotifyUrlFromEmbedId(transformDirect(fd['spotify-embed-id']))
      const episodeNumber = transformNumber(transformDirect(fd['episode-no']))
      const hostName = transformDirect(fd['host-name'])

      const publishDate =
        transformDate(item.lastPublished) ??
        transformDate(item.createdOn)

      const data: Record<string, unknown> = {
        episode_title: episodeTitle,
        episode_number: episodeNumber,
        podcast_name: DEFAULT_PODCAST_NAME,
        audio_url: audioUrl,
        embed_code: embedCode,
        thumbnail_image: thumbnailImage,
        publish_date: publishDate,
        guests: hostName ? [hostName] : [],
        episode_summary: summary,
        show_notes: showNotes,
      }

      await ctx.writer.write({
        collection: 'podcasts',
        slug,
        data,
      })

      ctx.referenceMap.set('podcasts', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}${episodeNumber ? `  (#${episodeNumber})` : ''}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
