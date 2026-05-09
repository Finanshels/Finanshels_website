import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getCurrentSession, sessionRole } from '@/lib/cms/adminAuth'
import { ROLE_RANK } from '@/lib/cms/usersRepository'
import { persistMediaAssetUpload } from '@/lib/cms/persistMediaAssetUpload'

export const runtime = 'nodejs'

/**
 * Bulk binary uploads bypass the default **1&nbsp;MB Server Actions** body cap.
 * The media library posts here instead of invoking a `'use server'` action.
 */
export async function POST(request: Request): Promise<Response> {
  const session = await getCurrentSession()
  if (!session || ROLE_RANK[sessionRole(session)] < ROLE_RANK.editor) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid form data.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: 'Missing file.' }, { status: 400 })
  }

  const result = await persistMediaAssetUpload(file, sessionRole(session))
  if (!result.ok) {
    return NextResponse.json(result, { status: 400 })
  }

  revalidatePath('/admin/cms')
  return NextResponse.json({ ok: true })
}
