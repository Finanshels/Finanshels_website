'use client'

/**
 * Shared publish toolbar for the two-version draft/publish workflow (Phase 3).
 *
 * One presentational client component that BOTH the CMS collection editor
 * (`/admin/cms`) and the landing-page editor mount, so Save-draft / Publish /
 * Republish / Unpublish / Preview / status UX stays identical across them.
 *
 * Server actions are passed in as props and invoked via `<form action={...}>`,
 * matching the repo's server-action-in-props pattern (see the segmented status
 * control in `src/app/admin/cms/page.tsx` and `AiDraftDialog`'s `SubmitButton`).
 * Per-form pending state comes from `useFormStatus`, so each action's button
 * disables itself while its own form is in flight.
 *
 * This component is purely presentational: it renders the state→controls matrix
 * and nothing else. Autosave, diffing, and the actual writes live elsewhere —
 * the editor feeds in `savingState` / `hasUnpublishedChanges` and binds the
 * actions.
 */

import { useFormStatus } from 'react-dom'
import { Button } from './ui'
import { AutosaveIndicator } from './AutosaveIndicator'

export type SavingState = 'idle' | 'saving' | 'saved' | 'error'

export type PublishStatus = 'draft' | 'in_review' | 'published' | 'archived'

export interface PublishControlsProps {
  /** Workflow status of the working draft. */
  status: PublishStatus
  /** Persisted draft differs from the published snapshot → drives "Republish". */
  hasUnpublishedChanges: boolean
  /** Autosave indicator state, owned by the editor. */
  savingState: SavingState
  /** Human label for when the doc was published, e.g. "Published 2h ago". */
  publishedAtLabel?: string | null
  /** Public route + `?preview=1` (admin-only draft preview). */
  previewUrl: string
  /** Public route — only present (and only shown) when published. */
  liveUrl?: string | null
  /** Role gate: admin/owner → true (sees Publish); editor → false (Submit for review). */
  canPublish: boolean

  /** Serves BOTH Publish and Republish (same action, label differs). */
  publishAction: (formData: FormData) => void | Promise<void>
  /** Unpublish: flip status so the live URL 404s. */
  unpublishAction: (formData: FormData) => void | Promise<void>
  /** CMS editor, editor role only: submit the draft for review. */
  submitForReviewAction?: (formData: FormData) => void | Promise<void>
}

/**
 * Submit button whose disabled state tracks ONLY its own enclosing form's
 * pending status (via `useFormStatus`), so an in-flight Publish doesn't also
 * grey out Unpublish. Mirrors `AiDraftDialog`'s `SubmitButton`.
 */
function ActionButton({
  children,
  variant = 'secondary',
  pendingLabel,
  'aria-label': ariaLabel,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  pendingLabel: string
  'aria-label': string
}) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant={variant} size="sm" disabled={pending} aria-label={ariaLabel}>
      {pending ? (
        <>
          <span
            className="mr-0.5 inline-block h-2 w-2 animate-pulse rounded-full bg-current opacity-70"
            aria-hidden
          />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  )
}

/** External link to a public route, opened in a new tab. */
function LinkButton({ href, children, label }: { href: string; children: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-cms-rule bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-700 transition hover:bg-cms-hover"
    >
      {children} <span aria-hidden>↗</span>
    </a>
  )
}

/** Muted, non-interactive chip — e.g. "Awaiting approval", "Published 2h ago". */
function StatusChip({ children }: { children: React.ReactNode }) {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-1.5 rounded-full border border-cms-rule bg-cms-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500"
    >
      {children}
    </span>
  )
}

export function PublishControls({
  status,
  hasUnpublishedChanges,
  savingState,
  publishedAtLabel,
  previewUrl,
  liveUrl,
  canPublish,
  publishAction,
  unpublishAction,
  submitForReviewAction,
}: PublishControlsProps) {
  const isPublished = status === 'published'
  const draftAhead = isPublished && hasUnpublishedChanges
  // "Saved ✓ / Published 2h ago" replaces the live saving indicator only when a
  // published doc is fully in sync (nothing new to push).
  const isPublishedInSync = isPublished && !hasUnpublishedChanges

  const previewLink = <LinkButton href={previewUrl} label="Open draft preview in a new tab">Preview</LinkButton>
  const liveLink =
    isPublished && liveUrl ? (
      <LinkButton href={liveUrl} label="Open the live published page in a new tab">View live</LinkButton>
    ) : null

  const publishButton = (
    <form action={publishAction} className="contents">
      <ActionButton
        variant="primary"
        aria-label={draftAhead ? 'Republish draft changes to the live page' : 'Publish this page'}
        pendingLabel={draftAhead ? 'Republishing…' : 'Publishing…'}
      >
        {draftAhead ? 'Republish' : 'Publish'}
      </ActionButton>
    </form>
  )

  const submitForReviewButton =
    !canPublish && submitForReviewAction ? (
      <form action={submitForReviewAction} className="contents">
        <ActionButton variant="primary" aria-label="Submit this draft for review" pendingLabel="Submitting…">
          Submit for review
        </ActionButton>
      </form>
    ) : null

  const unpublishButton = (
    <form action={unpublishAction} className="contents">
      <ActionButton
        variant="secondary"
        aria-label="Unpublish — take this page off the live site"
        pendingLabel="Unpublishing…"
      >
        Unpublish
      </ActionButton>
    </form>
  )

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Publish controls">
      {/* Status / saving indicator slot */}
      {isPublishedInSync ? (
        <StatusChip>
          <span className="text-emerald-500" aria-hidden>✓</span>
          {publishedAtLabel ?? 'Published'}
        </StatusChip>
      ) : (
        <AutosaveIndicator state={savingState} />
      )}

      {/* Primary action slot */}
      {status === 'in_review' && !canPublish ? (
        <StatusChip>Awaiting approval</StatusChip>
      ) : null}
      {/* draft + in_review (with publish rights) + published-draft-ahead all show Publish/Republish */}
      {canPublish && (status === 'draft' || status === 'in_review' || draftAhead) ? publishButton : null}
      {/* editor on a fresh draft → submit for review */}
      {!canPublish && status === 'draft' ? submitForReviewButton : null}

      {/* Unpublish — only meaningful once published */}
      {isPublished ? unpublishButton : null}

      {/* Links */}
      {previewLink}
      {liveLink}
    </div>
  )
}
