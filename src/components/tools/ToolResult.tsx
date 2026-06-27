'use client'

import { useState } from 'react'
import type { ToolGate } from '@/lib/tools/types'
import { ToolLeadForm } from './ToolLeadForm'

interface ToolResultProps {
  gate: ToolGate
  leadCaptureEnabled: boolean
  slug: string
  serviceInterest: string
  gatedOutputLabel: string
  leadMagnetDescription: string
  resultSnapshot: Record<string, unknown>
  /** Always-visible free headline result. */
  headline: React.ReactNode
  /** The detailed breakdown — revealed when open, or after lead capture when soft-gated. */
  detail: React.ReactNode
}

export function ToolResult({
  gate,
  leadCaptureEnabled,
  slug,
  serviceInterest,
  gatedOutputLabel,
  leadMagnetDescription,
  resultSnapshot,
  headline,
  detail,
}: ToolResultProps) {
  const [unlocked, setUnlocked] = useState(false)
  const showDetail = gate === 'open' || !leadCaptureEnabled || unlocked

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-2xl font-bold text-slate-900">{headline}</div>

      {showDetail ? (
        <div className="mt-4">{detail}</div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-[#f16610]/40 bg-[#f16610]/5 p-5">
          <p className="font-semibold text-slate-900">{leadMagnetDescription}</p>
          <div className="mt-3">
            <ToolLeadForm
              slug={slug}
              serviceInterest={serviceInterest}
              submitLabel={gatedOutputLabel}
              resultSnapshot={resultSnapshot}
              onSuccess={() => setUnlocked(true)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
