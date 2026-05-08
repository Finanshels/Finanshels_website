import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f16610 0%, #ffb347 100%)',
          color: '#0f172a',
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: -1,
          borderRadius: 6,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        F
      </div>
    ),
    { ...size }
  )
}
