import sanitizeHtml from 'sanitize-html'

// FIX-075: inline CTA shortcodes. Editors drop `[cta label="Book a call"
// url="/contact" style="primary"]` anywhere in rich text for fluid placement.
// We expand the shortcode to a styled anchor BEFORE sanitizeHtml runs, so the
// final gate still validates the href (a javascript: URL is dropped) and the
// markup. Styling hangs off the `.fin-cta` class (allowed on every element).
function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function parseShortcodeAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const re = /(\w+)\s*=\s*"([^"]*)"/g
  let match: RegExpExecArray | null
  while ((match = re.exec(raw)) !== null) {
    attrs[match[1]!.toLowerCase()] = match[2]!
  }
  return attrs
}

const CTA_SHORTCODE = /\[cta\b([^\]]*)\]/gi

export function expandCtaShortcodes(html: string): string {
  return html.replace(CTA_SHORTCODE, (_full, attrsRaw: string) => {
    const attrs = parseShortcodeAttrs(attrsRaw)
    const url = (attrs.url ?? attrs.href ?? '').trim()
    if (!url) return ''
    const label = (attrs.label ?? attrs.text ?? 'Learn more').trim()
    const style = attrs.style === 'secondary' ? 'secondary' : 'primary'
    return `<a href="${escapeHtmlAttr(url)}" class="fin-cta fin-cta--${style}">${escapeHtmlAttr(label)}</a>`
  })
}

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
  // Expand `[cta …]` shortcodes first, then let sanitizeHtml validate the result.
  return sanitizeHtml(expandCtaShortcodes(dirty), options)
}
