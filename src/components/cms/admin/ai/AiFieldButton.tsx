'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'
import type { AiContext, AiFieldConfig } from '@/lib/cms/ai/fieldMap'
import { AiGeneratePopover } from './AiGeneratePopover'
import type { AiGeneratePayload } from './useAiGeneration'

interface AiFieldButtonProps {
  targetName: string
  fieldLabel: string
  config: AiFieldConfig
  context: AiContext
}

function readFieldValue(name?: string): string {
  if (!name) return ''
  const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)
  return el?.value ?? ''
}

/** Write a value into an uncontrolled input/textarea and notify React + autosave. */
function injectValue(name: string, value: string): void {
  const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`)
  if (!el) return
  const proto =
    el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
  el.focus()
}

export function AiFieldButton({ targetName, fieldLabel, config, context }: AiFieldButtonProps) {
  const [open, setOpen] = useState(false)
  const [payload, setPayload] = useState<AiGeneratePayload | null>(null)

  function handleToggle() {
    if (open) {
      setOpen(false)
      return
    }
    // Snapshot live context at open time so the model sees the latest edits.
    setPayload({
      field: config.kind,
      fieldLabel,
      title: readFieldValue(context.titleField),
      body: readFieldValue(context.bodyField),
      collection: context.collection,
    })
    setOpen(true)
  }

  return (
    <span className="relative ml-auto inline-flex">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'inline-flex items-center gap-1 rounded-md border border-brand-primary/30 bg-brand-primary/5',
          'px-2 py-0.5 text-[11px] font-semibold text-brand-primary transition',
          'hover:border-brand-primary/50 hover:bg-brand-primary/10',
        )}
      >
        <span aria-hidden>✨</span>
        {config.label}
      </button>
      {open && payload && (
        <AiGeneratePopover
          payload={payload}
          multiChoice={config.multiChoice}
          charLimit={config.charLimit}
          onUse={(text) => injectValue(targetName, text)}
          onClose={() => setOpen(false)}
        />
      )}
    </span>
  )
}
