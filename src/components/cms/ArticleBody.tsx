type Props = { html: string; className?: string }

/** Server-rendered HTML already sanitized with `sanitizeCmsHtml`. */
export function ArticleBody({ html, className = '' }: Props) {
  if (!html) return null
  return (
    <div
      className={`prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-a:text-[#f16610] prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
