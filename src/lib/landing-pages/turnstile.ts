/**
 * Cloudflare Turnstile server-side verification.
 *
 * Env:
 *   TURNSTILE_SECRET_KEY    Cloudflare secret key (required for enforcement)
 *
 * When the secret is not set, verification is bypassed in dev — log a warning
 * so production deployments don't silently allow bot traffic.
 */

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

let warnedOnce = false

export type TurnstileVerifyResult = { ok: true } | { ok: false; reason: string }

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY)
}

export async function verifyTurnstile(token: string | undefined, remoteIp?: string): Promise<TurnstileVerifyResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) {
    if (!warnedOnce) {
      warnedOnce = true
      console.warn('[turnstile] TURNSTILE_SECRET_KEY not set — verification bypassed.')
    }
    return { ok: true }
  }
  if (!token) return { ok: false, reason: 'missing_token' }

  const params = new URLSearchParams()
  params.append('secret', secret)
  params.append('response', token)
  if (remoteIp) params.append('remoteip', remoteIp)

  try {
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body: params,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      cache: 'no-store',
    })
    if (!res.ok) return { ok: false, reason: `verify_http_${res.status}` }
    const json = (await res.json()) as { success?: boolean; 'error-codes'?: string[] }
    if (json.success) return { ok: true }
    return { ok: false, reason: (json['error-codes'] ?? ['unknown']).join(',') }
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : 'verify_error' }
  }
}
