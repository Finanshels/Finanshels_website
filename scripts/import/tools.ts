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

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247afc'
const DEFAULT_TOOL_TYPE = 'calculator'
const DEFAULT_EMBED_TYPE = 'iframe'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importTools(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} tools items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const toolName = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? toolName
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'tools', slug }
      // Firestore's `icon` field type is string-only (icon name / class).
      // The Webflow icon image goes to hero_image instead.
      const heroImage = await transformImage(fd['tool-icon'], assetCtx, ctx.assetMigrator)

      const toolLink = transformDirect(fd['tool-link'])
      // Webflow tools are external links, not embedded UIs. Stash the URL in
      // full_description so the admin can see the original; embed_code stays
      // empty until the admin replaces it.
      const fullDescription = toolLink ? `Original tool: ${toolLink}` : ''

      const data: Record<string, unknown> = {
        tool_name: toolName,
        tool_type: DEFAULT_TOOL_TYPE,
        short_description: transformDirect(fd['summary']),
        full_description: fullDescription,
        hero_image: heroImage,
        tool_embed_type: DEFAULT_EMBED_TYPE,
        tool_embed_code: '',
        tool_route_key: slug,
      }

      await ctx.writer.write({
        collection: 'tools',
        slug,
        data,
      })

      ctx.referenceMap.set('tools', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
