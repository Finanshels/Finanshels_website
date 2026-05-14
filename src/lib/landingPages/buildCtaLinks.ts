import type { LandingPageDoc } from './types'

export type CtaLinks = {
  telHref: string
  whatsappHref: string
  formAnchor: string
  hasPhone: boolean
  hasWhatsApp: boolean
}

function digitsOnly(input: string): string {
  return input.replace(/[^0-9]/g, '')
}

export function buildCtaLinks(page: Pick<LandingPageDoc, 'primary_phone' | 'whatsapp_number' | 'whatsapp_prefilled_message'>): CtaLinks {
  const phone = page.primary_phone?.trim() ?? ''
  const whatsapp = page.whatsapp_number?.trim() ?? ''
  const msg = page.whatsapp_prefilled_message?.trim() ?? ''
  return {
    telHref: phone ? `tel:${phone}` : '',
    whatsappHref: whatsapp
      ? `https://wa.me/${digitsOnly(whatsapp)}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`
      : '',
    formAnchor: '#lead-form',
    hasPhone: Boolean(phone),
    hasWhatsApp: Boolean(whatsapp),
  }
}
