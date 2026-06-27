import { notFound } from 'next/navigation'
import { requireAdminAuth } from '@/lib/cms/adminAuth'
import { getLandingPageById } from '@/lib/landing-pages/repository'
import LivePreviewClient from '@/components/cms/admin/landing-pages/LivePreviewClient'

export const dynamic = 'force-dynamic'

/**
 * Bare render target for the Studio's live-preview iframe. Loads the page once
 * for first paint, then receives live (unsaved) edits from the editor via
 * postMessage. Double-guarded: middleware + requireAdminAuth. No Firestore
 * writes; reads only the initial snapshot.
 */
export default async function LandingPagePreview({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth('editor')
  const { id } = await params
  const page = await getLandingPageById(id)
  if (!page) notFound()
  return <LivePreviewClient initialPage={page} />
}
