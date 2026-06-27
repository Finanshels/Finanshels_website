'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { CmsFaq } from '@/lib/cms/schemas/faqs'

interface FaqGroup {
  topic: string
  items: CmsFaq[]
}

interface FaqAccordionProps {
  groups: FaqGroup[]
}

export function FaqAccordion({ groups }: FaqAccordionProps) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.topic}>
          {group.topic !== 'General' && (
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              {group.topic}
            </h2>
          )}
          <div className="space-y-2.5">
            {group.items.map((faq) => {
              const isOpen = open === faq.slug
              return (
                <div
                  key={faq.slug}
                  className={cn(
                    'rounded-2xl border bg-white transition-all duration-200',
                    isOpen
                      ? 'border-[#f16610]/30 shadow-[0_12px_36px_-12px_rgba(241,102,16,0.2)]'
                      : 'border-slate-100 hover:border-[#f16610]/20'
                  )}
                >
                  <button
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpen(isOpen ? null : faq.slug)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xl font-light transition-all duration-200',
                        isOpen
                          ? 'rotate-45 bg-[#f16610] text-white'
                          : 'bg-[#fff4ec] text-[#f16610]'
                      )}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
