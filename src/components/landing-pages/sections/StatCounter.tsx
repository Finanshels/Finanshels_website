'use client'

import { useEffect, useRef, useState } from 'react'

/** Splits "+1,200%" into prefix/number/suffix and counts the number up on reveal. */
function parse(value: string): { prefix: string; target: number; suffix: string; decimals: number } | null {
  const m = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const numeric = m[2]!.replace(/,/g, '')
  const decimals = numeric.includes('.') ? numeric.split('.')[1]!.length : 0
  return { prefix: m[1] ?? '', target: parseFloat(numeric), suffix: m[3] ?? '', decimals }
}

export function StatCounter({ value, className }: { value: string; className?: string }) {
  const parsed = parse(value)
  const ref = useRef<HTMLSpanElement | null>(null)
  const [display, setDisplay] = useState<number | null>(parsed ? 0 : null)

  useEffect(() => {
    if (!parsed) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDisplay(parsed.target); return }
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return
      obs.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1100)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(parsed.target * eased)
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [parsed?.target])

  if (!parsed || display === null) return <span className={className}>{value}</span>
  const shown = display.toLocaleString('en-US', {
    minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals,
  })
  return <span ref={ref} className={className}>{parsed.prefix}{shown}{parsed.suffix}</span>
}
