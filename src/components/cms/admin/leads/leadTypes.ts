// Client-safe view-model for a landing-page lead. The server page maps the
// firebase-backed `LandingPageLead` into this flat, fully-stringified shape so
// the client roster/drawer never import the (server-only) repository or call
// `toLocaleString` during hydration.

export type ZohoStatus = 'synced' | 'failed' | 'pending'

export interface LeadView {
  id: string
  name: string
  email: string
  phone: string
  company: string
  pageSlug: string
  serviceLabel: string

  zohoStatus: ZohoStatus
  zohoLeadId: string
  zohoSyncedLabel: string
  zohoRetryCount: string
  zohoSyncError: string

  submittedLabel: string

  resendSentLabel: string
  resendError: string

  // Attribution
  gclid: string
  gbraid: string
  wbraid: string
  utmSource: string
  utmMedium: string
  utmCampaign: string
  utmTerm: string
  utmContent: string
  referrer: string
  landingUrl: string

  userAgent: string
  ipHash: string
}

/** The Retry-Zoho server action, passed from the server page into the client drawer. */
export type LeadAction = (formData: FormData) => void | Promise<void>
