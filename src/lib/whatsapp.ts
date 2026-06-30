/**
 * FIX-079: centralized WhatsApp click-to-chat with per-service opening lines.
 *
 * One source of truth for the business number + the prefilled message, so the
 * chat panel, product pages, and landing pages all open WhatsApp with a
 * service-aware message instead of a one-size-fits-all line.
 */
export const WHATSAPP_NUMBER = '971521549572'

const GENERIC_MESSAGE = "Hi Finanshels team, I'd like to talk to someone about your services."

// Matched as case-insensitive substrings against the service label, so
// "Corporate Tax registration" → the corporate-tax line. Order: most specific
// first where labels could overlap.
const SERVICE_TEMPLATES: ReadonlyArray<[match: string, message: string]> = [
  ['corporate tax', 'Hi Finanshels team, I need help with UAE Corporate Tax (registration/filing).'],
  ['vat', "Hi Finanshels team, I'd like help with VAT (registration/filing)."],
  ['bookkeeping', 'Hi Finanshels team, I need bookkeeping support for my business.'],
  ['accounting', 'Hi Finanshels team, I need accounting & bookkeeping support.'],
  ['audit', 'Hi Finanshels team, I need help with audit & assurance.'],
  ['aml', 'Hi Finanshels team, I need help with AML / goAML compliance.'],
  ['cfo', "Hi Finanshels team, I'd like to talk about CFO / advisory services."],
  ['liquidation', 'Hi Finanshels team, I need help with company liquidation.'],
  ['company setup', 'Hi Finanshels team, I need help with company setup in the UAE.'],
  ['payroll', 'Hi Finanshels team, I need help with payroll & WPS.'],
]

export function whatsappMessageForService(service: string): string {
  const normalized = service.toLowerCase().trim()
  if (normalized) {
    for (const [match, message] of SERVICE_TEMPLATES) {
      if (normalized.includes(match)) return message
    }
    return `Hi Finanshels team, I'd like to talk to someone about ${service.trim()}.`
  }
  return GENERIC_MESSAGE
}

export function whatsappHref(service = ''): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessageForService(service))}`
}
