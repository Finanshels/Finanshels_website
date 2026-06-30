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
import { backfillSeoAeoGeo } from './lib/transform/seoBackfill'
import { slugifyForCms } from '../../src/lib/cms/slugify'

const WEBFLOW_BLOG_COLLECTION_ID = '6478e2307e71b5438f247af6'
const WEBFLOW_TEAM_COLLECTION_ID = '6478e2307e71b5438f247af1'
const WEBFLOW_TOPIC_COLLECTION_ID = '6478e2307e71b5438f247af4'

const EXCERPT_FALLBACK_CHARS = 220
const DEFAULT_BLOG_CATEGORY = 'accounting'

// Webflow topic name -> Firestore blog_posts.blog_category enum value.
// Firestore enum: corporate-tax, vat, transfer-pricing, audit, accounting,
//   bookkeeping, payroll, compliance, advisory, cfo-services, esr-aml-ubo,
//   regulatory-updates, founder-stories, how-to-guides.
const TOPIC_TO_CATEGORY: Record<string, string> = {
  'Liquidation': 'compliance',
  'Taxes and Tariffs': 'corporate-tax',
  'Growth Roadmap': 'advisory',
  'Business metrics': 'cfo-services',
  'Bookkeeping Essentials': 'bookkeeping',
  'Finance & Accounting 101': 'accounting',
  'Founder Toolkit': 'founder-stories',
}

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
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function deriveExcerpt(fullHtml: string): string {
  const plain = stripHtml(fullHtml)
  if (plain.length <= EXCERPT_FALLBACK_CHARS) return plain
  const cut = plain.slice(0, EXCERPT_FALLBACK_CHARS)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '...'
}

async function buildAuthorMap(webflow: WebflowClient): Promise<Map<string, string>> {
  const team = await webflow.listItems(WEBFLOW_TEAM_COLLECTION_ID)
  const map = new Map<string, string>()
  for (const t of team) {
    const fd = t.fieldData
    const name = typeof fd['name'] === 'string' ? fd['name'] : ''
    const rawSlug = typeof fd['slug'] === 'string' ? fd['slug'] : name
    if (!rawSlug.trim()) continue
    map.set(t.id, slugifyForCms(rawSlug))
  }
  return map
}

async function buildCategoryMap(webflow: WebflowClient): Promise<Map<string, string>> {
  const topics = await webflow.listItems(WEBFLOW_TOPIC_COLLECTION_ID)
  const map = new Map<string, string>()
  for (const t of topics) {
    const name = typeof t.fieldData['name'] === 'string' ? t.fieldData['name'] : ''
    const mapped = TOPIC_TO_CATEGORY[name]
    if (mapped) map.set(t.id, mapped)
  }
  return map
}

function pickPublishDate(
  fd: Record<string, unknown>,
  meta: { lastPublished?: string; createdOn?: string }
): Date | null {
  return (
    transformDate(fd['blog-date']) ??
    transformDate(meta.lastPublished) ??
    transformDate(meta.createdOn)
  )
}

function pickCategory(
  topicsRef: unknown,
  categoryMap: Map<string, string>
): string {
  if (!Array.isArray(topicsRef)) return DEFAULT_BLOG_CATEGORY
  for (const id of topicsRef) {
    if (typeof id !== 'string') continue
    const mapped = categoryMap.get(id)
    if (mapped) return mapped
  }
  return DEFAULT_BLOG_CATEGORY
}

export async function importBlogPosts(ctx: ImportContext): Promise<void> {
  const [authorMap, categoryMap] = await Promise.all([
    buildAuthorMap(ctx.webflow),
    buildCategoryMap(ctx.webflow),
  ])
  process.stdout.write(`  Loaded ${authorMap.size} author entries + ${categoryMap.size} category mappings\n`)

  const items = await ctx.webflow.listItems(WEBFLOW_BLOG_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} blog_posts items\n`)

  let unresolvedAuthor = 0
  let missingDate = 0
  let processed = 0

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const title = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? title
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'blog_posts', slug }
      const body = await transformRichText(fd['blog-post-richt-text'], assetCtx, ctx.assetMigrator)
      const featuredImage = await transformImage(fd['blog-post-featured-image-photo'], assetCtx, ctx.assetMigrator)
      const thumbnailImage = await transformImage(fd['blog-post-thumbnail-image-illustration'], assetCtx, ctx.assetMigrator)

      const excerptRaw = transformDirect(fd['blog-post-excerpt']) || transformDirect(fd['blog-post-summary'])
      const excerpt = excerptRaw || deriveExcerpt(body)

      let author = ''
      const authorRef = fd['blog-post-author']
      if (typeof authorRef === 'string') {
        const resolved = authorMap.get(authorRef)
        if (resolved) {
          author = resolved
        } else {
          unresolvedAuthor++
          ctx.report.recordWarning({ webflowId: item.id, message: `unresolved author ref ${authorRef}` })
        }
      }

      const publishDate = pickPublishDate(fd, item)
      if (!publishDate) missingDate++

      const blogCategory = pickCategory(fd['topics'], categoryMap)
      const featuredImageAlt =
        (fd['blog-post-featured-image-photo'] && typeof fd['blog-post-featured-image-photo'] === 'object'
          ? ((fd['blog-post-featured-image-photo'] as Record<string, unknown>).alt as string | undefined)
          : undefined) ?? ''

      const data: Record<string, unknown> = {
        // FIX-080: deterministic SEO/AEO/GEO backfill from the imported content
        // (spread first so any explicit field below wins).
        ...backfillSeoAeoGeo({ title, excerpt, body }),
        title,
        excerpt,
        body,
        author,
        publish_date: publishDate,
        featured_image: featuredImage,
        featured_image_alt: featuredImageAlt,
        thumbnail_image: thumbnailImage,
        blog_category: blogCategory,
        featured_post: transformBoolean(fd['blog-post-is-featured']),
      }

      await ctx.writer.write({
        collection: 'blog_posts',
        slug,
        data,
      })

      ctx.referenceMap.set('blog_posts', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      processed++
      if (processed % 25 === 0) {
        process.stdout.write(`    ... ${processed}/${items.length}\n`)
      }
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }

  process.stdout.write(`  Summary: ${processed} processed, ${unresolvedAuthor} unresolved authors, ${missingDate} missing dates\n`)
}
