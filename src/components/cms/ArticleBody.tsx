type Props = { html: string; className?: string }

/** Server-rendered HTML already sanitized with `sanitizeCmsHtml`. */
export function ArticleBody({ html, className = '' }: Props) {
  if (!html) return null
  return (
    <div
      className={`prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.8] prose-p:text-slate-700 prose-a:font-medium prose-a:text-[#f16610] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
