import * as cheerio from 'cheerio'
import { sanitizeCmsHtml } from '../../../../src/lib/cms/sanitize'
import type { AssetMigrator } from '../assetMigrator'

export interface TransformRichTextContext {
  collection: string
  slug: string
}

async function rewriteSrcset(
  srcset: string,
  ctx: TransformRichTextContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<string> {
  const parts = srcset.split(',').map(p => p.trim()).filter(Boolean)
  const rewritten: string[] = []
  for (const part of parts) {
    const [url, descriptor] = part.split(/\s+/, 2)
    const migrated = await migrator.migrate({
      sourceUrl: url,
      collection: ctx.collection,
      slug: ctx.slug,
    })
    const newUrl = migrated?.url ?? url
    rewritten.push(descriptor ? `${newUrl} ${descriptor}` : newUrl)
  }
  return rewritten.join(', ')
}

export async function transformRichText(
  value: unknown,
  ctx: TransformRichTextContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<string> {
  if (typeof value !== 'string' || !value.trim()) return ''

  const $ = cheerio.load(value, null, false)
  const imgs = $('img').toArray()
  for (const el of imgs) {
    const src = $(el).attr('src')
    if (src) {
      const migrated = await migrator.migrate({
        sourceUrl: src,
        collection: ctx.collection,
        slug: ctx.slug,
      })
      if (migrated) $(el).attr('src', migrated.url)
    }
    const srcset = $(el).attr('srcset')
    if (srcset) {
      $(el).attr('srcset', await rewriteSrcset(srcset, ctx, migrator))
    }
  }

  const rewrittenHtml = $.html()
  return sanitizeCmsHtml(rewrittenHtml)
}
