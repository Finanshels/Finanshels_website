'use client'

import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2, Sparkles, X } from 'lucide-react'

type ServiceInterest = { label: string; value: string }

const INPUT = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'

export default function AiDraftDialog({
  open,
  onClose,
  action,
  serviceInterests,
  defaultName,
  defaultService,
}: {
  open: boolean
  onClose: () => void
  action: (formData: FormData) => void | Promise<void>
  serviceInterests: readonly ServiceInterest[]
  defaultName: string
  defaultService: string
}) {
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Draft with AI"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles className="h-4 w-4 text-violet-600" /> Draft with AI
          </h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={action} className="space-y-3 p-5">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">Internal name <span className="text-rose-600">*</span></span>
            <input name="internal_name" required defaultValue={defaultName} placeholder="Corporate Tax — Q3 2026" className={INPUT} />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Service interest <span className="text-rose-600">*</span></span>
            <select name="service_interest" required defaultValue={defaultService} className={INPUT}>
              <option value="" disabled>
                Select…
              </option>
              {serviceInterests.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Campaign goal <span className="text-rose-600">*</span></span>
            <textarea
              name="goal"
              required
              rows={2}
              placeholder="e.g. Get UAE SMEs to book a free corporate-tax consultation before the filing deadline"
              className={INPUT}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Audience</span>
              <input name="audience" placeholder="SME founders" className={INPUT} />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-slate-700">Tone</span>
              <input name="tone" placeholder="reassuring, expert" className={INPUT} />
            </label>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-slate-700">Key offer / hook</span>
            <input name="offer" placeholder="Free consultation + penalty-free guarantee" className={INPUT} />
          </label>

          <p className="text-xs text-slate-400">
            AI writes the copy and picks sections, then drops you into the editor with an unpublished draft. Images stay blank for you to add.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Generating…
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" /> Generate draft
        </>
      )}
    </button>
  )
}
