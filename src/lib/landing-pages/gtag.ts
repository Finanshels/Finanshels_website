/**
 * Thin gtag wrapper for landing-page Google Ads conversion events.
 *
 * `<Script src="https://www.googletagmanager.com/gtag/js?id=…">` loads gtag.js
 * once per page; this module just calls `window.gtag(...)` and tolerates
 * its absence (e.g. when the script is blocked or still loading).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

type ConversionEventOpts = {
  conversionId: string
  conversionLabel: string
  email?: string
  phone?: string
  /** Pre-hashed (sha256, lowercase hex) email — preferred over `email` */
  emailHash?: string
  /** Pre-hashed (sha256, lowercase hex) phone — preferred over `phone` */
  phoneHash?: string
  /** Optional value / currency override for the conversion */
  value?: number
  currency?: string
  transactionId?: string
}

/** Fire a Google Ads conversion event. Returns immediately; does nothing if gtag is unavailable. */
export function fireConversion(opts: ConversionEventOpts): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  if (!opts.conversionId || !opts.conversionLabel) return

  if (opts.emailHash || opts.phoneHash) {
    window.gtag('set', 'user_data', {
      sha256_email_address: opts.emailHash,
      sha256_phone_number: opts.phoneHash,
    })
  }

  const payload: Record<string, unknown> = {
    send_to: `${opts.conversionId}/${opts.conversionLabel}`,
  }
  if (opts.value !== undefined) payload.value = opts.value
  if (opts.currency) payload.currency = opts.currency
  if (opts.transactionId) payload.transaction_id = opts.transactionId

  window.gtag('event', 'conversion', payload)
}

/** Convenience: fire a generic GA4 event in addition (helps debugging). */
export function fireEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
