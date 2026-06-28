/**
 * UAE VAT math. The standard rate (5%) is the FTA standard-rated supply rate
 * as of 2026-06. Zero-rated / exempt supplies are modelled by passing ratePct: 0.
 * Source: FTA VAT (Federal Decree-Law No. 8 of 2017). Verify rate if FTA changes it.
 */
export const VAT_STANDARD_RATE = 5 as const

export type VatDirection = 'add' | 'remove'

export interface VatInput {
  /** When direction='add' this is the NET amount; when 'remove' it is the GROSS amount. */
  amount: number
  ratePct: number
  direction: VatDirection
}

export interface VatResult {
  net: number
  vat: number
  gross: number
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100
}

export function calcVat(input: VatInput): VatResult {
  const { amount, ratePct, direction } = input
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('amount must be a non-negative number')
  }
  if (!Number.isFinite(ratePct) || ratePct < 0 || ratePct > 100) {
    throw new Error('ratePct must be between 0 and 100')
  }

  const rate = ratePct / 100
  if (direction === 'add') {
    const net = round2(amount)
    const vat = round2(amount * rate)
    return { net, vat, gross: round2(net + vat) }
  }

  const net = round2(amount / (1 + rate))
  const gross = round2(amount)
  return { net, vat: round2(gross - net), gross }
}
