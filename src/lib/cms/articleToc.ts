import 'server-only'
import * as cheerio from 'cheerio'

export type TocItem = {
  id: string
  text: string
  level: 2 | 3
  /** 1-based section number — assigned to level-2 (h2) headings only. */
  number?: number
}

/** Heading text → URL-safe anchor slug. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Parse sanitized article HTML to:
 *  - inject stable `id` anchors on every h2/h3 (deep links + TOC targets), and
 *  - extract a flat table of contents (h2 numbered, h3 nested + unnumbered).
 *
 * Headings that already carry an `id` keep it; generated ids are de-duplicated
 * with a numeric suffix. Input is expected to be the output of
 * `sanitizeCmsHtml` (which permits `id`/`class`), so the rewritten HTML stays
 * within the sanitizer's allow-list — no second sanitize pass needed.
 */
export function buildArticleToc(sanitizedHtml: string): { html: string; toc: TocItem[] } {
  if (!sanitizedHtml) return { html: '', toc: [] }

  const $ = cheerio.load(sanitizedHtml, null, false)
  const toc: TocItem[] = []
  const used = new Set<string>()
  let sectionNumber = 0

  $('h2, h3').each((_, el) => {
    const $el = $(el)
    const text = $el.text().trim()
    if (!text) return

    const level: 2 | 3 = $el.is('h2') ? 2 : 3

    const base = $el.attr('id') || slugify(text) || 'section'
    let id = base
    let suffix = 2
    while (used.has(id)) id = `${base}-${suffix++}`
    used.add(id)
    $el.attr('id', id)

    const item: TocItem = { id, text, level }
    if (level === 2) {
      sectionNumber += 1
      item.number = sectionNumber
    }
    toc.push(item)
  })

  return { html: $.html(), toc }
}
