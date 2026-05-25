import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import { transformDirect, transformSlug } from './lib/transform/primitives'
import { transformRichText } from './lib/transform/richText'
import { slugifyForCms } from '../../src/lib/cms/slugify'

const WEBFLOW_FAQ_QUESTIONS_COLLECTION_ID = '6478e2307e71b5438f247aea'
const WEBFLOW_FAQ_TOPIC_COLLECTION_ID = '6478e2307e71b5438f247af7'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

interface TopicEntry {
  name: string
  slug: string
}

async function buildTopicMap(webflow: WebflowClient): Promise<Map<string, TopicEntry>> {
  const topics = await webflow.listItems(WEBFLOW_FAQ_TOPIC_COLLECTION_ID)
  const map = new Map<string, TopicEntry>()
  for (const t of topics) {
    const name = typeof t.fieldData['name'] === 'string' ? t.fieldData['name'] : ''
    const rawSlug = typeof t.fieldData['slug'] === 'string' ? t.fieldData['slug'] : name
    if (!name) continue
    const slug = slugifyForCms(rawSlug)
    map.set(t.id, { name, slug })
  }
  return map
}

export async function importFaqs(ctx: ImportContext): Promise<void> {
  const topicMap = await buildTopicMap(ctx.webflow)
  process.stdout.write(`  Loaded ${topicMap.size} faq-topic entries (resolved inline)\n`)

  const items = await ctx.webflow.listItems(WEBFLOW_FAQ_QUESTIONS_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} faqs items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const question = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? question
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'faqs', slug }
      const answer = await transformRichText(fd['faq-ans'], assetCtx, ctx.assetMigrator)

      let topicLabel = ''
      let topicSlug = ''
      const topicRef = fd['faq-topics']
      if (typeof topicRef === 'string') {
        const resolved = topicMap.get(topicRef)
        if (resolved) {
          topicLabel = resolved.name
          topicSlug = resolved.slug
        } else {
          ctx.report.recordWarning({ webflowId: item.id, message: `unresolved faq-topic ref ${topicRef}` })
        }
      }

      const data: Record<string, unknown> = {
        question,
        answer,
        topic: topicLabel,
        topic_slug: topicSlug,
      }

      await ctx.writer.write({
        collection: 'faqs',
        slug,
        data,
      })

      ctx.referenceMap.set('faqs', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}${topicLabel ? `  [${topicLabel}]` : ''}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
