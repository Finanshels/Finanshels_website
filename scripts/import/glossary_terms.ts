import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import { transformDirect, transformSlug } from './lib/transform/primitives'
import { transformRichText } from './lib/transform/richText'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247af8'
const SHORT_DEF_FALLBACK_CHARS = 200

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

function deriveShortDefinition(fullHtml: string): string {
  const plain = stripHtml(fullHtml)
  if (plain.length <= SHORT_DEF_FALLBACK_CHARS) return plain
  const cut = plain.slice(0, SHORT_DEF_FALLBACK_CHARS)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim() + '...'
}

function alphabetLetter(term: string): string {
  const first = term.trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(first) ? first : '#'
}

export async function importGlossaryTerms(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} glossary_terms items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const term = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? term
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'glossary_terms', slug }
      const definitionFull = await transformRichText(fd['meaning'], assetCtx, ctx.assetMigrator)
      const shortFromWebflow = transformDirect(fd['summary-2'])
      const definitionShort = shortFromWebflow || deriveShortDefinition(definitionFull)

      const data: Record<string, unknown> = {
        term,
        definition_short: definitionShort,
        definition_full: definitionFull,
        term_category: 'General',
        alphabet_letter: alphabetLetter(term),
      }

      await ctx.writer.write({
        collection: 'glossary_terms',
        slug,
        data,
      })

      ctx.referenceMap.set('glossary_terms', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
