'use client'

import { useRef } from 'react'
import { slugifyForCms } from '@/lib/cms/slugify'
import { AiFieldButton } from './ai/AiFieldButton'
import type { AiContext, AiFieldConfig } from '@/lib/cms/ai/fieldMap'

// This component IS the title field, so the AI config is always a title suggestion.
const TITLE_AI_CONFIG: AiFieldConfig = { kind: 'title', label: 'Suggest', multiChoice: true }

type Props = {
  /** When true, changing the title updates the slug until the slug is edited manually. */
  autoSyncSlug: boolean
  titleName: string
  slugName: string
  titleLabel: string
  slugLabel: string
  titlePlaceholder?: string
  slugPlaceholder?: string
  titleRequired?: boolean
  slugRequired?: boolean
  initialTitle: string
  initialSlug: string
  titleClassName: string
  slugClassName: string
  /** When provided, shows an ✨ "Suggest" button that writes AI titles into the field. */
  aiContext?: AiContext
}

export function CmsTitleSlugFields({
  autoSyncSlug,
  titleName,
  slugName,
  titleLabel,
  slugLabel,
  titlePlaceholder,
  slugPlaceholder,
  titleRequired,
  slugRequired,
  initialTitle,
  initialSlug,
  titleClassName,
  slugClassName,
  aiContext,
}: Props) {
  const slugManual = useRef(!autoSyncSlug)
  const titleRef = useRef<HTMLInputElement>(null)
  const slugRef = useRef<HTMLInputElement>(null)

  const onTitleInput = () => {
    if (!autoSyncSlug || slugManual.current) return
    const next = slugifyForCms(titleRef.current?.value ?? '')
    if (slugRef.current) slugRef.current.value = next
  }

  const onSlugInput = () => {
    slugManual.current = true
  }

  // FIX-057: when the AI "Suggest" button renders, the title group can't be a
  // <label> — a label with no `htmlFor` associates with its first labelable
  // descendant (the Suggest <button>, which precedes the input), so clicking the
  // label caption forwarded a synthetic click to Suggest and popped the AI panel.
  // Use a <div> in that case; keep <label> (correct focus) when there's no button.
  const TitleTag = aiContext ? 'div' : 'label'

  return (
    <>
      <TitleTag className={titleClassName}>
        <span className="flex items-center gap-2">
          {titleLabel}
          {titleRequired ? (
            <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
              Required
            </span>
          ) : null}
          {aiContext ? (
            <AiFieldButton
              targetName={titleName}
              fieldLabel={titleLabel}
              config={TITLE_AI_CONFIG}
              context={aiContext}
            />
          ) : null}
        </span>
        <input
          ref={titleRef}
          type="text"
          name={titleName}
          required={titleRequired}
          defaultValue={initialTitle}
          placeholder={titlePlaceholder}
          onInput={onTitleInput}
          className="mt-2 w-full rounded-xl border border-cms-rule bg-white px-3 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
        {autoSyncSlug ? (
          <p className="mt-1 text-xs text-slate-500">The slug below updates from the title until you edit the slug.</p>
        ) : null}
      </TitleTag>
      <label className={slugClassName}>
        <span className="flex items-center gap-2">
          {slugLabel}
          {slugRequired ? (
            <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
              Required
            </span>
          ) : null}
        </span>
        <input
          ref={slugRef}
          type="text"
          name={slugName}
          required={slugRequired}
          defaultValue={initialSlug}
          placeholder={slugPlaceholder}
          onInput={onSlugInput}
          className="mt-2 w-full rounded-xl border border-cms-rule bg-white px-3 py-2.5 font-mono text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
        />
      </label>
    </>
  )
}
