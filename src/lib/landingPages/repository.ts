import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { getDb } from '../cms/firestore'
import { normalizeFirestoreTimestamps } from '../cms/normalizeDoc'
import { slugifyForCms } from '../cms/slugify'
import {
  LANDING_PAGE_COLLECTION,
  LANDING_PAGE_LEAD_COLLECTION,
  LANDING_PAGE_RATE_LIMIT_COLLECTION,
  type HeroVariant,
  type LandingPageDoc,
  type LandingPageLead,
  type LandingPageListItem,
  type LandingPageSection,
  type LandingPageStatus,
  type LeadAttribution,
} from './types'

const RESERVED_SLUGS = new Set(['new', 'admin', 'api', 'preview', 'edit', 'leads'])

function toDate(value: unknown): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (value instanceof Timestamp) return value.toDate()
  if (typeof value === 'object' && value && 'toDate' in (value as Record<string, unknown>)) {
    try {
      const d = (value as { toDate: () => Date }).toDate()
      return d instanceof Date ? d : null
    } catch {
      return null
    }
  }
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isFinite(parsed.getTime()) ? parsed : null
  }
  return null
}

function readStr(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback
}

function readStrOpt(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function readBool(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function readNum(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function readStrArr(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : []
}

function readSections(value: unknown): LandingPageSection[] {
  if (!Array.isArray(value)) return []
  return value
    .map((s): LandingPageSection | null => {
      if (!s || typeof s !== 'object') return null
      const obj = s as Record<string, unknown>
      const id = readStr(obj.id)
      const type = readStr(obj.type)
      if (!id || !type) return null
      return {
        id,
        type,
        enabled: readBool(obj.enabled, true),
        props: obj.props && typeof obj.props === 'object' ? (obj.props as Record<string, unknown>) : {},
      }
    })
    .filter((x): x is LandingPageSection => x !== null)
}

function statusOf(value: unknown): LandingPageStatus {
  const s = readStr(value, 'draft')
  return s === 'published' || s === 'archived' ? s : 'draft'
}

function deserialise(id: string, raw: Record<string, unknown>): LandingPageDoc {
  const n = normalizeFirestoreTimestamps(raw)
  const themeRaw = (n.theme as Record<string, unknown> | undefined) ?? {}
  const seoRaw = (n.seo as Record<string, unknown> | undefined) ?? {}
  const labelsRaw = (n.conversion_labels as Record<string, unknown> | undefined) ?? {}
  return {
    id,
    slug: readStr(n.slug),
    internal_name: readStr(n.internal_name),
    status: statusOf(n.status),
    published_at: toDate(n.published_at),
    created_at: toDate(n.created_at),
    updated_at: toDate(n.updated_at),
    created_by: readStr(n.created_by),
    updated_by: readStr(n.updated_by),
    service_interest: readStr(n.service_interest),
    google_ads_conversion_id: readStr(n.google_ads_conversion_id),
    conversion_labels: {
      form_submit: readStr(labelsRaw.form_submit),
      call_click: readStr(labelsRaw.call_click),
      whatsapp_click: readStr(labelsRaw.whatsapp_click),
    },
    primary_phone: readStr(n.primary_phone),
    whatsapp_number: readStr(n.whatsapp_number),
    whatsapp_prefilled_message: readStrOpt(n.whatsapp_prefilled_message),
    form_destination_emails: readStrArr(n.form_destination_emails),
    thank_you_redirect_url: readStrOpt(n.thank_you_redirect_url),
    sections: readSections(n.sections),
    theme: {
      accent_color: readStrOpt(themeRaw.accent_color),
      hero_variant: readStr(themeRaw.hero_variant, 'split-form') as HeroVariant,
      show_sticky_mobile_cta_bar: readBool(themeRaw.show_sticky_mobile_cta_bar, true),
      show_floating_whatsapp_button: readBool(themeRaw.show_floating_whatsapp_button, true),
      badge_text: readStrOpt(themeRaw.badge_text),
    },
    seo: {
      title: readStr(seoRaw.title),
      description: readStr(seoRaw.description),
      og_image_url: readStrOpt(seoRaw.og_image_url),
      allow_indexing: readBool(seoRaw.allow_indexing, false),
      canonical_url: readStrOpt(seoRaw.canonical_url),
    },
  }
}

function deserialiseLead(id: string, raw: Record<string, unknown>): LandingPageLead {
  const n = normalizeFirestoreTimestamps(raw)
  return {
    id,
    submitted_at: toDate(n.submitted_at),
    name: readStr(n.name),
    phone: readStr(n.phone),
    email: readStr(n.email),
    company_name: readStrOpt(n.company_name),
    landing_page_id: readStr(n.landing_page_id),
    landing_page_slug: readStr(n.landing_page_slug),
    service_interest: readStr(n.service_interest),
    gclid: readStrOpt(n.gclid),
    gbraid: readStrOpt(n.gbraid),
    wbraid: readStrOpt(n.wbraid),
    utm_source: readStrOpt(n.utm_source),
    utm_medium: readStrOpt(n.utm_medium),
    utm_campaign: readStrOpt(n.utm_campaign),
    utm_term: readStrOpt(n.utm_term),
    utm_content: readStrOpt(n.utm_content),
    referrer: readStrOpt(n.referrer),
    landing_url: readStr(n.landing_url),
    user_agent: readStr(n.user_agent),
    ip_hash: readStr(n.ip_hash),
    zoho_lead_id: readStrOpt(n.zoho_lead_id),
    zoho_synced_at: toDate(n.zoho_synced_at),
    zoho_sync_error: readStrOpt(n.zoho_sync_error),
    zoho_retry_count: readNum(n.zoho_retry_count, 0),
    resend_email_sent_at: toDate(n.resend_email_sent_at),
    resend_email_error: readStrOpt(n.resend_email_error),
  }
}

export function isSlugReserved(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.trim().toLowerCase())
}

export function normaliseSlug(input: string): string {
  return slugifyForCms(input)
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPageDoc | null> {
  const db = getDb()
  if (!db) return null
  const snap = await db.collection(LANDING_PAGE_COLLECTION).where('slug', '==', slug).limit(1).get()
  if (snap.empty) return null
  const doc = snap.docs[0]
  return deserialise(doc.id, doc.data() ?? {})
}

export async function getLandingPageById(id: string): Promise<LandingPageDoc | null> {
  const db = getDb()
  if (!db) return null
  const snap = await db.collection(LANDING_PAGE_COLLECTION).doc(id).get()
  if (!snap.exists) return null
  return deserialise(snap.id, snap.data() ?? {})
}

export async function listLandingPages(options: {
  status?: LandingPageStatus
  service_interest?: string
  search?: string
} = {}): Promise<LandingPageListItem[]> {
  const db = getDb()
  if (!db) return []
  let q = db.collection(LANDING_PAGE_COLLECTION).orderBy('updated_at', 'desc') as FirebaseFirestore.Query
  if (options.status) q = q.where('status', '==', options.status)
  if (options.service_interest) q = q.where('service_interest', '==', options.service_interest)
  const snap = await q.limit(500).get()
  const items: LandingPageListItem[] = snap.docs.map((d) => {
    const n = normalizeFirestoreTimestamps(d.data() ?? {})
    return {
      id: d.id,
      slug: readStr(n.slug),
      internal_name: readStr(n.internal_name),
      status: statusOf(n.status),
      service_interest: readStr(n.service_interest),
      updated_at: toDate(n.updated_at),
      published_at: toDate(n.published_at),
    }
  })
  const search = options.search?.trim().toLowerCase()
  if (!search) return items
  return items.filter(
    (item) =>
      item.slug.toLowerCase().includes(search) ||
      item.internal_name.toLowerCase().includes(search)
  )
}

export async function listPublishedSlugs(): Promise<string[]> {
  const db = getDb()
  if (!db) return []
  const snap = await db.collection(LANDING_PAGE_COLLECTION).where('status', '==', 'published').limit(1000).get()
  return snap.docs.map((d) => readStr(d.data()?.slug)).filter(Boolean)
}

export type LandingPageWriteInput = Omit<
  LandingPageDoc,
  'id' | 'created_at' | 'updated_at' | 'published_at' | 'created_by' | 'updated_by'
> & {
  published_at?: Date | null
}

async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const db = getDb()
  if (!db) return false
  const snap = await db.collection(LANDING_PAGE_COLLECTION).where('slug', '==', slug).limit(2).get()
  if (snap.empty) return false
  return snap.docs.some((d) => d.id !== excludeId)
}

export async function findAvailableSlug(baseTitle: string, excludeId?: string): Promise<string> {
  const base = slugifyForCms(baseTitle) || `landing-${Date.now().toString(36)}`
  let candidate = base
  let i = 1
  while (isSlugReserved(candidate) || (await isSlugTaken(candidate, excludeId))) {
    i += 1
    candidate = `${base}-${i}`
    if (i > 200) {
      candidate = `${base}-${Date.now().toString(36)}`
      break
    }
  }
  return candidate
}

export async function createLandingPage(input: LandingPageWriteInput, userId: string): Promise<string> {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  if (!input.slug) throw new Error('Slug is required')
  if (isSlugReserved(input.slug)) throw new Error(`Slug "${input.slug}" is reserved`)
  if (await isSlugTaken(input.slug)) throw new Error(`Slug "${input.slug}" is already in use`)

  const now = FieldValue.serverTimestamp()
  const payload: Record<string, unknown> = {
    ...input,
    created_at: now,
    updated_at: now,
    created_by: userId,
    updated_by: userId,
    published_at: input.status === 'published' ? now : null,
  }
  const ref = await db.collection(LANDING_PAGE_COLLECTION).add(payload)
  return ref.id
}

export async function updateLandingPage(
  id: string,
  input: Partial<LandingPageWriteInput>,
  userId: string
): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')

  if (input.slug) {
    if (isSlugReserved(input.slug)) throw new Error(`Slug "${input.slug}" is reserved`)
    if (await isSlugTaken(input.slug, id)) throw new Error(`Slug "${input.slug}" is taken`)
  }

  const payload: Record<string, unknown> = {
    ...input,
    updated_at: FieldValue.serverTimestamp(),
    updated_by: userId,
  }

  if (input.status === 'published') {
    const existing = await db.collection(LANDING_PAGE_COLLECTION).doc(id).get()
    if (existing.exists && !existing.data()?.published_at) {
      payload.published_at = FieldValue.serverTimestamp()
    }
  }

  await db.collection(LANDING_PAGE_COLLECTION).doc(id).update(payload)
}

export async function deleteLandingPage(id: string): Promise<void> {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  await db.collection(LANDING_PAGE_COLLECTION).doc(id).delete()
}

export async function duplicateLandingPage(id: string, userId: string): Promise<string> {
  const original = await getLandingPageById(id)
  if (!original) throw new Error('Landing page not found')

  const newSlug = await findAvailableSlug(`${original.slug}-copy`)

  const {
    id: _id,
    created_at: _c,
    updated_at: _u,
    published_at: _p,
    created_by: _cb,
    updated_by: _ub,
    ...rest
  } = original

  return createLandingPage(
    {
      ...rest,
      slug: newSlug,
      internal_name: `${original.internal_name} (copy)`,
      status: 'draft',
      sections: original.sections.map((sec) => ({
        ...sec,
        props: JSON.parse(JSON.stringify(sec.props ?? {})),
      })),
      seo: { ...original.seo, allow_indexing: false },
    },
    userId
  )
}

// ----- Leads -----

export type LeadWriteInput = {
  name: string
  phone: string
  email: string
  company_name?: string
  landing_page_id: string
  landing_page_slug: string
  service_interest: string
  attribution: LeadAttribution
  user_agent: string
  ip_hash: string
}

export async function writeLead(input: LeadWriteInput): Promise<string> {
  const db = getDb()
  if (!db) throw new Error('Firestore not configured')
  const payload: Record<string, unknown> = {
    name: input.name,
    phone: input.phone,
    email: input.email,
    company_name: input.company_name ?? '',
    landing_page_id: input.landing_page_id,
    landing_page_slug: input.landing_page_slug,
    service_interest: input.service_interest,
    gclid: input.attribution.gclid ?? '',
    gbraid: input.attribution.gbraid ?? '',
    wbraid: input.attribution.wbraid ?? '',
    utm_source: input.attribution.utm_source ?? '',
    utm_medium: input.attribution.utm_medium ?? '',
    utm_campaign: input.attribution.utm_campaign ?? '',
    utm_term: input.attribution.utm_term ?? '',
    utm_content: input.attribution.utm_content ?? '',
    referrer: input.attribution.referrer ?? '',
    landing_url: input.attribution.landing_url,
    user_agent: input.user_agent,
    ip_hash: input.ip_hash,
    zoho_retry_count: 0,
    zoho_synced_at: null,
    resend_email_sent_at: null,
    submitted_at: FieldValue.serverTimestamp(),
  }
  const ref = await db.collection(LANDING_PAGE_LEAD_COLLECTION).add(payload)
  return ref.id
}

export async function updateLeadSyncState(
  leadId: string,
  patch: {
    zoho_lead_id?: string
    zoho_synced_at?: Date | null
    zoho_sync_error?: string | null
    increment_zoho_retry?: boolean
    resend_email_sent_at?: Date | null
    resend_email_error?: string | null
  }
): Promise<void> {
  const db = getDb()
  if (!db) return
  const update: Record<string, unknown> = {}
  if (patch.zoho_lead_id !== undefined) update.zoho_lead_id = patch.zoho_lead_id
  if (patch.zoho_synced_at !== undefined) {
    update.zoho_synced_at = patch.zoho_synced_at ? Timestamp.fromDate(patch.zoho_synced_at) : null
  }
  if (patch.zoho_sync_error !== undefined) {
    update.zoho_sync_error = patch.zoho_sync_error ?? FieldValue.delete()
  }
  if (patch.increment_zoho_retry) update.zoho_retry_count = FieldValue.increment(1)
  if (patch.resend_email_sent_at !== undefined) {
    update.resend_email_sent_at = patch.resend_email_sent_at
      ? Timestamp.fromDate(patch.resend_email_sent_at)
      : null
  }
  if (patch.resend_email_error !== undefined) {
    update.resend_email_error = patch.resend_email_error ?? FieldValue.delete()
  }
  if (Object.keys(update).length === 0) return
  await db.collection(LANDING_PAGE_LEAD_COLLECTION).doc(leadId).update(update)
}

export type LeadListFilters = {
  landingPageId?: string
  status?: 'synced' | 'failed' | 'all'
  startDate?: Date
  endDate?: Date
  limit?: number
}

export async function listLeads(filters: LeadListFilters = {}): Promise<LandingPageLead[]> {
  const db = getDb()
  if (!db) return []
  let q = db.collection(LANDING_PAGE_LEAD_COLLECTION).orderBy('submitted_at', 'desc') as FirebaseFirestore.Query
  if (filters.landingPageId) q = q.where('landing_page_id', '==', filters.landingPageId)
  if (filters.startDate) q = q.where('submitted_at', '>=', Timestamp.fromDate(filters.startDate))
  if (filters.endDate) q = q.where('submitted_at', '<=', Timestamp.fromDate(filters.endDate))
  q = q.limit(filters.limit ?? 500)
  const snap = await q.get()
  return snap.docs
    .map((d) => deserialiseLead(d.id, d.data() ?? {}))
    .filter((lead) => {
      if (filters.status === 'synced') return Boolean(lead.zoho_lead_id)
      if (filters.status === 'failed') return Boolean(lead.zoho_sync_error) && !lead.zoho_lead_id
      return true
    })
}

export async function getLead(leadId: string): Promise<LandingPageLead | null> {
  const db = getDb()
  if (!db) return null
  const snap = await db.collection(LANDING_PAGE_LEAD_COLLECTION).doc(leadId).get()
  if (!snap.exists) return null
  return deserialiseLead(snap.id, snap.data() ?? {})
}

export async function countLeadsForPage(landing_page_id: string, since: Date): Promise<number> {
  const db = getDb()
  if (!db) return 0
  try {
    const snap = await db
      .collection(LANDING_PAGE_LEAD_COLLECTION)
      .where('landing_page_id', '==', landing_page_id)
      .where('submitted_at', '>=', Timestamp.fromDate(since))
      .count()
      .get()
    return snap.data().count
  } catch {
    return 0
  }
}

// ----- Rate limiting -----

export async function checkAndIncrementRateLimit(
  ipHash: string,
  windowMs: number,
  maxRequests: number
): Promise<{ allowed: boolean; remaining: number }> {
  const db = getDb()
  if (!db) return { allowed: true, remaining: maxRequests }

  const docRef = db.collection(LANDING_PAGE_RATE_LIMIT_COLLECTION).doc(ipHash)
  const now = Date.now()
  const cutoff = now - windowMs

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(docRef)
    const data = snap.exists ? snap.data() : null
    const events: number[] = Array.isArray(data?.events)
      ? (data!.events as number[]).filter((t) => typeof t === 'number' && t > cutoff)
      : []
    if (events.length >= maxRequests) {
      tx.set(docRef, { events, last_seen: now }, { merge: true })
      return { allowed: false, remaining: 0 }
    }
    events.push(now)
    tx.set(docRef, { events, last_seen: now }, { merge: true })
    return { allowed: true, remaining: maxRequests - events.length }
  })
}

// Helper for building an empty landing page for the "new" flow
export function makeEmptyLandingPage(): LandingPageWriteInput {
  return {
    slug: '',
    internal_name: '',
    status: 'draft',
    service_interest: '',
    google_ads_conversion_id: '',
    conversion_labels: { form_submit: '', call_click: '', whatsapp_click: '' },
    primary_phone: '',
    whatsapp_number: '',
    whatsapp_prefilled_message: '',
    form_destination_emails: [],
    thank_you_redirect_url: '',
    sections: [],
    theme: {
      hero_variant: 'split-form',
      show_sticky_mobile_cta_bar: true,
      show_floating_whatsapp_button: true,
    },
    seo: { title: '', description: '', allow_indexing: false },
  }
}
