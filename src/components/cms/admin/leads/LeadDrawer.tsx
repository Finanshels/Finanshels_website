'use client'

import { type ReactNode } from 'react'
import { Activity, Building2, RefreshCw, Send, Tag } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SlideOver } from '@/components/cms/admin/ui/SlideOver'
import { LeadAvatar, ZohoStatusPill } from './LeadBadges'
import type { LeadAction, LeadView } from './leadTypes'

interface LeadDrawerProps {
  lead: LeadView | null
  retryZoho: LeadAction
  onClose: () => void
}

/**
 * Read-only lead detail panel + the Retry-Zoho action. Mounted only while a
 * lead is selected; keyed on lead id. The retry action revalidates without
 * redirecting, so the drawer stays open and the Zoho status updates in place.
 */
export function LeadDrawer({ lead, ...rest }: LeadDrawerProps) {
  if (!lead) return null
  return <DrawerBody key={lead.id} lead={lead} {...rest} />
}

function DrawerBody({ lead, retryZoho, onClose }: LeadDrawerProps & { lead: LeadView }) {
  return (
    <SlideOver
      onClose={onClose}
      ariaLabel={`Lead from ${lead.name || lead.email}`}
      header={
        <div className="flex items-start gap-3">
          <LeadAvatar name={lead.name} email={lead.email} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold text-slate-900">{lead.name || '(no name)'}</p>
            <p className="truncate text-sm text-slate-500">{lead.email}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ZohoStatusPill status={lead.zohoStatus} />
              <span className="text-xs text-slate-400">{lead.submittedLabel}</span>
            </div>
          </div>
        </div>
      }
    >
      {/* CONTACT */}
      <Section icon={<Building2 size={14} />} title="Contact">
        <Grid>
          <Field label="Phone" value={lead.phone} href={lead.phone ? `tel:${lead.phone}` : undefined} />
          <Field label="Email" value={lead.email} href={lead.email ? `mailto:${lead.email}` : undefined} />
          <Field label="Company" value={lead.company} />
          <Field label="Service interest" value={lead.serviceLabel} />
        </Grid>
      </Section>

      {/* SOURCE */}
      <Section icon={<Tag size={14} />} title="Source">
        <Grid>
          <Field label="Landing page" value={`/${lead.pageSlug}`} mono />
          <Field label="Submitted" value={lead.submittedLabel} />
        </Grid>
        <Field className="mt-3" label="Landing URL" value={lead.landingUrl} href={lead.landingUrl || undefined} breakAll />
        <Field className="mt-3" label="Referrer" value={lead.referrer} mono breakAll />
      </Section>

      {/* ZOHO SYNC */}
      <Section icon={<Activity size={14} />} title="Zoho CRM">
        <Grid>
          <Field label="Status" value={lead.zohoStatus} />
          <Field label="Zoho lead ID" value={lead.zohoLeadId} mono />
          <Field label="Synced at" value={lead.zohoSyncedLabel} />
          <Field label="Retries" value={lead.zohoRetryCount} />
        </Grid>
        {lead.zohoSyncError ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-red-600">Last sync error</p>
            <p className="mt-0.5 whitespace-pre-wrap break-all text-[12px] font-mono text-red-700">{lead.zohoSyncError}</p>
          </div>
        ) : null}
        {lead.zohoStatus !== 'synced' ? (
          <form action={retryZoho} className="mt-3">
            <input type="hidden" name="lead_id" value={lead.id} />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/40 bg-brand-primary/10 px-3 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/15"
            >
              <RefreshCw size={15} /> Retry Zoho sync
            </button>
          </form>
        ) : null}
      </Section>

      {/* EMAIL DELIVERY */}
      <Section icon={<Send size={14} />} title="Email notification">
        <Grid>
          <Field label="Sent at" value={lead.resendSentLabel} />
          <Field label="Error" value={lead.resendError} />
        </Grid>
      </Section>

      {/* ATTRIBUTION */}
      <Section icon={<Tag size={14} />} title="Attribution">
        <Grid>
          <Field label="UTM source" value={lead.utmSource} />
          <Field label="UTM medium" value={lead.utmMedium} />
          <Field label="UTM campaign" value={lead.utmCampaign} />
          <Field label="UTM term" value={lead.utmTerm} />
          <Field label="UTM content" value={lead.utmContent} />
          <Field label="GCLID" value={lead.gclid} mono />
          <Field label="gbraid" value={lead.gbraid} mono />
          <Field label="wbraid" value={lead.wbraid} mono />
        </Grid>
      </Section>

      {/* TECHNICAL */}
      <Section icon={<Activity size={14} />} title="Technical">
        <Field label="Lead ID" value={lead.id} mono breakAll />
        <Field className="mt-3" label="IP hash" value={lead.ipHash} mono breakAll />
        <Field className="mt-3" label="User agent" value={lead.userAgent} mono breakAll />
      </Section>
    </SlideOver>
  )
}

function Section({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section>
      <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        <span aria-hidden>{icon}</span>
        {title}
      </p>
      {children}
    </section>
  )
}

function Grid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-3">{children}</div>
}

function Field({
  label,
  value,
  mono,
  href,
  breakAll,
  className,
}: {
  label: string
  value: string
  mono?: boolean
  href?: string
  breakAll?: boolean
  className?: string
}) {
  const display = value || '—'
  const isEmpty = display === '—'
  return (
    <div className={cn('min-w-0', className)}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      {href && !isEmpty ? (
        <a href={href} className="block truncate text-sm text-brand-primary hover:underline" title={display}>
          {display}
        </a>
      ) : (
        <p
          className={cn('text-sm text-slate-800', mono && 'font-mono text-[12px]', breakAll ? 'break-all' : 'truncate')}
          title={display}
        >
          {display}
        </p>
      )}
    </div>
  )
}
