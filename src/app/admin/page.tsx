import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/cms/adminAuth'

// FIX-048: middleware blocks unauthenticated requests to /admin/* and the
// invariant in CLAUDE.md says every admin page MUST also call
// `requireAdminAuth()`. Previously this redirect page skipped the check.
export default async function AdminRootPage() {
  await requireAdminAuth('viewer')
  redirect('/admin/cms')
}
