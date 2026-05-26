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

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247aeb'
const DEFAULT_INDUSTRY = 'General'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(s: string, max = 300): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '...'
}

export async function importCustomerStories(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} customer_stories items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const storyTitle = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? storyTitle
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'customer_stories', slug }
      const heroImage =
        (await transformImage(fd['client-image'], assetCtx, ctx.assetMigrator)) ??
        (await transformImage(fd['bg-banner'], assetCtx, ctx.assetMigrator))

      const beforeHtml = await transformRichText(fd['before-finanshels'], assetCtx, ctx.assetMigrator)
      const problemsHtml = await transformRichText(fd['the-problems'], assetCtx, ctx.assetMigrator)
      const solutionsHtml = await transformRichText(fd['the-solutions'], assetCtx, ctx.assetMigrator)
      const afterHtml = await transformRichText(fd['after-finanshels'], assetCtx, ctx.assetMigrator)
      const outcomesHtml = await transformRichText(fd['the-outcomes'], assetCtx, ctx.assetMigrator)

      const challengeSummary = truncate(stripHtml(beforeHtml || problemsHtml))
      const solutionSummary = truncate(stripHtml(solutionsHtml))
      const resultsSummary = truncate(stripHtml(afterHtml || outcomesHtml))

      const fullStoryBody = [beforeHtml, problemsHtml, solutionsHtml, afterHtml, outcomesHtml]
        .filter(Boolean)
        .join('\n\n')

      // Webflow customer-stories has no reference to our-customers — just a
      // client-name text field. Admins link the `customer` ref manually after import.
      const clientName = transformDirect(fd['client-name'])
      if (clientName) {
        ctx.report.recordWarning({
          webflowId: item.id,
          message: `client "${clientName}" not auto-linked to our_customers; admin should set 'customer' ref manually`,
        })
      }

      const publishDate =
        transformDate(item.lastPublished) ??
        transformDate(item.createdOn)

      const data: Record<string, unknown> = {
        story_title: storyTitle,
        customer: '',
        industry: [DEFAULT_INDUSTRY],
        hero_image: heroImage,
        challenge_summary: challengeSummary,
        solution_summary: solutionSummary,
        results_summary: resultsSummary,
        full_story_body: fullStoryBody,
        featured: transformBoolean(fd['home-feature']),
        publish_date: publishDate,
      }

      await ctx.writer.write({
        collection: 'customer_stories',
        slug,
        data,
      })

      ctx.referenceMap.set('customer_stories', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}${clientName ? `  (${clientName})` : ''}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
