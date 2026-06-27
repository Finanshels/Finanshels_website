import { sendEmail } from '../email/resend'
import { getServiceInterestLabel } from './serviceInterests'
import type { LandingPageDoc, LandingPageLead } from './types'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function row(label: string, value?: string | null): string {
  if (!value) return ''
  return `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;width:160px;">${escapeHtml(label)}</td><td style="padding:6px 12px;color:#0f172a;font-size:14px;">${escapeHtml(value)}</td></tr>`
}

export async function sendLeadNotification(
  lead: LandingPageLead,
  page: Pick<LandingPageDoc, 'slug' | 'internal_name' | 'form_destination_emails'>
): Promise<{ ok: true } | { ok: false; error: string }> {
  const recipients = (page.form_destination_emails ?? []).filter(Boolean)
  if (recipients.length === 0) {
    return { ok: false, error: 'no_recipients' }
  }

  const serviceLabel = getServiceInterestLabel(lead.service_interest)
  const subject = `New lead · ${serviceLabel} · ${page.internal_name}`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding:20px; max-width:600px; margin:0 auto; color:#0f172a;">
      <h2 style="margin:0 0 4px 0; font-size:20px;">New lead from a landing page</h2>
      <p style="margin:0 0 16px 0; color:#64748b; font-size:13px;">
        Page: <strong>${escapeHtml(page.internal_name)}</strong> · /landing-pages/${escapeHtml(page.slug)}
      </p>
      <table style="border-collapse:collapse;background:#f8fafc;border-radius:8px;width:100%;">
        ${row('Name', lead.name)}
        ${row('Phone', lead.phone)}
        ${row('Email', lead.email)}
        ${row('Company', lead.company_name)}
        ${row('Service interest', serviceLabel)}
        ${row('Landing page', `/landing-pages/${page.slug}`)}
      </table>
      <h3 style="margin:20px 0 8px 0; font-size:14px; color:#64748b; text-transform:uppercase; letter-spacing:0.05em;">Attribution</h3>
      <table style="border-collapse:collapse;background:#f8fafc;border-radius:8px;width:100%;">
        ${row('gclid', lead.gclid)}
        ${row('utm_source', lead.utm_source)}
        ${row('utm_medium', lead.utm_medium)}
        ${row('utm_campaign', lead.utm_campaign)}
        ${row('utm_term', lead.utm_term)}
        ${row('utm_content', lead.utm_content)}
        ${row('Referrer', lead.referrer)}
        ${row('Landing URL', lead.landing_url)}
      </table>
      <p style="margin:24px 0 0 0; font-size:12px; color:#94a3b8;">
        Lead id: ${escapeHtml(lead.id)}
      </p>
    </div>
  `

  const text = [
    `New lead from /landing-pages/${page.slug}`,
    '',
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    lead.company_name ? `Company: ${lead.company_name}` : '',
    `Service interest: ${serviceLabel}`,
    '',
    'Attribution:',
    lead.gclid ? `  gclid: ${lead.gclid}` : '',
    lead.utm_source ? `  utm_source: ${lead.utm_source}` : '',
    lead.utm_medium ? `  utm_medium: ${lead.utm_medium}` : '',
    lead.utm_campaign ? `  utm_campaign: ${lead.utm_campaign}` : '',
    `  landing_url: ${lead.landing_url}`,
  ]
    .filter(Boolean)
    .join('\n')

  // Resend's `to` field accepts an array, but our wrapper uses a string. Send one per recipient.
  const errors: string[] = []
  for (const recipient of recipients) {
    const result = await sendEmail({
      to: recipient,
      subject,
      html,
      text,
      replyTo: lead.email || undefined,
    })
    if (!result.ok) errors.push(`${recipient}: ${result.message}`)
  }

  if (errors.length === recipients.length) {
    return { ok: false, error: errors.join('; ') || 'send_failed' }
  }
  return { ok: true }
}
