import 'server-only'
import { COLLECTIONS, getDb } from './firestore'
import { normalizeFirestoreTimestamps } from './normalizeDoc'

/**
 * Server-only repository for customer_reviews → testimonial cards.
 *
 * Reviews are embedded-only (no public page). This feeds the "Trusted By
 * Entrepreneurs" carousel (src/screens/Home4.jsx) and any service page. Only
 * `status === 'published'` AND `approved_for_publication === true` reviews are
 * returned (FIX-003 consent gate). `service_category` (multi-select) drives
 * service-wise filtering.
 *
 * MUST stay server-only — never import this from a 'use client' component.
 * Server components/routes fetch and pass the plain `Testimonial[]` as props.
 */

export type Testimonial = {
  id: string
  /** 'video' when a video_review_url is set; else 'text'. Drives the card variant. */
  type: 'video' | 'text'
  name: string
  /** customer_designation, e.g. "Founder & CEO, Acme Trading LLC". */
  role: string
  company: string
  quote: string
  rating: number
  /** customer_photo URL — full-bleed poster (video) or avatar (text). */
  img: string
  videoUrl: string
  featured: boolean
  /** service_category slugs (serviceOptions taxonomy) for service-wise filtering. */
  services: string[]
}

/** Hard cap on docs read per query (reviews are a small collection). */
const FETCH_LIMIT = 60

function toTestimonial(id: string, d: Record<string, unknown>): Testimonial | null {
  // Consent gate: never surface an unapproved review (PDPL/GDPR — attributable PII).
  if (d.approved_for_publication !== true) return null
  const name = String(d.customer_name ?? '').trim()
  const quote = String(d.review_text ?? '').trim()
  if (!name || !quote) return null

  const videoUrl = String(d.video_review_url ?? '').trim()
  const ratingNum = Number(d.rating)
  const services = Array.isArray(d.service_category) ? d.service_category.map((s) => String(s)) : []

  return {
    id,
    type: videoUrl ? 'video' : 'text',
    name,
    role: String(d.customer_designation ?? '').trim(),
    company: String(d.company ?? '').trim(),
    quote,
    rating: Number.isFinite(ratingNum) && ratingNum > 0 ? Math.min(5, Math.round(ratingNum)) : 5,
    img: String(d.customer_photo ?? '').trim(),
    videoUrl,
    featured: d.featured === true,
    services,
  }
}

/**
 * Published + approved testimonials. Pass `service` (a serviceOptions slug) to
 * show only reviews tagged with that service; omit it for a general/home set.
 * Featured reviews are ordered first. Returns [] when Firestore is unconfigured.
 */
export async function getTestimonials(
  opts: { service?: string; limit?: number } = {}
): Promise<Testimonial[]> {
  const db = getDb()
  if (!db) return []

  try {
    // Single equality filter (no composite index needed); approval + service are
    // filtered in code so we don't depend on a Firestore index for a small set.
    const snap = await db
      .collection(COLLECTIONS.customerReviews)
      .where('status', '==', 'published')
      .limit(FETCH_LIMIT)
      .get()

    let items = snap.docs
      .map((doc) => toTestimonial(doc.id, normalizeFirestoreTimestamps(doc.data() as Record<string, unknown>)))
      .filter((t): t is Testimonial => t !== null)

    if (opts.service) {
      items = items.filter((t) => t.services.includes(opts.service as string))
    }

    // Featured first; otherwise preserve Firestore order.
    items.sort((a, b) => Number(b.featured) - Number(a.featured))

    return typeof opts.limit === 'number' ? items.slice(0, opts.limit) : items
  } catch {
    // Resilience: a Firestore hiccup (build-time static gen, transient network)
    // must never fail page rendering — degrade to the caller's static fallback.
    return []
  }
}
