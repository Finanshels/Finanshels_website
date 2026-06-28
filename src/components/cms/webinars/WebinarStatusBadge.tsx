import type { WebinarStatus } from '@/lib/cms/webinarsRepository'

/**
 * Lifecycle chip shown on cards and the detail hero. `live` pulses; `completed`
 * with a recording reads as "On-demand" (the replay is available).
 */
export function WebinarStatusBadge({
  status,
  hasRecording,
  className,
}: {
  status: WebinarStatus
  hasRecording?: boolean
  className?: string
}) {
  const map: Record<WebinarStatus, { label: string; classes: string; dot: string }> = {
    upcoming: {
      label: 'Upcoming',
      classes: 'bg-blue-50 text-blue-700 ring-blue-200',
      dot: 'bg-blue-500',
    },
    live: {
      label: 'Live now',
      classes: 'bg-rose-50 text-rose-700 ring-rose-200',
      dot: 'bg-rose-500 animate-pulse',
    },
    completed: hasRecording
      ? { label: 'On-demand', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-200', dot: 'bg-emerald-500' }
      : { label: 'Ended', classes: 'bg-slate-100 text-slate-600 ring-slate-200', dot: 'bg-slate-400' },
  }
  const cfg = map[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${cfg.classes} ${className ?? ''}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dot}`} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}
