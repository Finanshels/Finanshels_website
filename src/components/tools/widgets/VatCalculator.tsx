'use client'

import { useMemo, useState } from 'react'
import { calcVat, VAT_STANDARD_RATE, type VatDirection } from '@/lib/tools/vat'
import type { ToolWidgetProps } from '@/lib/tools/types'
import { ToolResult } from '../ToolResult'

function aed(n: number): string {
  return `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function VatCalculator({
  slug,
  gate,
  leadCaptureEnabled,
  gatedOutputLabel,
  leadMagnetDescription,
  serviceInterest,
}: ToolWidgetProps) {
  const [amount, setAmount] = useState('1000')
  const [direction, setDirection] = useState<VatDirection>('add')

  const result = useMemo(() => {
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed < 0) return null
    try {
      return calcVat({ amount: parsed, ratePct: VAT_STANDARD_RATE, direction })
    } catch {
      return null
    }
  }, [amount, direction])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <label className="block text-sm font-medium text-slate-700">
          {direction === 'add' ? 'Amount excluding VAT' : 'Amount including VAT'}
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
          />
        </label>
        <div className="mt-4 inline-flex rounded-lg border border-slate-300 p-1">
          <button
            type="button"
            onClick={() => setDirection('add')}
            className={`rounded px-3 py-1.5 text-sm ${direction === 'add' ? 'bg-[#f16610] text-white' : 'text-slate-700'}`}
          >
            Add VAT
          </button>
          <button
            type="button"
            onClick={() => setDirection('remove')}
            className={`rounded px-3 py-1.5 text-sm ${direction === 'remove' ? 'bg-[#f16610] text-white' : 'text-slate-700'}`}
          >
            Remove VAT
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">UAE standard rate: {VAT_STANDARD_RATE}%</p>
      </div>

      {result ? (
        <ToolResult
          gate={gate}
          leadCaptureEnabled={leadCaptureEnabled}
          slug={slug}
          serviceInterest={serviceInterest}
          gatedOutputLabel={gatedOutputLabel}
          leadMagnetDescription={leadMagnetDescription}
          resultSnapshot={{ amount: Number(amount), direction, ...result }}
          headline={<span>VAT: {aed(result.vat)}</span>}
          detail={
            <dl className="grid gap-2 text-sm">
              <div className="flex justify-between"><dt className="text-slate-500">Net</dt><dd className="font-medium">{aed(result.net)}</dd></div>
              <div className="flex justify-between"><dt className="text-slate-500">VAT ({VAT_STANDARD_RATE}%)</dt><dd className="font-medium">{aed(result.vat)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-2"><dt className="text-slate-700">Gross</dt><dd className="font-semibold">{aed(result.gross)}</dd></div>
            </dl>
          }
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
          Enter a valid amount to see the result.
        </div>
      )}
    </div>
  )
}
