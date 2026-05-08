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
    '*': ['class', 'id'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'player.vimeo.com'],
}

export function sanitizeCmsHtml(dirty: string | undefined | null): string {
  if (!dirty) return ''
  return sanitizeHtml(dirty, options)
}
