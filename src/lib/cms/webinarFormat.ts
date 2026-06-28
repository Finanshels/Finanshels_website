/**
 * Pure formatting helpers for the webinar surface. No server-only imports — used
 * by both server components (date labels) and the client CountdownTimer.
 */

/** Long human label in the webinar's timezone, e.g. "Mon, 14 Jul 2026, 3:00 PM GST". */
export function formatWebinarDate(iso: string | null, timezone: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const base: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }
  try {
    return new Intl.DateTimeFormat('en-GB', {
      ...base,
      timeZone: timezone || undefined,
      timeZoneName: 'short',
    }).format(d)
  } catch {
    // Invalid IANA timezone string → format without it rather than throw.
    return new Intl.DateTimeFormat('en-GB', base).format(d)
  }
}

/** Short day + month label, e.g. "14 Jul" — for compact cards. */
export function formatWebinarDayMonth(iso: string | null, timezone: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const base: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  try {
    return new Intl.DateTimeFormat('en-GB', { ...base, timeZone: timezone || undefined }).format(d)
  } catch {
    return new Intl.DateTimeFormat('en-GB', base).format(d)
  }
}

/**
 * Normalize a YouTube / Vimeo share URL to an iframe-embeddable URL. Lets editors
 * paste a normal watch link as the recording. Non-matching URLs pass through
 * (already an embed URL or a direct file).
 */
export function toEmbedUrl(url: string): string {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/|shorts\/)|youtu\.be\/)([\w-]{6,})/)
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`
  return url
}

function toCalendarStamp(d: Date): string {
  // YYYYMMDDTHHMMSSZ (UTC) as required by Google Calendar's TEMPLATE link.
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * "Add to Google Calendar" link. Defaults to a 1-hour event when no end time is
 * set. Returns null when the start is missing/invalid.
 */
export function googleCalendarUrl(opts: {
  title: string
  startIso: string | null
  endIso: string | null
  details?: string
  location?: string
}): string | null {
  if (!opts.startIso) return null
  const start = new Date(opts.startIso)
  if (Number.isNaN(start.getTime())) return null
  const endCandidate = opts.endIso ? new Date(opts.endIso) : null
  const end = endCandidate && !Number.isNaN(endCandidate.getTime())
    ? endCandidate
    : new Date(start.getTime() + 60 * 60 * 1000)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toCalendarStamp(start)}/${toCalendarStamp(end)}`,
  })
  if (opts.details) params.set('details', opts.details)
  if (opts.location) params.set('location', opts.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const PLATFORM_LABELS: Record<string, string> = {
  zoho: 'Zoho Webinar',
  zoom: 'Zoom',
  meet: 'Google Meet',
  teams: 'Microsoft Teams',
  other: 'Online',
}

export function platformLabel(platform: string | null): string {
  if (!platform) return 'Online'
  return PLATFORM_LABELS[platform] ?? platform
}
