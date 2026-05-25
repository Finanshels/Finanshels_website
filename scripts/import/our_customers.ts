import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
  transformOption,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'

const WEBFLOW_COLLECTION_ID = '676694ba329e480383ed8836'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

async function buildIndustryTable(
  webflow: WebflowClient
): Promise<Record<string, string>> {
  const detailed = await webflow.getCollection(WEBFLOW_COLLECTION_ID)
  const field = (detailed.fields ?? []).find(f => f.slug === 'industry')
  const options = (field?.validations as { options?: Array<{ id: string; name: string }> } | undefined)?.options ?? []
  const table: Record<string, string> = {}
  for (const opt of options) {
    if (opt.id && opt.name) table[opt.id] = opt.name
  }
  return table
}

export async function importOurCustomers(ctx: ImportContext): Promise<void> {
  const industryTable = await buildIndustryTable(ctx.webflow)
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} our_customers items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const companyName = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? companyName
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'our_customers', slug }
      const logo = await transformImage(fd['logo'], assetCtx, ctx.assetMigrator)
      const industryLabel = transformOption(fd['industry'], industryTable) ?? ''

      const data: Record<string, unknown> = {
        company_name: companyName,
        logo,
        industry: industryLabel,
        relationship_type: 'customer',
      }

      await ctx.writer.write({
        collection: 'our_customers',
        slug,
        data,
      })

      ctx.referenceMap.set('our_customers', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}  (${companyName}${industryLabel ? `, ${industryLabel}` : ''})\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
