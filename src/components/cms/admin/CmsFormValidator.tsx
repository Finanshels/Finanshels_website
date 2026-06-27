'use client'

import { useEffect, useState } from 'react'

interface CmsFormValidatorProps {
  /** The `?error=` reason from the server action redirect, if any. */
  error: string | null
}

interface ParsedError {
  /** `name` attribute of the field to highlight, or null for form-level errors. */
  fieldName: string | null
  /** Plain-language message for a non-technical editor. */
  message: string
}

/** Turn a field/error slug into a readable label: `featured_image` → "Featured image". */
function humanize(slug: string): string {
  const words = slug.replace(/[_-]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/**
 * Map a server error code to a friendly message + the field it concerns.
 * Server actions redirect with `?error=missing-<field>`, `invalid-<field>`,
 * `slug-taken`, `missing-altText`, `save-failed`, etc.
 */
function parseError(error: string): ParsedError {
  if (error === 'slug-taken')
    return { fieldName: 'slug', message: 'That URL slug is already taken — choose a different one.' }
  if (error === 'missing-slug')
    return { fieldName: 'slug', message: 'Add a URL slug before saving.' }
  // FIX-052: these are two different fields. `missing-altText` is the
  // media_assets field `altText`; `missing-featured_image_alt` is the blog_posts
  // field `featured_image_alt`. Mapping both to `featured_image_alt` meant the
  // media-library error highlighted a non-existent selector.
  if (error === 'missing-altText')
    return {
      fieldName: 'altText',
      message: 'Add alt text for this image — it helps accessibility and SEO.',
    }
  if (error === 'missing-featured_image_alt')
    return {
      fieldName: 'featured_image_alt',
      message: 'Add alt text for the featured image — it helps accessibility and SEO.',
    }
  if (error === 'save-failed')
    return { fieldName: null, message: "Couldn't save your changes. Please try again." }

  if (error.startsWith('missing-')) {
    const field = error.slice('missing-'.length)
    return { fieldName: field, message: `${humanize(field)} is required.` }
  }
  if (error.startsWith('invalid-')) {
    const field = error.slice('invalid-'.length)
    return { fieldName: field, message: `The ${humanize(field).toLowerCase()} value isn't valid — please review it.` }
  }

  // Fallback for anything not field-specific (bulk actions, rollback, etc.).
  return { fieldName: null, message: `${humanize(error)}.` }
}

const HIGHLIGHT_DELAY_MS = 80
const HIGHLIGHT_OUTLINE = '2px solid #ef4444'
const HIGHLIGHT_OFFSET = '2px'

/**
 * Progressive-enhancement validator. Instead of leaving a raw error code in a
 * banner, it scrolls to the exact field, outlines it in red, focuses it, and
 * shows a friendly message — then clears the moment the editor starts typing.
 * Renders nothing on the server; activates after hydration.
 */
export function CmsFormValidator({ error }: CmsFormValidatorProps) {
  const [active, setActive] = useState<ParsedError | null>(null)

  useEffect(() => {
    if (!error) {
      setActive(null)
      return
    }

    const parsed = parseError(error)
    setActive(parsed)

    let cleanup: (() => void) | undefined

    if (parsed.fieldName) {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${parsed.fieldName}"]`,
      )
      // offsetParent is null when the field (or an ancestor) is display:none,
      // e.g. inside an inactive tab — in that case just show the message.
      if (el && el.offsetParent !== null) {
        el.style.outline = HIGHLIGHT_OUTLINE
        el.style.outlineOffset = HIGHLIGHT_OFFSET
        el.setAttribute('aria-invalid', 'true')

        const timer = window.setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.focus({ preventScroll: true })
        }, HIGHLIGHT_DELAY_MS)

        const clear = () => {
          el.style.outline = ''
          el.style.outlineOffset = ''
          el.removeAttribute('aria-invalid')
          el.removeEventListener('input', clear)
          setActive(null)
        }
        el.addEventListener('input', clear)

        cleanup = () => {
          window.clearTimeout(timer)
          el.style.outline = ''
          el.style.outlineOffset = ''
          el.removeAttribute('aria-invalid')
          el.removeEventListener('input', clear)
        }
      } else if (el) {
        // Field exists but is in a collapsed/inactive tab (display:none): we can't
        // scroll to or focus it, but still clear the toast once the user edits it,
        // and tell them where to look instead of leaving a dead-end message.
        setActive({ ...parsed, message: `${parsed.message} It’s inside a collapsed tab — open the tabs to find it.` })
        const clearHidden = () => {
          el.removeEventListener('input', clearHidden)
          setActive(null)
        }
        el.addEventListener('input', clearHidden)
        cleanup = () => el.removeEventListener('input', clearHidden)
      }
    }

    // Strip ?error= from the URL so a manual refresh doesn't re-trigger it.
    try {
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    } catch {
      /* URL API unavailable — non-fatal */
    }

    return () => cleanup?.()
  }, [error])

  if (!active) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border border-red-200 bg-white px-4 py-3 shadow-lg shadow-red-900/5">
        <span
          aria-hidden
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-[11px] font-bold text-red-600"
        >
          !
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900">{active.message}</p>
          {active.fieldName ? (
            <p className="mt-0.5 text-xs text-slate-500">We&rsquo;ve highlighted the field for you.</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-label="Dismiss"
          className="shrink-0 text-base leading-none text-slate-400 transition hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
