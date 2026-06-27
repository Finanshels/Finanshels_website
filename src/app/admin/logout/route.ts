import 'server-only'
import { redirect } from 'next/navigation'
import { destroyAdminSession } from '@/lib/cms/adminAuth'

export async function POST() {
  await destroyAdminSession()
  redirect('/admin/login')
}
