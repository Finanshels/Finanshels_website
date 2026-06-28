import { Linkedin } from '@/components/icons/BrandIcons'
import { Card } from '@/components/ui/Card'

// FIX-056: this card previously returned null, leaving the /about Leadership
// grid completely empty. Render real members with an initials avatar (the data
// only ships cartoon placeholder images, which undercut a finance brand), name,
// role, bio, and a LinkedIn link.
function getInitials(name) {
  if (typeof name !== 'string') return '?'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const letters = (words[0][0] ?? '') + (words.length > 1 ? words[words.length - 1][0] ?? '' : '')
  return letters.toUpperCase() || '?'
}

export default function LeadershipCard({ leader }) {
  if (!leader) return null
  return (
    <Card className="h-full border-2 border-slate-200 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffd7c0] hover:shadow-xl">
      <div className="flex h-full flex-col p-7">
        <div className="flex items-center gap-4">
          <div
            className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f16610] to-[#ff9248] text-lg font-bold text-white"
            aria-hidden="true"
          >
            {getInitials(leader.name)}
          </div>
          <div className="min-w-0">
            <div className="truncate text-lg font-bold text-slate-900">{leader.name}</div>
            <div className="text-sm font-medium text-[#f16610]">{leader.role}</div>
          </div>
        </div>
        {leader.bio ? (
          <p className="mt-5 flex-1 text-sm leading-relaxed text-slate-600">{leader.bio}</p>
        ) : (
          <div className="flex-1" />
        )}
        {leader.linkedin ? (
          <a
            href={leader.linkedin}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0a66c2]"
            aria-label={`${leader.name} on LinkedIn`}
          >
            <Linkedin size={18} />
            Connect
          </a>
        ) : null}
      </div>
    </Card>
  )
}
