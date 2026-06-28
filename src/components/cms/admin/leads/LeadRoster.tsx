'use client'

import { useCallback, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { LeadAvatar, ZohoStatusPill } from './LeadBadges'
import { LeadDrawer } from './LeadDrawer'
import type { LeadAction, LeadView } from './leadTypes'

interface LeadRosterProps {
  leads: LeadView[]
  retryZoho: LeadAction
}

/** Compact, full-width row per lead. The whole row opens the detail drawer. */
export function LeadRoster({ leads, retryZoho }: LeadRosterProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = leads.find((l) => l.id === selectedId) ?? null
  const handleClose = useCallback(() => setSelectedId(null), [])

  return (
    <>
      <ul className="divide-y divide-cms-rule">
        {leads.map((l) => (
          <li key={l.id}>
            <button
              type="button"
              onClick={() => setSelectedId(l.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cms-soft"
            >
              <LeadAvatar name={l.name} email={l.email} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{l.name || '(no name)'}</p>
                <p className="truncate text-xs text-slate-500">
                  {l.email}
                  <span className="text-slate-400"> · {l.serviceLabel}</span>
                </p>
              </div>
              <div className="hidden flex-col items-end gap-1 sm:flex">
                <ZohoStatusPill status={l.zohoStatus} />
                <span className="text-[11px] text-slate-400">{l.submittedLabel}</span>
              </div>
              <ChevronRight size={18} className="shrink-0 text-slate-400" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <LeadDrawer lead={selected} retryZoho={retryZoho} onClose={handleClose} />
    </>
  )
}
