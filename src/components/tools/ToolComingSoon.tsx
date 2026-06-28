'use client'

import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import type { ToolWidgetProps } from '@/lib/tools/types'
import { ToolLeadForm } from './ToolLeadForm'

type ToolComingSoonProps = Pick<ToolWidgetProps, 'slug' | 'serviceInterest'>

/**
 * Shown inside the workbench when a tool has no coded widget yet. Instead of a
 * dead "launching soon" notice, it captures interest through the shared tool
 * lead pipeline — `result_snapshot.intent` marks the lead as a launch signup so
 * the CRM can route a notification rather than a result breakdown.
 */
export function ToolComingSoon({ slug, serviceInterest }: ToolComingSoonProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-brand-secondary/10 blur-3xl"
      />
      <div className="relative">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-light text-brand-primary ring-1 ring-brand-primary/15">
          <Sparkles className="size-7 animate-float-slow" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
          Launching soon
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          This tool is almost ready
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
          We&rsquo;re putting the finishing touches on it. Leave your details and we&rsquo;ll email
          you the moment it goes live.
        </p>

        <div className="mx-auto mt-6 max-w-sm text-left">
          <ToolLeadForm
            slug={slug}
            serviceInterest={serviceInterest}
            submitLabel="Notify me at launch"
            resultSnapshot={{ intent: 'launch_notify', tool: slug }}
            successTitle="You're on the list."
            successMessage="We'll email you as soon as this tool is live."
          />
        </div>

        <p className="mt-5 text-sm text-slate-500">
          In the meantime,{' '}
          <Link href="/tools" className="font-semibold text-brand-primary hover:underline">
            browse our live tools
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
