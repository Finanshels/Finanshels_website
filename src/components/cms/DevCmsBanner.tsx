import { isCmsConfigured } from '@/lib/cms/config'

export function DevCmsBanner() {
  if (process.env.NODE_ENV !== 'development' || isCmsConfigured()) return null
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-950">
      <strong className="font-semibold">CMS not wired locally.</strong> Add{' '}
      <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">FIREBASE_ADMIN_*</code> to{' '}
      <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">.env.local</code> — see{' '}
      <code className="rounded bg-amber-100/80 px-1.5 py-0.5 font-mono text-xs">docs/cms-firestore.md</code>.
    </div>
  )
}
