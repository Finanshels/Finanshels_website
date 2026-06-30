import sanitizeHtml from 'sanitize-html'

const options: sanitizeHtml.IOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    'img',
    'h1',
    'h2',
    'h3',
    'h4',
    'figure',
    'figcaption',
    'iframe',
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
    a: ['href', 'name', 'target', 'rel'],
    iframe: ['src', 'title', 'width', 'height', 'loading', 'allow', 'allowfullscreen'],
    // Notion-style inline blocks are stored as empty sentinel <div>s carrying the
    // block type + base64-encoded props. The interleave renderer
    // (ArticleBodyWithBlocks) replaces them with real block components; the
    // base64 payload is [A-Za-z0-9+/=] only, so it round-trips untouched here.
    div: ['data-cms-block', 'data-cms-props'],
    '*': ['class', 'id'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
}

export function sanitizeCmsHtml(dirty: string | undefined | null): string {
  if (!dirty) return ''
  return sanitizeHtml(dirty, options)
}
