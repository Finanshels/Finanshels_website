import type { WebinarAgendaItem } from '@/lib/cms/webinarsRepository'

/** Vertical agenda/timeline. Each item is `{ time?, title }`. */
export function WebinarAgenda({ items }: { items: WebinarAgendaItem[] }) {
  if (items.length === 0) return null
  return (
    <ol className="space-y-3">
      {items.map((item, i) => (
        <li key={`${i}-${item.title}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="mt-1 size-2.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true" />
            {i < items.length - 1 ? <span className="w-px flex-1 bg-slate-200" aria-hidden="true" /> : null}
          </div>
          <div className="pb-1">
            {item.time ? (
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">{item.time}</p>
            ) : null}
            <p className="text-slate-800">{item.title}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
