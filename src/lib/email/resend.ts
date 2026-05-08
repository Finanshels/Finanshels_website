import { Resend } from 'resend'

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id: string | null; via: 'resend' }
  | { ok: false; reason: 'not_configured'; message: string }
  | { ok: false; reason: 'send_failed'; message: string }

let cached: { client: Resend; from: string; replyTo?: string } | null = null
let configWarned = false

/**
 * Trim, then strip a single layer of surrounding straight or smart quotes.
 * Vercel users frequently paste env values with the surrounding quotes from
 * a `.env.example` snippet, which then leak into the value at runtime.
 */
function cleanEnv(value: string | undefined): string {
  if (!value) return ''
  let v = value.trim()
  if (v.length < 2) return v
  const first = v.charAt(0)
  const last = v.charAt(v.length - 1)
  const matchingQuote =
    (first === '"' && last === '"') ||
    (first === "'" && last === "'") ||
    (first === '“' && last === '”') ||
    (first === '‘' && last === '’')
  if (matchingQuote) v = v.slice(1, -1).trim()
  return v
}

const PLAIN_EMAIL = /^[^\s<>"]+@[^\s<>"]+\.[^\s<>"]+$/
const NAMED_EMAIL = /^[^<>]+<\s*[^\s<>"]+@[^\s<>"]+\.[^\s<>"]+\s*>$/

/** Resend requires "email@host" or "Name <email@host>". Returns null if invalid. */
export function validateFromAddress(value: string): string | null {
  const v = value.trim()
  if (!v) return null
  if (PLAIN_EMAIL.test(v)) return v
  if (NAMED_EMAIL.test(v)) return v
  return null
}

function loadConfig(): { client: Resend; from: string; replyTo?: string } | null {
  if (cached) return cached
  const apiKey = cleanEnv(process.env.RESEND_API_KEY)
  const fromRaw = cleanEnv(process.env.RESEND_FROM_EMAIL)
  if (!apiKey || !fromRaw) return null

  const from = validateFromAddress(fromRaw)
  if (!from) {
    if (!configWarned) {
      configWarned = true
      console.warn(
        `[email] RESEND_FROM_EMAIL value is malformed: ${JSON.stringify(fromRaw)}. ` +
          'Use "email@example.com" or "Name <email@example.com>" — without surrounding quotes in the env var value.'
      )
    }
    return null
  }

  const client = new Resend(apiKey)
  const replyToRaw = cleanEnv(process.env.RESEND_REPLY_TO)
  const replyTo = replyToRaw ? validateFromAddress(replyToRaw) ?? undefined : undefined
  cached = { client, from, replyTo }
  return cached
}

export function isEmailConfigured(): boolean {
  return loadConfig() !== null
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const cfg = loadConfig()
  if (!cfg) {
    return {
      ok: false,
      reason: 'not_configured',
      message:
        'Email is not configured (RESEND_API_KEY missing, or RESEND_FROM_EMAIL is empty / malformed). ' +
        'Use "email@example.com" or "Name <email@example.com>" — no surrounding quotes in the env var.',
    }
  }

  try {
    const { data, error } = await cfg.client.emails.send({
      from: cfg.from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo ?? cfg.replyTo,
    })
    if (error) {
      return {
        ok: false,
        reason: 'send_failed',
        message: error.message ?? 'Resend API returned an error',
      }
    }
    return { ok: true, id: data?.id ?? null, via: 'resend' }
  } catch (err) {
    return {
      ok: false,
      reason: 'send_failed',
      message: err instanceof Error ? err.message : 'Unknown send failure',
    }
  }
}
