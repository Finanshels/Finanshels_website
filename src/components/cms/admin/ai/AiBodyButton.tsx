'use client'

import { useRef, useState } from 'react'
import type { AiContext } from '@/lib/cms/ai/fieldMap'
import { AiGeneratePopover } from './AiGeneratePopover'
import type { AiGeneratePayload } from './useAiGeneration'

interface AiBodyButtonProps {
  context: AiContext
  /** Receives generated HTML to insert into the rich-text editor. */
  onInsert: (html: string) => void
}

function readFieldValue(name?: string): string {
  if (!name) return ''
  const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)
  return el?.value ?? ''
}

/** ✨ Write button for the rich-text toolbar — generates a full article body. */
export function AiBodyButton({ context, onInsert }: AiBodyButtonProps) {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<AiGeneratePayload | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  function handleToggle() {
    if (open) {
      setOpen(false)
      return
    }
    setPayload({
      field: 'body',
      fieldLabel: 'Body',
      title: readFieldValue(context.titleField),
      collection: context.collection,
    })
    setOpen(true)
  }

  return (
    <span className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        title="Write a full draft with AI"
        className="inline-flex h-7 items-center gap-1 rounded-md border border-brand-primary/30 bg-brand-primary/5 px-2 text-[11px] font-semibold text-brand-primary transition hover:border-brand-primary/50 hover:bg-brand-primary/10"
      >
        <span aria-hidden>✨</span>
        AI Write
      </button>
      {open && payload && (
        <AiGeneratePopover
          payload={payload}
          onUse={(html) => onInsert(html)}
          onClose={() => setOpen(false)}
          anchorRef={btnRef}
          align="left"
        />
      )}
    </span>
  )
}
