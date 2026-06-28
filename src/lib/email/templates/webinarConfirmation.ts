import { formatWebinarDate, googleCalendarUrl } from '@/lib/cms/webinarFormat'

/**
 * Registrant-facing confirmation email for a native webinar registration.
 * Carries the (generic) join link + an add-to-calendar link. Per-registrant
 * join links would require the Zoho Webinar API (not integrated) — see the
 * webinar-revamp plan.
 */

export type WebinarConfirmationInput = {
  recipientName: string
  webinarTitle: string
  webinarUrl: string
  startIso: string | null
  endIso: string | null
  timezone: string | null
  joinUrl: string | null
}

export type RenderedEmail = { subject: string; html: string; text: string }

const BRAND = '#2563eb'

export function buildWebinarConfirmationEmail(input: WebinarConfirmationInput): RenderedEmail {
  const dateLabel = formatWebinarDate(input.startIso, input.timezone)
  const firstName = input.recipientName.trim().split(/\s+/)[0] || 'there'
  const calendarUrl = googleCalendarUrl({
    title: input.webinarTitle,
    startIso: input.startIso,
    endIso: input.endIso,
    details: `Join: ${input.joinUrl ?? input.webinarUrl}`,
  })

  const subject = `You're registered: ${input.webinarTitle}`

  const textLines = [
    `Hi ${firstName},`,
    '',
    `You're registered for "${input.webinarTitle}".`,
    dateLabel ? `When: ${dateLabel}` : '',
    input.joinUrl ? `Join link: ${input.joinUrl}` : `We'll email your join link before the session.`,
    calendarUrl ? `Add to calendar: ${calendarUrl}` : '',
    '',
    `Webinar page: ${input.webinarUrl}`,
    '',
    '— The Finanshels team',
  ].filter(Boolean)
  const text = textLines.join('\n')

  const button = (href: string, label: string, primary: boolean) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;${
      primary ? `background:${BRAND};color:#ffffff;` : 'background:#f1f5f9;color:#0f172a;'
    }">${label}</a>`

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;max-width:560px;margin:0 auto;">
    <h1 style="font-size:20px;margin:0 0 8px;">You're registered ✅</h1>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">
      Hi ${firstName}, your seat for <strong>${input.webinarTitle}</strong> is confirmed.
    </p>
    ${
      dateLabel
        ? `<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin:0 0 18px;">
             <div style="font-size:12px;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin-bottom:4px;">When</div>
             <div style="font-size:15px;font-weight:600;">${dateLabel}</div>
           </div>`
        : ''
    }
    <div style="margin:0 0 18px;">
      ${input.joinUrl ? button(input.joinUrl, 'Join the webinar', true) : ''}
      ${calendarUrl ? `&nbsp;${button(calendarUrl, 'Add to calendar', false)}` : ''}
    </div>
    ${
      input.joinUrl
        ? ''
        : `<p style="margin:0 0 16px;color:#475569;font-size:13px;">We'll send your join link by email before the session starts.</p>`
    }
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      Details: <a href="${input.webinarUrl}" style="color:${BRAND};">${input.webinarUrl}</a>
    </p>
  </div>`

  return { subject, html, text }
}
