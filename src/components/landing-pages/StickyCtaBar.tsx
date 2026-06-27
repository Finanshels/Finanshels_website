'use client'

import { Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { fireConversion } from '@/lib/landing-pages/gtag'
import type { CtaConfig } from './CtaButtons'

export default function StickyCtaBar({ cta }: { cta: CtaConfig }) {
  const onCall = () => {
    if (cta.conversionId && cta.conversionLabels.call_click) {
      fireConversion({ conversionId: cta.conversionId, conversionLabel: cta.conversionLabels.call_click })
    }
  }
  const onWhatsapp = () => {
    if (cta.conversionId && cta.conversionLabels.whatsapp_click) {
      fireConversion({ conversionId: cta.conversionId, conversionLabel: cta.conversionLabels.whatsapp_click })
    }
  }
  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.15)]">
      <div className="grid grid-cols-3 gap-2 p-2.5">
        {cta.hasPhone ? (
          <a
            href={cta.telHref}
            onClick={onCall}
            className="inline-flex flex-col items-center justify-center gap-0.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold px-2 py-2.5"
          >
            <Phone className="size-4" />
            Call
          </a>
        ) : <span />}
        {cta.hasWhatsApp ? (
          <a
            href={cta.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onWhatsapp}
            className="inline-flex flex-col items-center justify-center gap-0.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold px-2 py-2.5"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        ) : <span />}
        <a
          href={`#${cta.formAnchor.replace(/^#/, '')}`}
          className="inline-flex flex-col items-center justify-center gap-0.5 rounded-lg bg-amber-400 text-slate-900 text-[11px] font-semibold px-2 py-2.5"
        >
          <ArrowRight className="size-4" />
          Get quote
        </a>
      </div>
    </div>
  )
}
