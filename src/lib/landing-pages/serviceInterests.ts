export type ServiceInterest = {
  value: string
  label: string
}

export const SERVICE_INTERESTS: readonly ServiceInterest[] = [
  { value: 'corporate_tax_registration', label: 'Corporate Tax Registration' },
  { value: 'corporate_tax_filing', label: 'Corporate Tax Filing' },
  { value: 'vat_registration', label: 'VAT Registration' },
  { value: 'vat_filing', label: 'VAT Filing' },
  { value: 'accounting_bookkeeping', label: 'Accounting & Bookkeeping' },
  { value: 'tax_advisory', label: 'Tax Advisory' },
  { value: 'aml_compliance', label: 'AML Compliance' },
  { value: 'goaml_registration', label: 'goAML Registration' },
  { value: 'company_liquidation', label: 'Company Liquidation' },
  { value: 'business_setup', label: 'Business Setup' },
  { value: 'audit_assurance', label: 'Audit & Assurance' },
  { value: 'payroll', label: 'Payroll Services' },
  { value: 'esr_compliance', label: 'ESR Compliance' },
  { value: 'general_inquiry', label: 'General Inquiry' },
] as const

const VALUE_SET = new Set(SERVICE_INTERESTS.map((s) => s.value))

export function isServiceInterest(value: string): boolean {
  return VALUE_SET.has(value)
}

export function getServiceInterestLabel(value: string): string {
  return SERVICE_INTERESTS.find((s) => s.value === value)?.label ?? value
}
