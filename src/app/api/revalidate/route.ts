import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { getRevalidateSecret } from '@/lib/cms/config'

export const dynamic = 'force-dynamic'

/**
 * Call from GCP (Cloud Functions / Workflows) when content publishes.
 * POST JSON: `{ "path": "/blog/my-slug" }` or `{ "paths": ["/blog/a", "/glossary/b"] }`
 * Header: `Authorization: Bearer <REVALIDATE_SECRET>`
 */
export async function POST(request: Request) {
  const secret = getRevalidateSecret()
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'REVALIDATE_SECRET not configured' }, { status: 503 })
  }

  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let body: { path?: string; paths?: string[] }
  try {
    body = (await request.json()) as { path?: string; paths?: string[] }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const paths = [...(body.paths ?? []), ...(body.path ? [body.path] : [])].filter(Boolean)
  if (paths.length === 0) {
    return NextResponse.json({ ok: false, error: 'Provide path or paths' }, { status: 400 })
  }

  for (const p of paths) {
    if (!p.startsWith('/')) {
      return NextResponse.json({ ok: false, error: `Invalid path: ${p}` }, { status: 400 })
    }
    revalidatePath(p)
  }

  return NextResponse.json({ ok: true, revalidated: paths })
}
