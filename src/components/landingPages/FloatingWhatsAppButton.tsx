'use client'

import { MessageCircle } from 'lucide-react'
import { fireConversion } from '@/lib/landingPages/gtag'
import type { CtaConfig } from './CtaButtons'

export default function FloatingWhatsAppButton({ cta }: { cta: CtaConfig }) {
  if (!cta.hasWhatsApp) return null
  const onClick = () => {
    if (cta.conversionId && cta.conversionLabels.whatsapp_click) {
      fireConversion({ conversionId: cta.conversionId, conversionLabel: cta.conversionLabels.whatsapp_click })
    }
  }
  return (
    <a
      href={cta.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="Chat on WhatsApp"
      className="hidden md:flex fixed bottom-6 right-6 z-40 size-14 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 items-center justify-center hover:bg-emerald-600 hover:scale-105 transition"
    >
      <MessageCircle className="size-6" />
    </a>
  )
}
