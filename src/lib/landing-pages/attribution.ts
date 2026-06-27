/**
 * Client-side attribution capture.
 *
 * Reads gclid / gbraid / wbraid / utm_* from the URL on first arrival,
 * persists to a 90-day first-party cookie + sessionStorage, and returns
 * the merged attribution snapshot for form submissions.
 *
 * Safe to call in client components (`'use client'`).
 */

import type { LeadAttribution } from './types'

const COOKIE_NAME = 'fns_attr'
const STORAGE_KEY = 'fns_attr'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90 // 90 days

export type AttributionSource = LeadAttribution

const ATTR_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const

type AttrKey = (typeof ATTR_KEYS)[number]

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1] ?? '') : null
}

function writeCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === 'undefined') return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`
}

function parseStored(value: string | null): Partial<AttributionSource> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Partial<AttributionSource>)
      : {}
  } catch {
    return {}
  }
}

function readStored(): Partial<AttributionSource> {
  if (typeof window === 'undefined') return {}
  const sessionVal = window.sessionStorage?.getItem(STORAGE_KEY) ?? null
  if (sessionVal) return parseStored(sessionVal)
  return parseStored(readCookie(COOKIE_NAME))
}

function readUrlAttribution(): Partial<AttributionSource> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Partial<AttributionSource> = {}
  for (const key of ATTR_KEYS) {
    const v = params.get(key)
    if (v) out[key as AttrKey] = v
  }
  return out
}

/**
 * Capture attribution from URL (if present), merge with stored, persist, return.
 * Call once per page on mount.
 */
export function captureAttribution(): AttributionSource {
  if (typeof window === 'undefined') {
    return { landing_url: '' }
  }

  const stored = readStored()
  const fromUrl = readUrlAttribution()
  const referrer = stored.referrer || document.referrer || undefined
  const landing_url = stored.landing_url || window.location.href

  // URL params win — most-recent click is most-relevant attribution
  const merged: AttributionSource = {
    landing_url,
    referrer,
    ...stored,
    ...fromUrl,
  }

  // Persist
  const toStore: Partial<AttributionSource> = { ...merged }
  delete (toStore as Record<string, unknown>).landing_url // landing_url already saved separately as part of merged
  const serialised = JSON.stringify(merged)
  try {
    window.sessionStorage?.setItem(STORAGE_KEY, serialised)
  } catch {
    /* ignore quota errors */
  }
  writeCookie(COOKIE_NAME, serialised, COOKIE_MAX_AGE)

  return merged
}

/** Read current attribution snapshot without re-capturing URL. */
export function readAttribution(): AttributionSource {
  if (typeof window === 'undefined') return { landing_url: '' }
  const stored = readStored()
  return {
    landing_url: stored.landing_url || window.location.href,
    referrer: stored.referrer || document.referrer || undefined,
    gclid: stored.gclid,
    gbraid: stored.gbraid,
    wbraid: stored.wbraid,
    utm_source: stored.utm_source,
    utm_medium: stored.utm_medium,
    utm_campaign: stored.utm_campaign,
    utm_term: stored.utm_term,
    utm_content: stored.utm_content,
  }
}

/** SHA-256 hex digest, lowercase, ASCII-only — for Google Enhanced Conversions. */
export async function sha256Hex(input: string): Promise<string> {
  if (typeof crypto === 'undefined' || !crypto.subtle) return ''
  const cleaned = input.trim().toLowerCase()
  const data = new TextEncoder().encode(cleaned)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
