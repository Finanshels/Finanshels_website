import Link from 'next/link'
import { BookMarked } from 'lucide-react'
import type { GlossaryTerm } from '@/lib/cms/schemas/glossary'

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, '')
}

export function GlossaryCard({ term }: { term: GlossaryTerm }) {
  const plain = stripTags(term.definition)
  const preview = plain.length > 160 ? `${plain.slice(0, 157).trim()}…` : plain

  return (
    <Link
      href={`/glossary/${term.slug}`}
      className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-[#f16610]/35 hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff4ec] text-[#f16610] transition group-hover:bg-[#f16610] group-hover:text-white">
        <BookMarked className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <h2 className="font-semibold text-slate-900 group-hover:text-[#f16610]">{term.term}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{preview}</p>
      </div>
    </Link>
  )
}
