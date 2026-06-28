import Link from 'next/link'
import { cn } from '@/lib/cn'
import { SectionHeading } from '@/components/cms/admin/ui'
import {
  CMS_COLLECTION_DEFINITIONS,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import {
  sessionDisplayName,
  sessionRole,
  type CmsSession,
} from '@/lib/cms/adminAuth'
import { ROLE_LABEL, ROLE_RANK } from '@/lib/cms/usersRepository'

interface AdminSidebarProps {
  activeKey: CmsCollectionKey
  collectionCounts: Partial<Record<CmsCollectionKey, number>>
  session: CmsSession
}

export function AdminSidebar({ activeKey, collectionCounts, session }: AdminSidebarProps) {
  const role = sessionRole(session)
  const canManageUsers = ROLE_RANK[role] >= ROLE_RANK['admin']
  const userName = sessionDisplayName(session)
  const userEmail = session.kind === 'user' ? session.user.email : null
  const initial = (userName ?? 'U').charAt(0).toUpperCase()

  return (
    <aside className="flex flex-col rounded-2xl border border-cms-rule bg-white px-3 py-4 shadow-sm lg:sticky lg:top-3 lg:max-h-[calc(100dvh_-_1.5rem)] lg:overflow-y-auto">

      {/* Branding */}
      <div className="mb-5 px-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary">
            <span className="text-sm font-bold text-white">F</span>
          </div>
          <div>
            <p className="text-[13px] font-bold leading-none text-slate-900">Finanshels</p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-400">
              Content Studio
            </p>
          </div>
        </div>
      </div>

      {/* Content collections */}
      <div className="mb-1 px-2">
        <SectionHeading>Content</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        {CMS_COLLECTION_DEFINITIONS.map((item) => {
          const isActive = item.key === activeKey
          const count = collectionCounts[item.key]
          return (
            <Link
              key={item.key}
              href={`/admin/cms?collection=${item.key}`}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-[13px] transition',
                isActive
                  ? 'border-l-[3px] border-brand-primary bg-brand-primary/10 pl-[9px] font-semibold text-slate-900'
                  : 'font-medium text-slate-500 hover:bg-gray-50 hover:text-slate-900',
              )}
            >
              <span className="truncate">{item.label}</span>
              {count !== undefined && (
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
                    isActive
                      ? 'bg-brand-primary/15 text-brand-primary'
                      : 'bg-gray-100 text-slate-500',
                  )}
                >
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Marketing */}
      <div className="mb-1 mt-6 px-2">
        <SectionHeading>Marketing</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        <Link
          href="/admin/cms/landing-pages"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
        >
          <span>Landing pages</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Ad-only</span>
        </Link>
        <Link
          href="/admin/cms/landing-page-leads"
          className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
        >
          Lead inbox
        </Link>
      </nav>

      {/* Settings */}
      <div className="mb-1 mt-6 px-2">
        <SectionHeading>Settings</SectionHeading>
      </div>
      <nav className="mb-4 space-y-0.5">
        {canManageUsers ? (
          <Link
            href="/admin/settings/users"
            className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
          >
            Team &amp; Users
          </Link>
        ) : null}
        <Link
          href="/admin/settings/profile"
          className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
        >
          My Profile
        </Link>
        <Link
          href="/"
          className="flex items-center rounded-lg px-3 py-2 text-[13px] font-medium text-slate-500 transition hover:bg-gray-50 hover:text-slate-900"
          target="_blank"
          rel="noreferrer"
        >
          View site ↗
        </Link>
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User card */}
      <div className="mt-3 border-t border-cms-rule pt-3">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">{userName}</p>
            {userEmail && (
              <p className="truncate text-[11px] text-slate-400">{userEmail}</p>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-2">
          <span className="rounded-full bg-brand-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-primary">
            {ROLE_LABEL[role]}
          </span>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="text-[12px] text-slate-400 transition hover:text-slate-700"
            >
              Sign out →
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}
