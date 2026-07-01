'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Copy, ExternalLink } from 'lucide-react'
import { ROLE_LABEL, isValidRole } from '@/lib/cms/roles'

interface InviteLinkCardProps {
  url: string
  email: string
  /** Role assigned to the invitee, used to label the link's effect. */
  role?: string
  /** `success` when an email also went out; `warning` when email is the only delivery and it failed. */
  tone?: 'success' | 'warning'
  /** Optional extra context (e.g. the email-send failure reason). */
  note?: string
}

/**
 * Copyable one-time invite link. The link is bound server-side to the invitee's
 * email + role (the token resolves to their `cms_users` record), so whoever opens
 * it joins exactly as that email, with that role. Admin-only surface.
 */
export function InviteLinkCard({ url, email, role, tone = 'success', note }: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false)

  // The link arrives via the page querystring; once we've captured it into this
  // component, scrub the token-bearing params from the address bar so the raw
  // one-time token isn't persisted in browser history. The card keeps rendering
  // from props; a manual refresh then simply drops the (already-used) link.
  useEffect(() => {
    try {
      const current = new URL(window.location.href)
      let changed = false
      for (const key of ['inviteUrl', 'inviteEmail', 'inviteRole']) {
        if (current.searchParams.has(key)) {
          current.searchParams.delete(key)
          changed = true
        }
      }
      if (changed) window.history.replaceState(null, '', current.toString())
    } catch {
      // best-effort; never block rendering on history access
    }
  }, [])

  const handleCopy = useCallback(async () => {
    const ok = await copyText(url)
    if (!ok) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }, [url])

  const roleLabel = role && isValidRole(role) ? ROLE_LABEL[role] : null
  const palette =
    tone === 'warning'
      ? { border: 'border-amber-300', bg: 'bg-amber-50', text: 'text-amber-900', sub: 'text-amber-800/80' }
      : { border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-900', sub: 'text-emerald-800/80' }

  return (
    <div className={`rounded-2xl border ${palette.border} ${palette.bg} p-4 ${palette.text}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em]">Invite link</p>
      <p className="mt-1 text-sm">
        Share with <strong>{email}</strong>
        {roleLabel ? (
          <>
            {' '}— they’ll join as <strong>{roleLabel}</strong>
          </>
        ) : null}
        . One-time link, expires in 7 days.
        {note ? <span className={`ml-1 ${palette.sub}`}>({note})</span> : null}
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2">
        <code className="flex-1 truncate text-xs text-slate-700" title={url}>
          {url}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy invite link"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-900 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-slate-700"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label="Open invite link"
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ExternalLink size={14} /> Open
        </a>
      </div>
    </div>
  )
}

/** Clipboard write with a textarea fallback for non-secure contexts / older browsers. */
async function copyText(value: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // fall through to the legacy path
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = value
    ta.setAttribute('readonly', '')
    ta.style.position = 'absolute'
    ta.style.left = '-9999px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}
