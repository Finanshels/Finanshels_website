// PERF: every /admin/cms route is `force-dynamic`, so each navigation blocks on
// a full server render (auth + Firestore reads). Without a loading state the user
// stared at a frozen screen for the whole round-trip. This skeleton mirrors the
// two-pane CMS shell so a click paints instantly while the server works.
export default function CmsLoading() {
  return (
    <section className="min-h-screen bg-cms-canvas text-slate-900">
      <div className="mx-auto max-w-[1900px] px-3 py-3 sm:px-5">
        <div className="grid gap-3 xl:min-h-[calc(100vh-1.5rem)] xl:grid-cols-[minmax(260px,320px)_1fr]">
          {/* Sidebar skeleton */}
          <aside className="flex min-h-0 flex-col gap-3 rounded-2xl border border-cms-rule bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="h-3 w-28 animate-pulse rounded bg-cms-soft" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-cms-soft" />
            <div className="mt-2 space-y-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5">
                  <div className="h-3 flex-1 animate-pulse rounded bg-cms-soft" />
                  <div className="h-3 w-6 animate-pulse rounded bg-cms-soft" />
                </div>
              ))}
            </div>
          </aside>

          {/* Content skeleton */}
          <div className="space-y-4 rounded-2xl border border-cms-rule bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-6 w-48 animate-pulse rounded bg-cms-soft" />
                <div className="h-3 w-72 animate-pulse rounded bg-cms-soft" />
              </div>
              <div className="h-9 w-32 animate-pulse rounded-lg bg-cms-soft" />
            </div>
            <div className="h-9 w-full max-w-md animate-pulse rounded-lg bg-cms-soft" />
            <div className="overflow-hidden rounded-xl border border-cms-rule">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-cms-rule px-4 py-3.5 last:border-b-0">
                  <div className="h-4 w-4 animate-pulse rounded bg-cms-soft" />
                  <div className="h-4 flex-1 animate-pulse rounded bg-cms-soft" />
                  <div className="hidden h-4 w-20 animate-pulse rounded bg-cms-soft md:block" />
                  <div className="hidden h-4 w-24 animate-pulse rounded bg-cms-soft lg:block" />
                  <div className="h-7 w-16 animate-pulse rounded-lg bg-cms-soft" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
