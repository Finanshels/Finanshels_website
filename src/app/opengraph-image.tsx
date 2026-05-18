import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'
export const alt = 'Finanshels — Finance, tax, and compliance for ambitious teams across MENA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #fff7f0 0%, #ffffff 55%, #fde6d8 100%)',
          padding: '72px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#f16610',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: 700,
            }}
          >
            F
          </div>
          <div style={{ fontSize: '34px', fontWeight: 700, color: '#0f172a' }}>Finanshels</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: '#0f172a',
              lineHeight: 1.1,
              maxWidth: '900px',
            }}
          >
            Finance, tax, and compliance for ambitious teams
          </div>
          <div style={{ fontSize: '32px', color: '#64748b' }}>
            Accounting · VAT · Corporate Tax · CFO services across the UAE
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: '24px', color: '#475569' }}>
          <span>6,000+ UAE clients</span>
          <span>·</span>
          <span>135+ finance experts</span>
          <span>·</span>
          <span>finanshels.com</span>
        </div>
      </div>
    ),
    { ...size }
  )
}
