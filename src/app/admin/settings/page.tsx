import { redirect } from 'next/navigation'
import { requireAdminAuth } from '@/lib/cms/adminAuth'

export const dynamic = 'force-dynamic'

export default async function SettingsRootPage() {
  await requireAdminAuth('viewer')
  redirect('/admin/settings/users')
}
