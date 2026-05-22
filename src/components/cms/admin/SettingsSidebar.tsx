import Link from 'next/link'
import { ROLE_LABEL, type CmsUserRole } from '@/lib/cms/usersRepository'

type Props = {
  active: 'users' | 'profile'
  currentRole: CmsUserRole
  currentUserName: string
  currentUserEmail: string | null
}

const NAV: Array<{ id: 'users' | 'profile'; label: string; href: string; minRole: CmsUserRole }> = [
  { id: 'users', label: 'Users & access', href: '/admin/settings/users', minRole: 'admin' },
  { id: 'profile', label: 'My profile', href: '/admin/settings/profile', minRole: 'viewer' },
]

const ROLE_RANK: Record<CmsUserRole, number> = { viewer: 1, editor: 2, admin: 3, owner: 4 }

export function SettingsSidebar({ active, currentRole, currentUserName, currentUserEmail }: Props) {
  return (
    <aside className="rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] xl:overflow-y-auto">
      <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-primary">Settings</p>
      <Link
        href="/admin/cms"
        className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-cms-rule bg-cms-soft px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-cms-hover"
      >
        ← Back to CMS
      </Link>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Workspace</p>
        <ul className="space-y-1.5">
          {NAV.map((item) => {
            const allowed = ROLE_RANK[currentRole] >= ROLE_RANK[item.minRole]
            if (!allowed) return null
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`block rounded-xl border px-3 py-2.5 text-sm transition ${
                    item.id === active
                      ? 'border-brand-primary/40 bg-brand-primary/10 text-slate-900'
                      : 'border-transparent font-medium text-slate-700 hover:border-cms-rule hover:bg-cms-soft'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="mt-6 rounded-xl border border-cms-rule bg-cms-soft p-3">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Signed in as</p>
        <p className="mt-1 text-sm font-semibold text-slate-900">{currentUserName}</p>
        {currentUserEmail ? <p className="text-xs text-slate-500">{currentUserEmail}</p> : null}
        <p className="mt-2 inline-flex rounded-full border border-brand-primary/30 bg-brand-primary/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand-primary">
          {ROLE_LABEL[currentRole]}
        </p>
      </div>
    </aside>
  )
}
