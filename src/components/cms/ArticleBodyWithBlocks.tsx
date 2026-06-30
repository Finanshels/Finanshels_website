import 'server-only'
import { Fragment } from 'react'
import * as cheerio from 'cheerio'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { renderInlineBlock, type Block } from '@/components/cms/PageBlocksRenderer'
import { decodeBlockProps } from '@/lib/cms/blockProps'

type Props = { html: string; className?: string }

type Segment = { kind: 'html'; html: string } | { kind: 'block'; block: Block }

type DomNodeLike = {
  type?: string
  name?: string
  attribs?: Record<string, string>
}

/**
 * Split already-sanitized article HTML into ordered segments at each inline
 * block sentinel (`<div data-cms-block="…" data-cms-props="…">`). Prose chunks
 * render through ArticleBody; sentinels resolve to real block components. The
 * sentinels are top-level (the editor's CmsBlockNode is block-level), so a
 * single top-level walk preserves document order.
 */
function splitBodyIntoSegments(html: string): Segment[] {
  const $ = cheerio.load(html, null, false)
  const segments: Segment[] = []
  let buffer = ''

  const flushHtml = () => {
    if (buffer.trim()) segments.push({ kind: 'html', html: buffer })
    buffer = ''
  }

  $.root()
    .contents()
    .each((_, node) => {
      const el = node as unknown as DomNodeLike
      const blockType = el.type === 'tag' && el.name === 'div' ? el.attribs?.['data-cms-block'] : undefined
      if (blockType) {
        flushHtml()
        const props = decodeBlockProps(el.attribs?.['data-cms-props'])
        segments.push({ kind: 'block', block: { ...props, type: blockType } })
        return
      }
      buffer += $.html(node)
    })

  flushHtml()
  return segments
}

/**
 * Article body that interleaves rich-text prose with Notion-style inline blocks.
 * Backward-compatible: a body with no sentinels renders byte-identically to
 * <ArticleBody>.
 */
export function ArticleBodyWithBlocks({ html, className = '' }: Props) {
  if (!html) return null
  const segments = splitBodyIntoSegments(html)

  if (!segments.some((seg) => seg.kind === 'block')) {
    return <ArticleBody html={html} className={className} />
  }

  return (
    <div className={className}>
      {segments.map((seg, index) =>
        seg.kind === 'html' ? (
          <ArticleBody key={`prose-${index}`} html={seg.html} />
        ) : (
          <Fragment key={`block-${index}`}>{renderInlineBlock(seg.block, `body-block-${index}`)}</Fragment>
        )
      )}
    </div>
  )
}
