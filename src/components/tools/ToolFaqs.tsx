import { Plus } from 'lucide-react'
import type { ToolFaq } from '@/lib/cms/toolsRepository'

/**
 * Accessible, no-JS FAQ accordion. Uses native <details>/<summary> so it works
 * without hydration and is crawlable — the page also emits FAQPage JSON-LD from
 * the same data for rich results.
 */
export function ToolFaqs({ faqs }: { faqs: ToolFaq[] }) {
  if (faqs.length === 0) return null
  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group px-5 py-4 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-slate-900">
            <span>{faq.question}</span>
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-400 transition duration-200 group-open:rotate-45 group-open:border-brand-primary group-open:text-brand-primary">
              <Plus className="size-3.5" />
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
