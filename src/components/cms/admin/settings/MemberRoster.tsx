'use client'

import { useCallback, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { CmsUserRole } from '@/lib/cms/roles'
import { InitialsAvatar, RolePill, StatusPill } from './MemberBadges'
import { MemberDrawer } from './MemberDrawer'
import type { MemberActions, MemberView } from './memberTypes'

interface MemberRosterProps {
  members: MemberView[]
  actorRole: CmsUserRole
  actorUserId: string | null
  actions: MemberActions
}

/** Compact, full-width row per member. The whole row opens the manage drawer. */
export function MemberRoster({ members, actorRole, actorUserId, actions }: MemberRosterProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = members.find((m) => m.id === selectedId) ?? null
  const handleClose = useCallback(() => setSelectedId(null), [])

  return (
    <>
      <ul className="divide-y divide-cms-rule">
        {members.map((m) => {
          const isSelf = m.id === actorUserId
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => setSelectedId(m.id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-cms-soft"
              >
                <InitialsAvatar name={m.name} email={m.email} role={m.role} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-900">
                    {m.name || '(no name)'}{' '}
                    {isSelf ? <span className="text-xs font-normal text-slate-500">(you)</span> : null}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {m.email} <span className="text-slate-400">· {rowMeta(m)}</span>
                  </p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <RolePill role={m.role} />
                  <StatusPill status={m.status} />
                </div>
                <ChevronRight size={18} className="shrink-0 text-slate-400" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>

      <MemberDrawer
        member={selected}
        actorRole={actorRole}
        actorUserId={actorUserId}
        actions={actions}
        onClose={handleClose}
      />
    </>
  )
}

/** Single-line summary shown under the email in each row. */
function rowMeta(m: MemberView): string {
  if (m.status === 'invited') {
    return m.createdLabel !== '—' ? `Invited ${m.createdLabel}` : 'Invite pending'
  }
  if (m.lastLoginLabel !== '—') return `Last login ${m.lastLoginLabel}`
  if (m.createdLabel !== '—') return `Created ${m.createdLabel}`
  return 'Never signed in'
}
