import { redirect } from 'next/navigation'
import { requireAdminAuth, sessionRole } from '@/lib/cms/adminAuth'
import { ROLE_RANK } from '@/lib/cms/usersRepository'

export const dynamic = 'force-dynamic'

// FIX-048: `/admin/settings/users` requires the `admin` role; viewers landed
// there and bounced back to `/admin/cms?error=insufficient-role`, a confusing
// redirect loop. Route viewers to `/admin/settings/profile` (the only
// settings sub-page they can access); higher roles continue to `/users`.
export default async function SettingsRootPage() {
  const session = await requireAdminAuth('viewer')
  const role = sessionRole(session)
  if (ROLE_RANK[role] >= ROLE_RANK.admin) {
    redirect('/admin/settings/users')
  }
  redirect('/admin/settings/profile')
}
