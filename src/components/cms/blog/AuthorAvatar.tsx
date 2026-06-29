/** Avatar for a byline. Server-safe. Renders the photo when supplied (FIX-068),
 *  otherwise an initials badge. */
import Image from 'next/image'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
  return letters || '·'
}

const SIZES = {
  sm: { box: 'h-7 w-7 text-[11px]', px: '28px' },
  md: { box: 'h-9 w-9 text-xs', px: '36px' },
  lg: { box: 'h-12 w-12 text-sm', px: '48px' },
} as const

export function AuthorAvatar({
  name,
  photo = null,
  size = 'md',
}: {
  name: string
  photo?: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const { box, px } = SIZES[size]

  if (photo) {
    return (
      <span className={`relative shrink-0 overflow-hidden rounded-full ring-1 ring-[#f16610]/20 ${box}`}>
        <Image src={photo} alt={name} fill sizes={px} className="object-cover" />
      </span>
    )
  }

  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f16610]/10 font-mono font-semibold tracking-tight text-[#b3470a] ring-1 ring-[#f16610]/20 ${box}`}
    >
      {initials(name)}
    </span>
  )
}
