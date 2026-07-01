export type PasswordResetEmailParams = {
  recipientName: string
  recipientEmail: string
  resetUrl: string
  expiresAt: Date
  brand?: { siteName?: string; supportEmail?: string }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function renderPasswordResetEmail(
  params: PasswordResetEmailParams
): { subject: string; html: string; text: string } {
  const siteName = params.brand?.siteName ?? 'Finanshels CMS'
  const supportEmail = params.brand?.supportEmail
  const safeName = escapeHtml(params.recipientName || params.recipientEmail.split('@')[0])
  const expires = params.expiresAt.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const subject = `Reset your ${siteName} password`

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#f7f3ee;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f7f3ee;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;background:#ffffff;border:1px solid #e8dccf;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;border-bottom:1px solid #f0e6db;">
                <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#94a3b8;">${escapeHtml(
                  siteName
                )}</p>
                <h1 style="margin:8px 0 0;font-size:22px;line-height:1.3;color:#0f172a;">Reset your password</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;font-size:15px;line-height:1.55;color:#334155;">
                <p style="margin:0 0 14px;">Hi ${safeName},</p>
                <p style="margin:0 0 14px;">
                  We received a request to reset the password for your <strong>${escapeHtml(
                    siteName
                  )}</strong> account.
                </p>
                <p style="margin:0 0 22px;">
                  Click the button below to choose a new password.
                </p>
                <p style="margin:0 0 22px;text-align:center;">
                  <a href="${escapeHtml(params.resetUrl)}"
                     style="display:inline-block;background:#f16610;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">
                    Reset password
                  </a>
                </p>
                <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
                  Or paste this link into your browser:
                </p>
                <p style="margin:0 0 22px;font-size:13px;word-break:break-all;">
                  <a href="${escapeHtml(params.resetUrl)}" style="color:#f16610;text-decoration:underline;">${escapeHtml(
    params.resetUrl
  )}</a>
                </p>
                <p style="margin:0 0 6px;font-size:13px;color:#64748b;">
                  This link expires on <strong>${escapeHtml(
                    expires
                  )}</strong> and can only be used once.
                </p>
                ${
                  supportEmail
                    ? `<p style="margin:18px 0 0;font-size:13px;color:#64748b;">Questions? Reply to this email or contact <a href="mailto:${escapeHtml(
                        supportEmail
                      )}" style="color:#f16610;">${escapeHtml(supportEmail)}</a>.</p>`
                    : ''
                }
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;border-top:1px solid #f0e6db;background:#fffaf5;font-size:11px;color:#94a3b8;">
                If you didn't request a password reset, you can safely ignore this email — your password won't change and the link will simply expire.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = [
    `Hi ${params.recipientName || params.recipientEmail.split('@')[0]},`,
    '',
    `We received a request to reset the password for your ${siteName} account.`,
    '',
    'Choose a new password by opening this link:',
    params.resetUrl,
    '',
    `This link expires on ${expires} and can only be used once.`,
    '',
    `If you didn't request this, you can safely ignore this email.`,
    '',
    `— ${siteName}`,
  ].join('\n')

  return { subject, html, text }
}
