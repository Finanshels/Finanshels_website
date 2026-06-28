/**
 * Admin-only draft preview banner.
 *
 * Rendered at the top of a public detail page when an admin appends `?preview=1`
 * to the URL (see the public detail routes). Signals that the page is showing
 * the unpublished working draft — not the live published version. Server
 * component; no client JS needed.
 */
export function DraftPreviewBanner() {
  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[9999] border-b border-[#f16610]/40 bg-amber-50 px-4 py-2.5 text-center text-sm text-amber-950 shadow-sm"
    >
      <span
        aria-hidden
        className="mr-2 inline-block h-2 w-2 rounded-full bg-[#f16610] align-middle"
      />
      <strong className="font-semibold text-[#f16610]">Draft preview</strong>
      <span className="text-amber-900"> — not live. Changes are only visible to admins until you publish.</span>
    </div>
  )
}
