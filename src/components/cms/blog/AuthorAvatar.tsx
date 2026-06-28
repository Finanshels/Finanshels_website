/** Initials badge for a byline. Pure + server-safe (no client APIs). */

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  const letters = parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
  return letters || '·'
}

const SIZES = {
  sm: 'h-7 w-7 text-[11px]',
  md: 'h-9 w-9 text-xs',
} as const

export function AuthorAvatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-[#f16610]/10 font-mono font-semibold tracking-tight text-[#b3470a] ring-1 ring-[#f16610]/20 ${SIZES[size]}`}
    >
      {initials(name)}
    </span>
  )
}
