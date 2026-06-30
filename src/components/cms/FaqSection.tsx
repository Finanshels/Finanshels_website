export type FaqSectionItem = { question: string; answer: string }

/**
 * FIX-071: visible FAQ accordion. Any page that emits FAQPage JSON-LD MUST also
 * render the same Q&A on-page — hidden-FAQ schema (structured data the human
 * never sees) is a black-hat SEO risk flagged in the June-29 review. Native
 * <details>/<summary> keeps this accessible and zero-JS (works in RSC).
 */
export function FaqSection({
  items,
  title = 'Frequently asked questions',
  className,
}: {
  items: FaqSectionItem[]
  title?: string
  className?: string
}) {
  if (items.length === 0) return null

  return (
    <section className={className} aria-label={title}>
      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-6 divide-y divide-slate-200 border-y border-slate-200">
        {items.map((item, index) => (
          <details key={`${index}-${item.question}`} className="group py-4">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-slate-900 marker:content-['']">
              <span>{item.question}</span>
              <span className="shrink-0 text-[#f16610] transition-transform group-open:rotate-45" aria-hidden>
                +
              </span>
            </summary>
            <div className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-600">
              {item.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
