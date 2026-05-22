import Image from 'next/image'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { getCmsDocument, listCmsDocuments } from '@/lib/cms/collectionRepository'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'

type Block = Record<string, unknown> & { type: string }

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function readArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

/** Reference fields inside a block may arrive as an array or a comma-separated string. */
function readRefIds(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean)
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean)
  return []
}

function isCollectionKey(value: string): value is CmsCollectionKey {
  return Object.prototype.hasOwnProperty.call(CMS_COLLECTION_DEFINITION_MAP, value)
}

/** Builds a public detail URL for a doc, only for single-parameter `/path/[slug]` patterns. */
function detailHref(collection: CmsCollectionKey, slug: string): string | null {
  const pattern = CMS_COLLECTION_DEFINITION_MAP[collection]?.routePattern
  if (!pattern) return null
  const params = pattern.match(/\[[^\]]+\]/g) ?? []
  if (params.length !== 1 || params[0] !== '[slug]') return null
  return pattern.replace('[slug]', encodeURIComponent(slug))
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
          <Image
            src={imageUrl}
            alt={readString(block.imageAlt)}
            width={1200}
            height={630}
            className="mt-8 w-full rounded-2xl object-cover"
          />
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
        {cover ? (
          <Image
            src={cover}
            alt={heading}
            width={160}
            height={160}
            className="h-40 w-40 rounded-xl object-cover"
          />
        ) : null}
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
            <Image
              key={idx}
              src={logo.src}
              alt={logo.alt ?? 'Logo'}
              width={160}
              height={40}
              className="h-10 w-full object-contain opacity-70"
            />
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

// FIX-040: every cross-collection lookup in a block must degrade gracefully.
// A referenced doc can be deleted, renamed, or unpublished at any time —
// throwing here would 500 the whole detail page.
async function safeGetCmsDocument(
  collection: Parameters<typeof getCmsDocument>[0],
  id: string
): Promise<Record<string, unknown> | null> {
  try {
    return (await getCmsDocument(collection, id)) as Record<string, unknown> | null
  } catch {
    return null
  }
}

async function ToolEmbedBlock({ block }: { block: Block }) {
  let heading = readString(block.heading)
  let description = readString(block.description)
  const toolUrl = readString(block.toolUrl)
  const toolRefId = readRefIds(block.toolRef)[0]

  let toolHref: string | null = null
  if (toolRefId) {
    const tool = await safeGetCmsDocument('tools', toolRefId)
    if (tool) {
      heading = heading || readString(tool.tool_name)
      description = description || readString(tool.short_description)
      const slug = readString(tool.slug) || toolRefId
      toolHref = detailHref('tools', slug)
    }
  }

  if (!heading && !description && !toolUrl && !toolHref) return null

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        {heading ? <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {description ? <p className="mt-2 text-slate-700">{description}</p> : null}
        {toolUrl ? (
          <div className="mt-6 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            <iframe src={toolUrl} title={heading || 'Embedded tool'} className="h-full w-full" />
          </div>
        ) : toolHref ? (
          <a
            href={toolHref}
            className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark hover:brightness-110"
          >
            Open the tool
          </a>
        ) : null}
      </div>
    </section>
  )
}

function FormBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const embedUrl = readString(block.embedUrl)
  const submitLabel = readString(block.submitLabel) || 'Get in touch'

  if (!heading && !subheading && !embedUrl) return null

  return (
    <section className="bg-[#fff8f1] py-12">
      <div className="mx-auto max-w-3xl px-6 text-center">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-3 text-base text-slate-600">{subheading}</p> : null}
        {embedUrl ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <iframe src={embedUrl} title={heading || 'Form'} className="h-[520px] w-full" />
          </div>
        ) : (
          <a
            href="/contact"
            className="mt-6 inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark hover:brightness-110"
          >
            {submitLabel}
          </a>
        )}
      </div>
    </section>
  )
}

async function SpeakerBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const memberIds = readRefIds(block.memberRefs)
  if (memberIds.length === 0) return null

  // FIX-040: a deleted team_members doc must not 500 this page. Each lookup is
  // wrapped via safeGetCmsDocument so missing members are silently filtered out.
  const members = (
    await Promise.all(memberIds.map((id) => safeGetCmsDocument('team_members', id)))
  ).filter((m): m is Record<string, unknown> => m !== null)

  if (members.length === 0) return null

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {members.map((member, idx) => {
            const name = readString(member.full_name)
            const role = readString(member.job_title)
            const bio = readString(member.short_bio)
            const photo = readString(member.photo)
            const slug = readString(member.slug)
            const href = slug ? detailHref('team_members', slug) : null
            const card = (
              <div className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
                {photo ? (
                  <Image
                    src={photo}
                    alt={name}
                    width={64}
                    height={64}
                    className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  {name ? <p className="text-base font-semibold text-slate-900">{name}</p> : null}
                  {role ? <p className="text-sm text-brand-primary">{role}</p> : null}
                  {bio ? <p className="mt-1 text-sm text-slate-600">{bio}</p> : null}
                </div>
              </div>
            )
            return href ? (
              <a key={idx} href={href} className="block transition hover:opacity-90">
                {card}
              </a>
            ) : (
              <div key={idx}>{card}</div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

interface RelatedCard {
  title: string
  href: string
}

async function resolveCard(
  collection: CmsCollectionKey,
  docId: string
): Promise<RelatedCard | null> {
  const definition = CMS_COLLECTION_DEFINITION_MAP[collection]
  if (!definition) return null
  // FIX-040: tolerate deleted/unpublished refs without crashing the page.
  const doc = await safeGetCmsDocument(collection, docId)
  if (!doc) return null
  const slug = readString(doc[definition.slugField]) || docId
  const href = detailHref(collection, slug)
  if (!href) return null
  const title = readString(doc[definition.titleField]) || slug
  return { title, href }
}

async function RelatedContentBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const mode = readString(block.mode) || 'manual'
  const maxItemsRaw = typeof block.maxItems === 'number' ? block.maxItems : 6
  const maxItems = Math.max(1, Math.min(24, maxItemsRaw))

  const cards: RelatedCard[] = []
  const seen = new Set<string>()

  const pushCard = (card: RelatedCard | null) => {
    if (!card || seen.has(card.href) || cards.length >= maxItems) return
    seen.add(card.href)
    cards.push(card)
  }

  // Manual references: [{ collection, id }]
  if (mode !== 'auto') {
    const manualRefs = readArray(block.manualRefs)
    for (const ref of manualRefs) {
      if (!ref || typeof ref !== 'object') continue
      const entry = ref as Record<string, unknown>
      const collection = readString(entry.collection)
      const id = readString(entry.id)
      if (!collection || !id || !isCollectionKey(collection)) continue
      pushCard(await resolveCard(collection, id))
    }
  }

  // Auto fill from source collections.
  if (mode !== 'manual' && cards.length < maxItems) {
    const sources = readRefIds(block.sourceCollections)
    for (const source of sources) {
      if (cards.length >= maxItems || !isCollectionKey(source)) continue
      const definition = CMS_COLLECTION_DEFINITION_MAP[source]
      const docs = await listCmsDocuments(
        source,
        definition.titleField,
        definition.slugField,
        maxItems * 2
      )
      for (const doc of docs) {
        if (cards.length >= maxItems) break
        if (doc.status !== 'published') continue
        const href = detailHref(source, doc.slug)
        if (!href) continue
        pushCard({ title: doc.title || doc.slug, href })
      }
    }
  }

  if (cards.length === 0) return null

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.href}
              href={card.href}
              className="block rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-brand-primary hover:bg-white"
            >
              <p className="text-base font-semibold text-slate-900">{card.title}</p>
              <span className="mt-2 inline-block text-sm font-semibold text-brand-primary">Read more →</span>
            </a>
          ))}
        </div>
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
          case 'tool_embed':
            return <ToolEmbedBlock key={key} block={block} />
          case 'form':
            return <FormBlock key={key} block={block} />
          case 'download':
            return <DownloadBlock key={key} block={block} />
          case 'speaker':
            return <SpeakerBlock key={key} block={block} />
          case 'related_content':
            return <RelatedContentBlock key={key} block={block} />
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
