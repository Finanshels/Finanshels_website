import 'server-only'
import { getDb } from './firestore'
import { EMPTY_ANNOUNCEMENT, type SiteAnnouncement } from './siteAnnouncementTypes'

/**
 * FIX-078: site-wide announcement bar + countdown.
 *
 * A single Firestore doc (`site_config/announcement`) drives a global nudge bar
 * — message, CTA, optional countdown deadline. Managed at /admin/announcement,
 * rendered by AppChrome. `firestore.rules` denies client access; reads/writes go
 * through this server-only repository. The shape + empty default live in the
 * client-safe `siteAnnouncementTypes.ts` so browser code never imports this.
 */

const COLLECTION = 'site_config'
const DOC_ID = 'announcement'

export { EMPTY_ANNOUNCEMENT, type SiteAnnouncement }

function readAnnouncement(data: Record<string, unknown>): SiteAnnouncement {
  const tone = data.tone === 'dark' || data.tone === 'urgent' ? data.tone : 'brand'
  return {
    enabled: data.enabled === true,
    message: typeof data.message === 'string' ? data.message : '',
    ctaLabel: typeof data.ctaLabel === 'string' ? data.ctaLabel : '',
    ctaUrl: typeof data.ctaUrl === 'string' ? data.ctaUrl : '',
    countdownTo: typeof data.countdownTo === 'string' && data.countdownTo.trim() ? data.countdownTo : null,
    tone,
  }
}

export async function getAnnouncement(): Promise<SiteAnnouncement> {
  const db = getDb()
  if (!db) return EMPTY_ANNOUNCEMENT
  try {
    const snap = await db.collection(COLLECTION).doc(DOC_ID).get()
    if (!snap.exists) return EMPTY_ANNOUNCEMENT
    return readAnnouncement(snap.data() as Record<string, unknown>)
  } catch {
    return EMPTY_ANNOUNCEMENT
  }
}

export async function setAnnouncement(input: SiteAnnouncement): Promise<void> {
  const db = getDb()
  if (!db) return
  await db.collection(COLLECTION).doc(DOC_ID).set(
    {
      enabled: input.enabled,
      message: input.message.trim(),
      ctaLabel: input.ctaLabel.trim(),
      ctaUrl: input.ctaUrl.trim(),
      countdownTo: input.countdownTo,
      tone: input.tone,
    },
    { merge: true }
  )
}
