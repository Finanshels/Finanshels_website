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

function loadConfig(): { client: Resend; from: string; replyTo?: string } | null {
  if (cached) return cached
  const apiKey = (process.env.RESEND_API_KEY ?? '').trim()
  const from = (process.env.RESEND_FROM_EMAIL ?? '').trim()
  if (!apiKey || !from) return null
  const client = new Resend(apiKey)
  const replyTo = (process.env.RESEND_REPLY_TO ?? '').trim() || undefined
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
      message: 'RESEND_API_KEY / RESEND_FROM_EMAIL are not set; email was not sent.',
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
