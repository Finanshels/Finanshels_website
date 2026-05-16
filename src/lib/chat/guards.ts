import 'server-only'

import { createHash } from 'node:crypto'

const HIGH_INTENT_REGEX =
  /(price|pricing|cost|quote|how much|aed\s*\d|book|call|whatsapp|contact|speak|talk to|human|consult|consultation|meeting|demo|trial|sign\s*up|get started|hire|fees?)/i

export function detectHighIntent(message: string): boolean {
  return HIGH_INTENT_REGEX.test(message)
}

export interface IntentClassification {
  intent: 'bookkeeping' | 'vat' | 'corporate_tax' | 'cfo' | 'payroll' | 'audit' | 'general'
  confidence: 'high' | 'low'
}

const INTENT_PATTERNS: Array<{ intent: IntentClassification['intent']; pattern: RegExp }> = [
  { intent: 'bookkeeping', pattern: /(bookkeep|accounting|ledger|reconcil|invoic)/i },
  { intent: 'vat', pattern: /\bvat\b|value added tax/i },
  { intent: 'corporate_tax', pattern: /(corporate tax|ct\b|corp\.?\s*tax)/i },
  { intent: 'cfo', pattern: /(cfo|chief financial|fractional|controller)/i },
  { intent: 'payroll', pattern: /(payroll|wps|salary|salaries|wages)/i },
  { intent: 'audit', pattern: /(audit|assurance|compliance review)/i },
]

export function classifyIntent(message: string): IntentClassification {
  for (const { intent, pattern } of INTENT_PATTERNS) {
    if (pattern.test(message)) return { intent, confidence: 'high' }
  }
  return { intent: 'general', confidence: 'low' }
}

export function enforcePricingGuard(output: string, citationsText: string): string {
  const sourceCorpus = citationsText.toLowerCase()
  return output.replace(/AED\s*[\d,]+(?:\.\d+)?(?:\s*(?:\/|per)\s*\w+)?/gi, (match) => {
    const normalized = match.toLowerCase().replace(/\s+/g, ' ').trim()
    if (sourceCorpus.includes(normalized)) return match
    return 'a tailored price (our team can confirm)'
  })
}

interface RateBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateBucket>()
const BUCKET_MAX = 5000

const WINDOW_5MIN_MS = 5 * 60 * 1000
const LIMIT_5MIN = 20
const WINDOW_24H_MS = 24 * 60 * 60 * 1000
const LIMIT_24H = 100

export interface RateLimitResult {
  allowed: boolean
  reason?: 'short_window' | 'daily'
  retryAfterSeconds?: number
}

function bucketKey(ipHash: string, window: 'short' | 'long'): string {
  return `${window}:${ipHash}`
}

function checkBucket(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= BUCKET_MAX) {
      const firstKey = buckets.keys().next().value
      if (firstKey) buckets.delete(firstKey)
    }
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true }
  }
  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  bucket.count++
  return { allowed: true }
}

export function checkRateLimit(ipHash: string): RateLimitResult {
  const short = checkBucket(bucketKey(ipHash, 'short'), LIMIT_5MIN, WINDOW_5MIN_MS)
  if (!short.allowed) return { ...short, reason: 'short_window' }
  const long = checkBucket(bucketKey(ipHash, 'long'), LIMIT_24H, WINDOW_24H_MS)
  if (!long.allowed) return { ...long, reason: 'daily' }
  return { allowed: true }
}

export function hashIp(ip: string): string {
  const salt = process.env.CMS_ADMIN_SESSION_SECRET ?? 'finanshels-chat-ip-salt'
  return createHash('sha256').update(`${ip}::${salt}`).digest('hex').slice(0, 32)
}

export function extractClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return headers.get('x-real-ip') ?? 'unknown'
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value)
}

const PHONE_REGEX = /^\+?[0-9][\d\s\-()]{6,18}$/
export function isValidPhone(value: string): boolean {
  return PHONE_REGEX.test(value)
}
