'use client'

/**
 * Sticky editor header bar for the CMS collection editor — the client island that
 * owns autosave state and mounts the shared two-version <PublishControls>.
 *
 * Why a dedicated client component instead of inline JSX in the (server) editor
 * page:
 *  1. <PublishControls> needs the LIVE autosave `savingState`, which only exists
 *     client-side (AutosaveManager). A server-rendered page can't feed it.
 *  2. <PublishControls> renders its own <form> elements (Publish / Unpublish /
 *     Submit-for-review). Those must NOT nest inside the main editor <form>, so
 *     this bar lives OUTSIDE it. The draft-side controls (Draft / In Review /
 *     Save) submit the editor form via the `form="…"` attribute instead of being
 *     physically nested in it.
 *
 * The Publish/Republish/Unpublish/Submit server actions are passed in already
 * bound to (collection, slug) by the editor page — they don't read the editor
 * form, they operate on the persisted draft via the publishWorkflow ops.
 */

import { useCallback, useState } from 'react'
import { AutosaveManager } from './AutosaveManager'
import { type AutosaveState } from './AutosaveIndicator'
import { PublishControls } from './PublishControls'

interface EditorPublishBarProps {
  /** Editor form id — draft-side buttons target it via the `form` attribute. */
  formId: string
  collection: string
  /** Persisted doc slug (undefined in create mode → autosave/publish stay off). */
  slug?: string
  /** Workflow status of the working draft. */
  status: 'draft' | 'in_review' | 'published' | 'archived'
  /** Persisted draft differs from the published snapshot → drives "Republish". */
  hasUnpublishedChanges: boolean
  /** admin/owner → can publish; editor → submit-for-review. */
  canPublish: boolean
  /** Human label e.g. "Published 12 Jun 2026" (null when never published). */
  publishedAtLabel?: string | null
  /** Public route + `?preview=1`. */
  previewUrl: string
  /** Public route (only meaningful when published). */
  liveUrl?: string | null

  publishAction: (formData: FormData) => void | Promise<void>
  unpublishAction: (formData: FormData) => void | Promise<void>
  // NOTE: submit-for-review intentionally flows through the "In Review" draft-side
  // button (which submits the editor form, persisting the editor's unsaved edits),
  // not PublishControls' submitForReviewAction (which would discard them). So we
  // don't pass that prop down — the In Review button is the canonical editor path.
}

export function EditorPublishBar({
  formId,
  collection,
  slug,
  status,
  hasUnpublishedChanges,
  canPublish,
  publishedAtLabel,
  previewUrl,
  liveUrl,
  publishAction,
  unpublishAction,
}: EditorPublishBarProps) {
  const [savingState, setSavingState] = useState<AutosaveState>('idle')
  const handleStateChange = useCallback((s: AutosaveState) => setSavingState(s), [])

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {/* Autosave is slug-gated: a brand-new doc is committed via the Save button. */}
      {slug ? (
        <AutosaveManager
          formId={formId}
          collection={collection}
          slug={slug}
          currentStatus={status}
          onStateChange={handleStateChange}
        />
      ) : null}

      {/* Draft-side controls — submit the editor form (status changes that are
          NOT publish: keep-as-draft, send-for-review, and a plain field save). */}
      <div className="inline-flex overflow-hidden rounded-lg border border-cms-rule bg-white text-[11px] font-semibold uppercase tracking-wide">
        <button
          type="submit"
          form={formId}
          name="requestedStatus"
          value="draft"
          title="Save as draft"
          className={`px-2.5 py-2 transition ${
            status === 'draft' ? 'bg-amber-100 text-amber-800' : 'text-slate-600 hover:bg-cms-soft'
          }`}
        >
          Draft
        </button>
        <button
          type="submit"
          form={formId}
          name="requestedStatus"
          value="in_review"
          title="Send for review"
          className={`border-l border-cms-rule px-2.5 py-2 transition ${
            status === 'in_review' ? 'bg-blue-100 text-blue-800' : 'text-slate-600 hover:bg-cms-soft'
          }`}
        >
          In Review
        </button>
      </div>
      <button
        type="submit"
        form={formId}
        name="requestedStatus"
        value={status}
        title="Save field changes, keep current status"
        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-[0_6px_18px_rgba(15,23,42,0.18)] hover:bg-slate-800"
      >
        <span aria-hidden>💾</span> Save changes
      </button>

      {/* Shared two-version publish controls (Publish / Republish / Unpublish /
          Preview / View live). Only mounted once the doc is persisted. */}
      {slug ? (
        <PublishControls
          status={status}
          hasUnpublishedChanges={hasUnpublishedChanges}
          savingState={savingState}
          publishedAtLabel={publishedAtLabel}
          previewUrl={previewUrl}
          liveUrl={liveUrl}
          canPublish={canPublish}
          publishAction={publishAction}
          unpublishAction={unpublishAction}
        />
      ) : null}
    </div>
  )
}
