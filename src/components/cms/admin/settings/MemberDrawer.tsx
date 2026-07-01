'use client'

import { useState, type ReactNode } from 'react'
import { Ban, KeyRound, Link as LinkIcon, Mail, ShieldCheck, Trash2, UserCheck } from 'lucide-react'
import { ROLE_LABEL, type CmsUserRole } from '@/lib/cms/roles'
import { SlideOver } from '@/components/cms/admin/ui/SlideOver'
import { InitialsAvatar, RolePill, StatusPill } from './MemberBadges'
import type { MemberActions, MemberView } from './memberTypes'

interface MemberDrawerProps {
  member: MemberView | null
  actorRole: CmsUserRole
  actorUserId: string | null
  actions: MemberActions
  onClose: () => void
}

/**
 * Per-member manage panel. Mounted only while a member is selected; keyed on
 * member id so switching members replays the entrance animation. Submitting any
 * form triggers a server action that redirects + revalidates, which unmounts
 * this drawer and surfaces the result in the page-level alert.
 */
export function MemberDrawer({ member, ...rest }: MemberDrawerProps) {
  if (!member) return null
  return <DrawerBody key={member.id} member={member} {...rest} />
}

function DrawerBody({
  member,
  actorRole,
  actorUserId,
  actions,
  onClose,
}: MemberDrawerProps & { member: MemberView }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const isSelf = member.id === actorUserId
  const protectedOwner = member.role === 'owner' && actorRole !== 'owner'
  const canEdit = !protectedOwner
  const assignableRoles = (['viewer', 'editor', 'admin', 'owner'] as CmsUserRole[]).filter((r) =>
    r === 'owner' ? actorRole === 'owner' : true,
  )

  return (
    <SlideOver
      onClose={onClose}
      ariaLabel={`Manage ${member.name || member.email}`}
      header={
        <div className="flex items-start gap-3">
          <InitialsAvatar name={member.name} email={member.email} role={member.role} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-slate-900">
              {member.name || '(no name)'}{' '}
              {isSelf ? <span className="text-xs font-normal text-slate-500">(you)</span> : null}
            </p>
            <p className="truncate text-sm text-slate-500">{member.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <RolePill role={member.role} />
              <StatusPill status={member.status} />
            </div>
          </div>
        </div>
      }
      footer={
        <>
          Created {member.createdLabel} · Last login {member.lastLoginLabel}
        </>
      }
    >
      {protectedOwner ? (
        <p className="rounded-xl border border-cms-rule bg-cms-soft px-4 py-3 text-sm text-slate-600">
          Only an owner can modify another owner.
        </p>
      ) : null}

      {/* ROLE */}
      {canEdit ? (
        <Section icon={<ShieldCheck size={14} />} title="Role">
          <form action={actions.updateRole} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={member.id} />
            <select
              name="role"
              defaultValue={member.role}
              className="flex-1 rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            >
              {assignableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
            <SaveButton>Save</SaveButton>
          </form>
        </Section>
      ) : null}

      {/* ACCESS */}
      {canEdit && member.status === 'invited' ? (
        <Section icon={<Mail size={14} />} title="Invite">
          <p className="mb-2 text-sm text-slate-500">
            Invite sent — not accepted yet. Each action below issues a fresh 7-day link (older links stop working).
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <form action={actions.copyInviteLink}>
              <input type="hidden" name="userId" value={member.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <LinkIcon size={15} /> Get invite link
              </button>
            </form>
            <form action={actions.resendInvite}>
              <input type="hidden" name="userId" value={member.id} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-100"
              >
                <Mail size={15} /> Resend by email
              </button>
            </form>
          </div>
        </Section>
      ) : null}

      {canEdit && member.status !== 'invited' ? (
        <Section icon={member.status === 'active' ? <Ban size={14} /> : <UserCheck size={14} />} title="Access">
          {isSelf ? (
            <p className="text-sm text-slate-500">You can't change your own access.</p>
          ) : (
            <form action={actions.updateStatus} className="flex items-center justify-between gap-3">
              <input type="hidden" name="userId" value={member.id} />
              <input type="hidden" name="status" value={member.status === 'active' ? 'disabled' : 'active'} />
              <span className="text-sm text-slate-600">
                {member.status === 'active' ? 'Account is active.' : 'Account is disabled.'}
              </span>
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                  member.status === 'active'
                    ? 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {member.status === 'active' ? (
                  <>
                    <Ban size={15} /> Disable
                  </>
                ) : (
                  <>
                    <UserCheck size={15} /> Enable
                  </>
                )}
              </button>
            </form>
          )}
        </Section>
      ) : null}

      {/* PASSWORD */}
      {canEdit && member.status === 'active' ? (
        <Section icon={<KeyRound size={14} />} title="Password">
          <form action={actions.resetPassword} className="flex items-center gap-2">
            <input type="hidden" name="userId" value={member.id} />
            <input
              // FIX-048: must be type="password" — never expose the new value as plaintext.
              type="password"
              name="newPassword"
              placeholder="New password (≥ 8 chars)"
              autoComplete="new-password"
              minLength={8}
              className="flex-1 rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
            <SaveButton>Reset</SaveButton>
          </form>
        </Section>
      ) : null}

      {/* DANGER ZONE */}
      {canEdit && !isSelf ? (
        <Section icon={<Trash2 size={14} />} title="Danger zone" tone="danger">
          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <Trash2 size={15} /> Delete user
            </button>
          ) : (
            <div className="rounded-xl border border-red-300 bg-red-50 p-3">
              <p className="text-sm text-red-800">
                Permanently remove <strong>{member.name || member.email}</strong>? This can't be undone.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <form action={actions.deleteUser}>
                  <input type="hidden" name="userId" value={member.id} />
                  <button
                    type="submit"
                    className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Yes, delete
                  </button>
                </form>
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="rounded-lg border border-cms-rule bg-white px-3 py-2 text-sm text-slate-600 transition hover:bg-cms-hover"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </Section>
      ) : null}
    </SlideOver>
  )
}

function Section({
  icon,
  title,
  tone = 'default',
  children,
}: {
  icon: ReactNode
  title: string
  tone?: 'default' | 'danger'
  children: ReactNode
}) {
  return (
    <section>
      <p
        className={`mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] ${
          tone === 'danger' ? 'text-red-600' : 'text-slate-500'
        }`}
      >
        <span aria-hidden>{icon}</span>
        {title}
      </p>
      {children}
    </section>
  )
}

function SaveButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="shrink-0 rounded-lg border border-cms-rule bg-cms-soft px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-cms-hover"
    >
      {children}
    </button>
  )
}
