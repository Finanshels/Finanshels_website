import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
  transformBoolean,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'
import { transformRichText } from './lib/transform/richText'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247af2'
const DEFAULT_FORMAT = 'pdf'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importEbooks(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} ebooks items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const ebookTitle = transformDirect(fd['name']) || transformDirect(fd['title'])
      const rawSlug = fd['slug'] ?? ebookTitle
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'ebooks', slug }
      // Prefer 'image' (open) over 'image-all-ebooks' (required listing tile);
      // fall back if 'image' is empty.
      const coverImage =
        (await transformImage(fd['image'], assetCtx, ctx.assetMigrator)) ??
        (await transformImage(fd['image-all-ebooks'], assetCtx, ctx.assetMigrator))

      const fullDescription = await transformRichText(fd['ebook-bullet-points'], assetCtx, ctx.assetMigrator)

      const data: Record<string, unknown> = {
        ebook_title: ebookTitle,
        cover_image: coverImage,
        short_description: transformDirect(fd['description']),
        full_description: fullDescription,
        // Webflow has no separate file URL; admins upload the PDF in CMS after import.
        file_upload: null,
        format: DEFAULT_FORMAT,
        gated: true,
        featured: transformBoolean(fd['featured']),
      }

      await ctx.writer.write({
        collection: 'ebooks',
        slug,
        data,
      })

      ctx.referenceMap.set('ebooks', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
