/**
 * FIX-078: client-safe types + defaults for the site announcement nudge.
 * Kept OUT of siteSettingsRepository.ts (which is `server-only` + firebase-admin)
 * so client components — AppChrome, AnnouncementBar — can import the shape and
 * the empty default without dragging the Admin SDK into the browser bundle.
 */
export type SiteAnnouncement = {
  enabled: boolean
  message: string
  ctaLabel: string
  ctaUrl: string
  /** ISO datetime; when set + in the future, a live countdown is shown. */
  countdownTo: string | null
  tone: 'brand' | 'dark' | 'urgent'
}

export const EMPTY_ANNOUNCEMENT: SiteAnnouncement = {
  enabled: false,
  message: '',
  ctaLabel: '',
  ctaUrl: '',
  countdownTo: null,
  tone: 'brand',
}
