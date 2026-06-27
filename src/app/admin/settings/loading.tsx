// PERF: settings routes are `force-dynamic` (per-user Firestore reads on every
// load). Paint a skeleton immediately so navigation feels instant instead of
// blocking on a blank screen for the full server round-trip.
export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-cms-canvas px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-44 animate-pulse rounded bg-cms-soft" />
          <div className="h-3 w-72 animate-pulse rounded bg-cms-soft" />
        </div>
        <div className="space-y-4 rounded-2xl border border-cms-rule bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-cms-soft" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-cms-soft" />
            </div>
          ))}
          <div className="h-10 w-32 animate-pulse rounded-lg bg-cms-soft" />
        </div>
      </div>
    </div>
  )
}
