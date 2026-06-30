import { type RenderedEmail } from './webinarConfirmation'

/**
 * FIX-071: lead-facing email carrying the gated ebook download link.
 *
 * The download URL is delivered by email (not served instantly in the browser)
 * so a valid, reachable inbox is required to obtain the resource — this is the
 * anti-spam measure requested in the June-29 review. The route falls back to an
 * in-browser download only when email delivery is unavailable.
 */

export type EbookDownloadEmailInput = {
  recipientName: string
  ebookTitle: string
  downloadUrl: string
  ebookUrl: string
}

const BRAND = '#2563eb'

export function buildEbookDownloadEmail(input: EbookDownloadEmailInput): RenderedEmail {
  const firstName = input.recipientName.trim().split(/\s+/)[0] || 'there'
  const subject = `Your download: ${input.ebookTitle}`

  const text = [
    `Hi ${firstName},`,
    '',
    `Thanks for downloading "${input.ebookTitle}".`,
    `Get your copy here: ${input.downloadUrl}`,
    '',
    `Resource page: ${input.ebookUrl}`,
    '',
    '— The Finanshels team',
  ].join('\n')

  const button = (href: string, label: string) =>
    `<a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:11px 20px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;background:${BRAND};color:#ffffff;">${label}</a>`

  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;max-width:560px;margin:0 auto;">
    <h1 style="font-size:20px;margin:0 0 8px;">Your download is ready 📄</h1>
    <p style="margin:0 0 16px;color:#475569;font-size:14px;line-height:1.6;">
      Hi ${firstName}, thanks for your interest in <strong>${input.ebookTitle}</strong>. Tap the button below to open it.
    </p>
    <div style="margin:0 0 18px;">
      ${button(input.downloadUrl, 'Download now')}
    </div>
    <p style="margin:0 0 16px;color:#475569;font-size:13px;line-height:1.6;">
      If the button doesn&apos;t work, copy and paste this link into your browser:<br />
      <a href="${input.downloadUrl}" style="color:${BRAND};word-break:break-all;">${input.downloadUrl}</a>
    </p>
    <p style="margin:0;color:#94a3b8;font-size:12px;">
      Resource page: <a href="${input.ebookUrl}" style="color:${BRAND};">${input.ebookUrl}</a>
    </p>
  </div>`

  return { subject, html, text }
}
