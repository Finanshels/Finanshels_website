// Gate admin-authored block URLs against XSS schemes before they reach an
// <a href> or <iframe src> on a public page. Block data isn't run through
// `sanitizeCmsHtml` (it's structured, not HTML), so this is its URL guard.
// Mirrors the editor-side `sanitizeEditorUrl` (FIX-052): allow http(s), mailto,
// tel, and relative/anchor links; reject javascript:/data:/vbscript:/file:.

export function safeUrl(raw: unknown): string | null {
  const url = typeof raw === 'string' ? raw.trim() : ''
  if (!url) return null
  if (/^(\/|#|\.\/|\.\.\/)/.test(url)) return url
  if (/^\s*(javascript|data|vbscript|file):/i.test(url)) return null
  if (/^(https?:|mailto:|tel:)/i.test(url)) return url
  // No recognized scheme but looks like a domain — assume https.
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/.test(url)) return `https://${url}`
  return null
}
