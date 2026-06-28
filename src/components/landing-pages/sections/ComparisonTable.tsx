'use client'

import * as Lucide from 'lucide-react'
import { jsonArray, n, s } from '@/lib/landing-pages/safeProps'
import { Container, SectionWrap, SectionHeading } from './primitives'

type Common = { props: Record<string, unknown> }

export function ComparisonTable({ props }: Common) {
  const heading = s(props.heading)
  const subheading = s(props.subheading)
  const columns = jsonArray(props.columns).map((v) => s(v))
  const highlightColumn = n(props.highlightColumn, 0)
  const rows = jsonArray(props.rows) as Array<{ label?: string; values?: unknown[] }>

  return (
    <SectionWrap bg="white">
      <Container>
        <SectionHeading heading={heading} subheading={subheading} />
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left p-4 text-slate-500 font-medium"></th>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`text-center p-4 font-semibold ${i === highlightColumn ? 'text-slate-900 bg-amber-50' : 'text-slate-700'}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0 border-slate-100">
                  <td className="p-4 text-slate-800 font-medium">{s(row.label)}</td>
                  {columns.map((_col, ci) => {
                    const val = row.values?.[ci]
                    const isYes = val === true || val === 'true' || val === '✓' || val === 'yes'
                    return (
                      <td key={ci} className={`p-4 text-center ${ci === highlightColumn ? 'bg-amber-50/50' : ''}`}>
                        {typeof val === 'string' && !['true', 'false', '✓', '✗', 'yes', 'no'].includes(val)
                          ? val
                          : isYes
                          ? <Lucide.Check className="inline size-5 text-emerald-600" />
                          : <Lucide.X className="inline size-5 text-slate-300" />}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </SectionWrap>
  )
}
