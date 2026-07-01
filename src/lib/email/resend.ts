import { Resend } from 'resend'

/**
 * Central transactional mailer. Historically Resend-only (hence the filename);
 * now provider-agnostic. Provider is chosen at send time:
 *   1. SendGrid  — when SENDGRID_API_KEY + SENDGRID_FROM_EMAIL are set (preferred)
 *   2. Resend    — when RESEND_API_KEY + RESEND_FROM_EMAIL are set (fallback)
 *   3. otherwise — `not_configured`, callers surface a manual/inline path.
 *
 * All app email (admin invites, webinar confirmations, lead notifications, …)
 * routes through `sendEmail` / `isEmailConfigured`, so switching provider here
 * switches it everywhere.
 */

export type SendEmailInput = {
  to: string
  subject: string
  html: string
  text: string
  replyTo?: string
}

export type SendEmailResult =
  | { ok: true; id: string | null; via: 'resend' | 'sendgrid' }
  | { ok: false; reason: 'not_configured'; message: string }
  | { ok: false; reason: 'send_failed'; message: string }

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

/** Resend accepts "email@host" or "Name <email@host>". Returns null if invalid. */
export function validateFromAddress(value: string): string | null {
  const v = value.trim()
  if (!v) return null
  if (PLAIN_EMAIL.test(v)) return v
  if (NAMED_EMAIL.test(v)) return v
  return null
}

/** Split "email@host" or "Name <email@host>" into parts (SendGrid needs them separate). */
function parseEmailAddress(value: string): { email: string; name?: string } | null {
  const v = value.trim()
  if (!v) return null
  if (PLAIN_EMAIL.test(v)) return { email: v }
  const m = v.match(/^([^<>]+)<\s*([^\s<>"]+@[^\s<>"]+\.[^\s<>"]+)\s*>$/)
  if (m) {
    const name = m[1].trim().replace(/^["']|["']$/g, '').trim()
    return { email: m[2], name: name || undefined }
  }
  return null
}

// ── SendGrid (preferred) ──────────────────────────────────────────────────
type SendgridConfig = { apiKey: string; fromEmail: string; fromName?: string; replyTo?: string }
let sendgridCache: SendgridConfig | null = null
let sendgridChecked = false
let sendgridWarned = false

function loadSendgridConfig(): SendgridConfig | null {
  if (sendgridChecked) return sendgridCache
  sendgridChecked = true

  const apiKey = cleanEnv(process.env.SENDGRID_API_KEY)
  const fromRaw = cleanEnv(process.env.SENDGRID_FROM_EMAIL)
  if (!apiKey || !fromRaw) {
    sendgridCache = null
    return null
  }

  const parsed = parseEmailAddress(fromRaw)
  if (!parsed) {
    if (!sendgridWarned) {
      sendgridWarned = true
      console.warn(
        `[email] SENDGRID_FROM_EMAIL value is malformed: ${JSON.stringify(fromRaw)}. ` +
          'Use "email@example.com" or "Name <email@example.com>" — without surrounding quotes.'
      )
    }
    sendgridCache = null
    return null
  }

  // Explicit SENDGRID_FROM_NAME wins; else use a name embedded in the from address.
  const fromName = cleanEnv(process.env.SENDGRID_FROM_NAME) || parsed.name
  const replyToRaw = cleanEnv(process.env.SENDGRID_REPLY_TO)
  const replyTo = replyToRaw ? parseEmailAddress(replyToRaw)?.email : undefined
  sendgridCache = { apiKey, fromEmail: parsed.email, fromName, replyTo }
  return sendgridCache
}

async function sendViaSendgrid(cfg: SendgridConfig, input: SendEmailInput): Promise<SendEmailResult> {
  // SendGrid requires content sorted with text/plain before text/html, non-empty.
  const content: Array<{ type: string; value: string }> = []
  if (input.text) content.push({ type: 'text/plain', value: input.text })
  if (input.html) content.push({ type: 'text/html', value: input.html })
  if (content.length === 0) content.push({ type: 'text/plain', value: ' ' })

  const replyToEmail = input.replyTo ? parseEmailAddress(input.replyTo)?.email : cfg.replyTo

  const body = {
    personalizations: [{ to: [{ email: input.to }] }],
    from: cfg.fromName ? { email: cfg.fromEmail, name: cfg.fromName } : { email: cfg.fromEmail },
    subject: input.subject,
    content,
    ...(replyToEmail ? { reply_to: { email: replyToEmail } } : {}),
  }

  try {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.status === 202) {
      return { ok: true, id: res.headers.get('x-message-id'), via: 'sendgrid' }
    }

    let message = `SendGrid API error (HTTP ${res.status})`
    try {
      const data = (await res.json()) as { errors?: Array<{ message?: string }> }
      const detail = data.errors?.map((e) => e.message).filter(Boolean).join('; ')
      if (detail) message = detail
    } catch {
      // non-JSON error body — keep the status-based message
    }
    return { ok: false, reason: 'send_failed', message }
  } catch (err) {
    return {
      ok: false,
      reason: 'send_failed',
      message: err instanceof Error ? err.message : 'Unknown SendGrid failure',
    }
  }
}

// ── Resend (fallback) ─────────────────────────────────────────────────────
let resendCache: { client: Resend; from: string; replyTo?: string } | null = null
let resendWarned = false

function loadResendConfig(): { client: Resend; from: string; replyTo?: string } | null {
  if (resendCache) return resendCache
  const apiKey = cleanEnv(process.env.RESEND_API_KEY)
  const fromRaw = cleanEnv(process.env.RESEND_FROM_EMAIL)
  if (!apiKey || !fromRaw) return null

  const from = validateFromAddress(fromRaw)
  if (!from) {
    if (!resendWarned) {
      resendWarned = true
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
  resendCache = { client, from, replyTo }
  return resendCache
}

async function sendViaResend(
  cfg: { client: Resend; from: string; replyTo?: string },
  input: SendEmailInput
): Promise<SendEmailResult> {
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
      return { ok: false, reason: 'send_failed', message: error.message ?? 'Resend API returned an error' }
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

// ── Public API ────────────────────────────────────────────────────────────
export function isEmailConfigured(): boolean {
  return loadSendgridConfig() !== null || loadResendConfig() !== null
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const sendgrid = loadSendgridConfig()
  if (sendgrid) return sendViaSendgrid(sendgrid, input)

  const resend = loadResendConfig()
  if (resend) return sendViaResend(resend, input)

  return {
    ok: false,
    reason: 'not_configured',
    message:
      'Email is not configured. Set SENDGRID_API_KEY + SENDGRID_FROM_EMAIL (preferred), ' +
      'or RESEND_API_KEY + RESEND_FROM_EMAIL. Use "email@example.com" or "Name <email@example.com>" ' +
      'for the from address — no surrounding quotes in the env var value.',
  }
}
