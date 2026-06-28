'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Smartphone, Tablet } from 'lucide-react'
import type { MutableRefObject } from 'react'
import type { DeviceKey } from './studioTypes'

/**
 * Device frames render the page at its TRUE viewport width, then scale-to-fit
 * the available pane. This is the only way "Desktop" shows the real desktop
 * layout instead of reflowing to the narrow canvas column.
 */
const DEVICES: Array<{
  key: DeviceKey
  label: string
  width: number
  Icon: React.ComponentType<{ className?: string }>
}> = [
  { key: 'desktop', label: 'Desktop', width: 1280, Icon: Monitor },
  { key: 'tablet', label: 'Tablet', width: 834, Icon: Tablet },
  { key: 'mobile', label: 'Mobile', width: 390, Icon: Smartphone },
]

export function CanvasPreview({
  pageId,
  iframeRef,
  device,
  onDeviceChange,
}: {
  pageId: string
  iframeRef: MutableRefObject<HTMLIFrameElement | null>
  device: DeviceKey
  onDeviceChange: (d: DeviceKey) => void
}) {
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [pane, setPane] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = canvasRef.current
    if (!el) return
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect
      if (rect) setPane({ width: rect.width, height: rect.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const deviceWidth = DEVICES.find((d) => d.key === device)?.width ?? 1280
  const scale = pane.width > 0 ? Math.min(1, pane.width / deviceWidth) : 1
  const zoomPct = Math.round(scale * 100)
  const canvasHeight = pane.height > 0 ? pane.height : 640

  return (
    <div className="flex h-full flex-col">
      {/* Device toggle */}
      <div className="mb-2 flex flex-none items-center justify-center">
        <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5">
          {DEVICES.map((d) => (
            <button
              key={d.key}
              type="button"
              onClick={() => onDeviceChange(d.key)}
              aria-label={d.label}
              aria-pressed={device === d.key}
              title={d.label}
              className={`rounded-md p-1.5 ${
                device === d.key ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <d.Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[60vh] flex-1 rounded-xl border border-slate-200 bg-slate-100 p-3 lg:min-h-0">
        <div ref={canvasRef} className="flex h-full justify-center">
          <div
            className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5"
            style={{ width: deviceWidth * scale, height: canvasHeight }}
          >
            <iframe
              ref={iframeRef}
              title="Live preview"
              src={`/admin/cms/landing-pages/${pageId}/preview`}
              style={{
                width: deviceWidth,
                height: scale > 0 ? canvasHeight / scale : canvasHeight,
                border: 0,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          </div>
        </div>
      </div>
      <p className="mt-1.5 flex-none text-center text-[11px] text-slate-400">
        {DEVICES.find((d) => d.key === device)?.label} · {deviceWidth}px
        {zoomPct < 100 ? ` · ${zoomPct}%` : ''} · click any section to edit it
      </p>
    </div>
  )
}
