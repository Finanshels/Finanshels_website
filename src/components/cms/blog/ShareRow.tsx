'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

const BTN =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#f16610]/40 hover:text-[#f16610]'

/** X / LinkedIn / copy-link share controls. Title + URL come from the server. */
export function ShareRow({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard blocked (insecure context / permissions) — silently no-op.
    }
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Share</span>
      <a className={BTN} href={xHref} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      </a>
      <a className={BTN} href={linkedInHref} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.74v20.52C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.74V1.74C24 .78 23.2 0 22.22 0Z" />
        </svg>
      </a>
      <button type="button" className={BTN} onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'}>
        {copied ? <Check className="h-4 w-4 text-[#f16610]" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  )
}
