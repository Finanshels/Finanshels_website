import { NextResponse } from 'next/server'

/**
 * FIX-058: Next.js route handlers do NOT inherit the Server Actions
 * `bodySizeLimit`, so a public POST endpoint can stream an arbitrarily large
 * JSON body and exhaust function memory before Zod validation ever runs (Zod
 * `.max()` only applies after the full body is parsed into memory).
 *
 * This is a cheap first-line guard on the declared Content-Length. It does not
 * defend against a lying/absent Content-Length (chunked uploads), but it cleanly
 * rejects the common oversized-payload case up front. Returns a 413 response to
 * short-circuit the handler, or `null` to proceed.
 */
export function enforceBodyLimit(request: Request, maxBytes: number): NextResponse | null {
  const header = request.headers.get('content-length')
  if (header) {
    const len = Number(header)
    if (Number.isFinite(len) && len > maxBytes) {
      return NextResponse.json({ ok: false, error: 'payload_too_large' }, { status: 413 })
    }
  }
  return null
}
