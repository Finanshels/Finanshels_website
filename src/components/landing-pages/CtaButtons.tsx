'use client'

import { Phone, MessageCircle, ArrowRight } from 'lucide-react'
import { fireConversion } from '@/lib/landing-pages/gtag'

export type CtaConfig = {
  telHref: string
  whatsappHref: string
  formAnchor: string
  hasPhone: boolean
  hasWhatsApp: boolean
  conversionId: string
  conversionLabels: {
    form_submit: string
    call_click: string
    whatsapp_click: string
  }
}

export function CallButton({ cta, label = 'Call now', tone = 'light', className }: { cta: CtaConfig; label?: string; tone?: 'light' | 'dark'; className?: string }) {
  if (!cta.hasPhone) return null
  const onClick = () => {
    if (cta.conversionId && cta.conversionLabels.call_click) {
      fireConversion({ conversionId: cta.conversionId, conversionLabel: cta.conversionLabels.call_click })
    }
  }
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition'
  const styles = tone === 'dark'
    ? 'bg-white text-slate-900 hover:bg-slate-100'
    : 'bg-slate-900 text-white hover:bg-slate-800'
  return (
    <a href={cta.telHref} onClick={onClick} className={`${base} ${styles} ${className ?? ''}`}>
      <Phone className="size-4" /> {label}
    </a>
  )
}

export function WhatsappButton({ cta, label = 'WhatsApp', tone = 'light', className }: { cta: CtaConfig; label?: string; tone?: 'light' | 'dark'; className?: string }) {
  if (!cta.hasWhatsApp) return null
  const onClick = () => {
    if (cta.conversionId && cta.conversionLabels.whatsapp_click) {
      fireConversion({
        conversionId: cta.conversionId,
        conversionLabel: cta.conversionLabels.whatsapp_click,
      })
    }
  }
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition'
  const styles = tone === 'dark'
    ? 'border border-white/30 text-white hover:bg-white/10'
    : 'bg-emerald-600 text-white hover:bg-emerald-700'
  return (
    <a href={cta.whatsappHref} target="_blank" rel="noopener noreferrer" onClick={onClick} className={`${base} ${styles} ${className ?? ''}`}>
      <MessageCircle className="size-4" /> {label}
    </a>
  )
}

export function FormScrollButton({ cta, label = 'Get a free quote', tone = 'light', className }: { cta: CtaConfig; label?: string; tone?: 'light' | 'dark'; className?: string }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition'
  const styles = tone === 'dark'
    ? 'bg-amber-400 text-slate-900 hover:bg-amber-300 [.lp-themed_&]:bg-[var(--lp-accent)] [.lp-themed_&]:text-[var(--lp-accent-contrast)] [.lp-themed_&]:hover:brightness-110'
    : 'bg-slate-900 text-white hover:bg-slate-800'
  return (
    <a href={`#${cta.formAnchor.replace(/^#/, '')}`} className={`${base} ${styles} ${className ?? ''}`}>
      {label} <ArrowRight className="size-4" />
    </a>
  )
}
