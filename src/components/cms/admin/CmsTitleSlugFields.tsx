'use client'

import { useRef } from 'react'
import { slugifyForCms } from '@/lib/cms/slugify'

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

  return (
    <>
      <label className={titleClassName}>
        <span className="flex items-center gap-2">
          {titleLabel}
          {titleRequired ? (
            <span className="rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
              Required
            </span>
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
      </label>
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
