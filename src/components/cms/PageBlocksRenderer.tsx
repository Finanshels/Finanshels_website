import { ArticleBody } from '@/components/cms/ArticleBody'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'

type Block = Record<string, unknown> & { type: string }

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function HeroBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const eyebrow = readString(block.eyebrow)
  const imageUrl = readString(block.imageUrl)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = readString(block.ctaUrl)
  return (
    <section className="bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/50">{eyebrow}</p>
        ) : null}
        {heading ? <h2 className="mt-3 text-4xl font-semibold tracking-tight">{heading}</h2> : null}
        {subheading ? <p className="mt-4 max-w-2xl text-lg text-white/70">{subheading}</p> : null}
        {imageUrl ? (
          <img src={imageUrl} alt={readString(block.imageAlt)} className="mt-8 w-full rounded-2xl object-cover" />
        ) : null}
        {ctaLabel && ctaUrl ? (
          <a href={ctaUrl} className="mt-8 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark">
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  )
}

function CtaBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const primaryLabel = readString(block.primaryLabel)
  const primaryUrl = readString(block.primaryUrl)
  return (
    <section className="bg-[#fff8f1] py-12">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-3 text-base text-slate-600">{subheading}</p> : null}
        {primaryLabel && primaryUrl ? (
          <a
            href={primaryUrl}
            className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark hover:brightness-110"
          >
            {primaryLabel}
          </a>
        ) : null}
      </div>
    </section>
  )
}

function FaqAccordionBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const items = readArray(block.items).filter(
    (item): item is { question: string; answer: string } =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).question === 'string' &&
      typeof (item as Record<string, unknown>).answer === 'string'
  )
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        <dl className="mt-6 space-y-3">
          {items.map((item, idx) => (
            <details key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-4 open:bg-white">
              <summary className="cursor-pointer text-base font-semibold text-slate-900">{item.question}</summary>
              <dd className="mt-3 text-slate-700">{item.answer}</dd>
            </details>
          ))}
        </dl>
      </div>
    </section>
  )
}

function StatsBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const items = readArray(block.items).filter(
    (item): item is { value: string; label: string } =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).value === 'string' &&
      typeof (item as Record<string, unknown>).label === 'string'
  )
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        <dl className="mt-6 grid gap-6 sm:grid-cols-3">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <dt className="text-sm font-medium text-slate-500">{item.label}</dt>
              <dd className="mt-1 text-3xl font-semibold text-slate-900">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

function VideoEmbedBlock({ block }: { block: Block }) {
  const url = readString(block.videoUrl)
  if (!url) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
          <iframe
            src={url}
            title={readString(block.caption) || 'Embedded video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
        {block.caption ? <p className="mt-3 text-sm text-slate-500">{String(block.caption)}</p> : null}
      </div>
    </section>
  )
}

function DownloadBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const description = readString(block.description)
  const fileUrl = readString(block.fileUrl)
  const cover = readString(block.coverImageUrl)
  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-[160px,1fr]">
        {cover ? <img src={cover} alt={heading} className="h-40 w-40 rounded-xl object-cover" /> : null}
        <div>
          {heading ? <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
          {description ? <p className="mt-2 text-slate-700">{description}</p> : null}
          {fileUrl ? (
            <a
              href={fileUrl}
              className="mt-4 inline-flex rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-dark hover:brightness-110"
            >
              Download
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function TestimonialBlock({ block }: { block: Block }) {
  const quote = readString(block.quote)
  return (
    <section className="bg-[#fff8f1] py-12">
      <figure className="mx-auto max-w-3xl px-6 text-center">
        <blockquote className="text-2xl font-semibold tracking-tight text-slate-900">“{quote}”</blockquote>
        <figcaption className="mt-4 text-sm text-slate-600">
          {readString(block.authorName)}
          {readString(block.authorRole) ? `, ${readString(block.authorRole)}` : null}
          {readString(block.companyName) ? ` · ${readString(block.companyName)}` : null}
        </figcaption>
      </figure>
    </section>
  )
}

function LogoWallBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const logos = readArray(block.logos).filter(
    (item): item is { src: string; alt: string } =>
      Boolean(item) &&
      typeof item === 'object' &&
      typeof (item as Record<string, unknown>).src === 'string'
  )
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <p className="text-center text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">{heading}</p> : null}
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-6">
          {logos.map((logo, idx) => (
            <img key={idx} src={logo.src} alt={logo.alt ?? 'Logo'} className="h-10 w-full object-contain opacity-70" />
          ))}
        </div>
      </div>
    </section>
  )
}

function TableBlock({ block }: { block: Block }) {
  const data = block.data as { headers?: string[]; rows?: string[][] } | undefined
  if (!data || !Array.isArray(data.rows)) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {readString(block.heading) ? (
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{readString(block.heading)}</h2>
        ) : null}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            {data.headers ? (
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  {data.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            ) : null}
            <tbody className="divide-y divide-slate-100">
              {data.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-slate-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function TimelineBlock({ block }: { block: Block }) {
  const items = readArray(block.items).filter(
    (item): item is { date?: string; title?: string; description?: string } =>
      Boolean(item) && typeof item === 'object'
  )
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-6">
        {readString(block.heading) ? (
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{readString(block.heading)}</h2>
        ) : null}
        <ol className="mt-6 space-y-4 border-l border-slate-200 pl-5">
          {items.map((item, idx) => (
            <li key={idx} className="relative">
              <span className="absolute -left-[27px] mt-1.5 block h-3 w-3 rounded-full bg-brand-primary" />
              {item.date ? <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.date}</p> : null}
              {item.title ? <p className="mt-1 text-base font-semibold text-slate-900">{item.title}</p> : null}
              {item.description ? <p className="mt-1 text-sm text-slate-700">{item.description}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function PageBlocksRenderer({ blocks }: { blocks: unknown }) {
  const list = readArray(blocks) as Block[]
  if (list.length === 0) return null
  return (
    <>
      {list.map((block, index) => {
        const key = `${block.type}-${typeof block.id === 'string' ? block.id : index}`
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={key} block={block} />
          case 'rich_text':
            return (
              <section key={key} className="bg-white py-12">
                <div className="mx-auto max-w-3xl px-6">
                  <ArticleBody html={sanitizeCmsHtml(readString(block.html))} />
                </div>
              </section>
            )
          case 'cta':
            return <CtaBlock key={key} block={block} />
          case 'testimonial':
            return <TestimonialBlock key={key} block={block} />
          case 'faq_accordion':
            return <FaqAccordionBlock key={key} block={block} />
          case 'stats':
            return <StatsBlock key={key} block={block} />
          case 'logo_wall':
            return <LogoWallBlock key={key} block={block} />
          case 'video_embed':
            return <VideoEmbedBlock key={key} block={block} />
          // FIX-023: tool_embed / form / speaker were rendering as generic CtaBlock
          // stubs that silently discarded their unique semantic fields (toolRef,
          // embedUrl, memberRefs) — see MM-008 in admin-audit.md. Returning null
          // until proper components ship signals an implementation gap rather
          // than rendering false content.
          // TODO(FIX-MM-008): implement ToolEmbedBlock, FormBlock, SpeakerBlock.
          case 'tool_embed':
            return null
          case 'form':
            return null
          case 'download':
            return <DownloadBlock key={key} block={block} />
          case 'speaker':
            return null
          case 'related_content':
            return null
          case 'table':
            return <TableBlock key={key} block={block} />
          case 'timeline':
            return <TimelineBlock key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
