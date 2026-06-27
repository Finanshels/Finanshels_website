'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import { getSectionCatalogEntry } from '@/lib/landing-pages/sectionCatalog'
import type { LandingPageTemplateMeta } from '@/lib/landing-pages/templates'
import { LucideIcon } from './fields/lucideClient'
import AiDraftDialog from './AiDraftDialog'

type ServiceInterest = { label: string; value: string }

const BLANK_ID = ''

export default function CreateLandingPageForm({
  action,
  draftAction,
  aiConfigured = false,
  serviceInterests,
  templates,
}: {
  action: (formData: FormData) => void | Promise<void>
  draftAction?: (formData: FormData) => void | Promise<void>
  aiConfigured?: boolean
  serviceInterests: readonly ServiceInterest[]
  templates: LandingPageTemplateMeta[]
}) {
  const [templateId, setTemplateId] = useState<string>(BLANK_ID)
  const [service, setService] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [aiOpen, setAiOpen] = useState<boolean>(false)

  function pickTemplate(id: string, recommendedService?: string) {
    setTemplateId(id)
    if (recommendedService && !service) setService(recommendedService)
  }

  return (
    <>
    <form action={action} className="space-y-4">
      <input type="hidden" name="template" value={templateId} />

      <div className="flex flex-col gap-2 md:flex-row">
        <input
          name="internal_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Internal name (e.g. Corporate Tax — Q3 2026)"
          required
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <select
          name="service_interest"
          required
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="" disabled>
            Service interest
          </option>
          {serviceInterests.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Create
        </button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Start from a template</p>
          {aiConfigured && draftAction ? (
            <button
              type="button"
              onClick={() => setAiOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
            >
              <Sparkles className="h-3.5 w-3.5" /> Draft with AI
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <TemplateCard
            selected={templateId === BLANK_ID}
            onClick={() => pickTemplate(BLANK_ID)}
            name="Blank page"
            description="Start empty and add sections yourself."
            sectionTypes={[]}
          />
          {templates.map((t) => (
            <TemplateCard
              key={t.id}
              selected={templateId === t.id}
              onClick={() => pickTemplate(t.id, t.recommendedService)}
              name={t.name}
              description={t.description}
              sectionTypes={t.sectionTypes}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-400">
          Pick a template, start blank, or let AI draft the whole page from a short brief.
        </p>
      </div>
    </form>

    {aiConfigured && draftAction ? (
      <AiDraftDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        action={draftAction}
        serviceInterests={serviceInterests}
        defaultName={name}
        defaultService={service}
      />
    ) : null}
    </>
  )
}

function TemplateCard({
  selected,
  onClick,
  name,
  description,
  sectionTypes,
}: {
  selected: boolean
  onClick: () => void
  name: string
  description: string
  sectionTypes: string[]
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col rounded-xl border p-3 text-left transition ${
        selected ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <span className="text-sm font-semibold text-slate-900">{name}</span>
      <span className="mt-0.5 text-xs text-slate-500">{description}</span>
      {sectionTypes.length > 0 ? (
        <span className="mt-2 flex flex-wrap items-center gap-1">
          {sectionTypes.map((type, i) => {
            const entry = getSectionCatalogEntry(type)
            return (
              <span
                key={`${type}-${i}`}
                title={entry?.label ?? type}
                className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-slate-500"
              >
                <LucideIcon name={entry?.icon ?? 'square'} className="h-3 w-3" />
              </span>
            )
          })}
        </span>
      ) : (
        <span className="mt-2 text-[11px] text-slate-400">Empty</span>
      )}
    </button>
  )
}
