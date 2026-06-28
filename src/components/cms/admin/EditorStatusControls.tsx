'use client'

/**
 * Editor header publish controls.
 *
 * FIX-054: status is carried in a real hidden input (`requestedStatus`) that we
 * set on click before the native submit runs — NOT by the clicked submit button's
 * name/value. React/Next 15.5 drops the submitter's name/value from a Server
 * Action's FormData (only real form fields survive), so a `value="published"` on
 * the button arrived empty and every "Publish" silently saved as the current
 * status (draft). Hidden inputs DO serialize, so the server (which reads
 * `formData.get('requestedStatus')`) gets the right value.
 *
 * FIX-055: discoverability. The old control was a subtle `Draft | Published`
 * segmented toggle that didn't read as a publish action, while a loud orange
 * "PUBLISH" tab in the right rail (an already-active settings tab, inert on click)
 * stole the attention — so users clicked the tab, nothing happened, and concluded
 * "publish is broken". Replaced with explicit, intent-labeled buttons: a secondary
 * Save and a primary green Publish (or Submit-for-review for editors / Unpublish
 * when already live).
 *
 * FIX-056: republish affordance. When editing an ALREADY-published doc (admin/
 * owner), the prominent slot used to be a passive "✓ Published" chip (no action),
 * and the only thing that actually pushed edits live was the secondary Save — which
 * didn't say so. Worse, autosave persists edits to Firestore but deliberately does
 * NOT revalidate the public route, so "Saved ✓" gave false confidence the changes
 * were live. Replaced the dead chip (status is still shown by the PUBLISHED pill
 * next to the title) AND the now-redundant Save with one primary green "Republish"
 * button: re-saves with status=published and triggers revalidation. Save/Republish
 * did the exact same thing for a live doc, so they're collapsed into one clear CTA.
 */

const FORM_ID = 'cms-editor-form'

type Props = {
  currentStatus: string
  /** Routed collections gate public exposure behind an in_review step. */
  showReviewStatus: boolean
  /** admin/owner can publish directly; editors submit for review. */
  canPublish: boolean
}

function setRequestedStatus(value: string): void {
  const form = document.getElementById(FORM_ID) as HTMLFormElement | null
  const input = form?.querySelector<HTMLInputElement>('input[name="requestedStatus"]')
  if (input) input.value = value
  // The button is type="submit"; the native submit proceeds after this handler
  // with the hidden input now carrying the chosen status.
}

const BTN_BASE = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition'
const BTN_SECONDARY = `${BTN_BASE} border border-cms-rule bg-white text-slate-700 hover:bg-cms-soft`
const BTN_PUBLISH = `${BTN_BASE} bg-emerald-600 px-3.5 text-white shadow-[0_6px_18px_rgba(5,150,105,0.25)] hover:bg-emerald-700`
const BTN_REVIEW = `${BTN_BASE} bg-blue-600 px-3.5 text-white shadow-sm hover:bg-blue-700`

export function EditorStatusControls({ currentStatus, showReviewStatus, canPublish }: Props) {
  const isPublished = currentStatus === 'published'
  const isInReview = currentStatus === 'in_review'
  // FIX-056: for a live doc, an admin's "Republish" already does the save (persist
  // + revalidate), so the generic secondary Save is redundant and is hidden here.
  const isLiveAdmin = canPublish && isPublished

  return (
    <>
      {/* Real form field — always serialized (unlike a submit button's value).
          Defaults to the current status so a plain submit is a no-op change. */}
      <input type="hidden" name="requestedStatus" defaultValue={currentStatus} />

      {/* Save — persists field edits and keeps the current status (so editing a
          live doc and hitting Save keeps it live). Secondary, beside the primary.
          Hidden for live admin docs, where "Republish" is the save (FIX-056). */}
      {isLiveAdmin ? null : (
        <button
          type="submit"
          onClick={() => setRequestedStatus(currentStatus)}
          title="Save your changes and keep the current status"
          className={BTN_SECONDARY}
        >
          <span aria-hidden>💾</span> Save
        </button>
      )}

      {!canPublish ? (
        /* Editors can't publish directly — they hand off for review. */
        isPublished ? (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span aria-hidden>✓</span> Published
          </span>
        ) : isInReview ? (
          <span className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
            Awaiting approval
          </span>
        ) : (
          <button
            type="submit"
            onClick={() => setRequestedStatus('in_review')}
            title="Send this to an admin to review and publish"
            className={BTN_REVIEW}
          >
            Submit for review
          </button>
        )
      ) : isPublished ? (
        /* Already live — primary "Republish" pushes the latest edits live (re-saves
           with status=published and revalidates the public route), plus an explicit
           Unpublish. The PUBLISHED pill by the title carries the status, so no
           separate passive chip is needed here (FIX-056). */
        <>
          <button
            type="submit"
            onClick={() => setRequestedStatus('published')}
            title="Push your latest edits live — re-saves and refreshes the public page"
            className={BTN_PUBLISH}
          >
            <span aria-hidden>●</span> Republish
          </button>
          <button
            type="submit"
            onClick={() => setRequestedStatus('draft')}
            title="Revert to draft — removes this from the public site"
            className={BTN_SECONDARY}
          >
            Unpublish
          </button>
        </>
      ) : (
        /* Draft / in-review → loud green Publish; routed collections also get a
           subtle "Send for review" so the editorial step stays available. */
        <>
          {showReviewStatus && !isInReview ? (
            <button
              type="submit"
              onClick={() => setRequestedStatus('in_review')}
              title="Mark as ready for review (doesn't go live yet)"
              className={BTN_SECONDARY}
            >
              Send for review
            </button>
          ) : null}
          <button
            type="submit"
            onClick={() => setRequestedStatus('published')}
            title="Publish now — makes this live on the site"
            className={BTN_PUBLISH}
          >
            <span aria-hidden>●</span> Publish
          </button>
        </>
      )}
    </>
  )
}
