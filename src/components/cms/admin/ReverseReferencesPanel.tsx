import Link from 'next/link'
import { CMS_COLLECTION_DEFINITION_MAP } from '@/lib/cms/collectionDefinitions'
import type { CmsReverseReferenceGroup } from '@/lib/cms/collectionRepository'
import { getStatusStyle } from './statusStyle'

type Props = {
  groups: CmsReverseReferenceGroup[]
}

export function ReverseReferencesPanel({ groups }: Props) {
  const populated = groups.filter((g) => g.items.length > 0)
  return (
    <section className="rounded-2xl border border-cms-rule bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Where this is used</p>
      <p className="mt-1 text-xs text-slate-500">
        Inbound references from other collections. Updates take effect after the referencing entry is saved.
      </p>
      {populated.length === 0 ? (
        <p className="mt-3 rounded-xl border border-dashed border-cms-rule bg-cms-soft px-3 py-4 text-xs text-slate-500">
          Nothing references this entry yet.
        </p>
      ) : (
        <div className="mt-3 space-y-3">
          {populated.map((group) => {
            const def = CMS_COLLECTION_DEFINITION_MAP[group.source]
            return (
              <div key={`${group.source}-${group.field}`} className="rounded-xl border border-[#efe4d8] bg-cms-soft p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">{group.label}</p>
                  <Link
                    href={`/admin/cms?collection=${group.source}`}
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-primary hover:underline"
                  >
                    {def?.label ?? group.source}
                  </Link>
                </div>
                <p className="mt-1 font-mono text-[10px] text-slate-500">
                  {group.field}
                  {group.multi ? ' (multi)' : ''}
                </p>
                <ul className="mt-2 space-y-1">
                  {group.items.map((item) => (
                    <li key={`${group.source}-${item.id}`} className="flex items-center gap-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${getStatusStyle(item.status).dot}`} aria-hidden />
                      <Link
                        href={`/admin/cms?collection=${group.source}&slug=${encodeURIComponent(item.id)}`}
                        className="truncate font-medium text-slate-800 hover:text-brand-primary"
                      >
                        {item.title}
                      </Link>
                      <span className="ml-auto truncate font-mono text-[10px] text-slate-400">/{item.id}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
