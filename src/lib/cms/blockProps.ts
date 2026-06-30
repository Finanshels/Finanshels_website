// Codec for inline CMS block props embedded inside body HTML.
//
// The Notion-style `/` editor stores each inline block as a self-contained
// sentinel element:
//
//   <div data-cms-block="cta" data-cms-props="<base64-utf8 JSON>"></div>
//
// Base64 keeps the payload to [A-Za-z0-9+/=] — no quotes, angle brackets, or
// ampersands — so it survives `sanitize-html` re-serialization and the cheerio
// TOC pass byte-for-byte. This module is isomorphic: the editor (browser)
// encodes, the renderer (Node) decodes.

export function encodeBlockProps(props: Record<string, unknown>): string {
  const json = JSON.stringify(props ?? {})
  return base64EncodeUtf8(json)
}

export function decodeBlockProps(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {}
  try {
    const json = base64DecodeUtf8(raw.trim())
    const parsed: unknown = JSON.parse(json)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

function base64EncodeUtf8(input: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(input, 'utf-8').toString('base64')
  const bytes = new TextEncoder().encode(input)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}

function base64DecodeUtf8(input: string): string {
  if (typeof Buffer !== 'undefined') return Buffer.from(input, 'base64').toString('utf-8')
  const binary = atob(input)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}
