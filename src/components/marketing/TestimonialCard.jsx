import { Star } from 'lucide-react'
import { Card } from '@/components/ui/Card'

function clampRating(value) {
  const n = Math.round(Number(value))
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(5, n))
}

function getInitials(name) {
  if (typeof name !== 'string') return '?'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  const letters = (words[0][0] ?? '') + (words.length > 1 ? words[words.length - 1][0] ?? '' : '')
  return letters.toUpperCase() || '?'
}

export default function TestimonialCard({ testimonial }) {
  // FIX-054: testimonials have no `image` field — render an initials avatar
  // instead of passing undefined to next/image (which throws and breaks /customers).
  const rating = clampRating(testimonial?.rating)
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-slate-200 hover:border-indigo-200 hover:-translate-y-1 group">
      <div className="p-10 flex flex-col h-full relative">
        <div className="absolute top-8 right-8 text-indigo-100 group-hover:text-indigo-200 transition-colors">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 32 32">
            <path d="M10 8c-3.3 0-6 2.7-6 6v10h8V14H8c0-1.1.9-2 2-2h2V8h-2zm12 0c-3.3 0-6 2.7-6 6v10h8V14h-4c0-1.1.9-2 2-2h2V8h-2z" />
          </svg>
        </div>

        {rating > 0 ? (
          <div className="flex items-center gap-1 mb-6">
            {[...Array(rating)].map((_, i) => (
              <Star key={i} className="text-yellow-500 fill-yellow-500" size={18} />
            ))}
          </div>
        ) : null}

        <p className="text-slate-700 text-lg leading-relaxed mb-8 flex-1 font-medium">
          "{testimonial?.quote}"
        </p>

        <div className="flex items-center gap-5">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-400 text-xl font-bold text-white ring-4 ring-indigo-50 group-hover:ring-indigo-100 transition-all"
            aria-hidden="true"
          >
            {getInitials(testimonial?.name)}
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg">{testimonial?.name}</div>
            <div className="text-sm text-slate-600 font-medium">{testimonial?.role}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
