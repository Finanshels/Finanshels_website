import type { ReactNode } from 'react'
import Image from 'next/image'
import { ArticleBody } from '@/components/cms/ArticleBody'
import { PageOverlays } from '@/components/cms/PageOverlays'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { getCmsDocument, listCmsDocuments } from '@/lib/cms/collectionRepository'
import { resolveFaqAccordionItems } from '@/lib/cms/faqsRepository'
import { getLucideIcon } from '@/lib/cms/lucideIcon'
import {
  CMS_COLLECTION_DEFINITION_MAP,
  type CmsCollectionKey,
} from '@/lib/cms/collectionDefinitions'
import { OVERLAY_BLOCK_TYPES } from '@/lib/cms/definitions/blocks'
import { safeUrl } from '@/lib/cms/safeUrl'

export type Block = Record<string, unknown> & { type: string }

function readString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

/** URL field reader that strips XSS schemes (returns '' when unsafe/empty). */
function safeUrlStr(value: unknown): string {
  return safeUrl(value) ?? ''
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

// FIX-049: hero variant field was defined in block schema but the renderer
// always used the dark gradient style. Now respects all five options.
function HeroBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const eyebrow = readString(block.eyebrow)
  const imageUrl = readString(block.imageUrl)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = safeUrlStr(block.ctaUrl)
  const secondaryCtaLabel = readString(block.secondaryCtaLabel)
  const secondaryCtaUrl = safeUrlStr(block.secondaryCtaUrl)
  const variant = readString(block.variant) || 'default'
  const hasPrimary = ctaLabel && ctaUrl
  const hasSecondary = secondaryCtaLabel && secondaryCtaUrl

  const isDark = variant === 'default' || variant === 'video-bg'
  const sectionClass =
    variant === 'minimal'
      ? 'bg-white text-slate-900'
      : variant === 'gradient'
        ? 'bg-gradient-to-br from-brand-primary/10 via-white to-brand-primary/5 text-slate-900'
        : variant === 'split'
          ? 'bg-slate-50 text-slate-900'
          : 'bg-gradient-to-b from-slate-950 to-slate-900 text-white'
  const eyebrowClass = isDark ? 'text-white/50' : 'text-brand-primary'
  const subheadingClass = isDark ? 'text-white/70' : 'text-slate-600'
  const secondaryBtnClass = isDark
    ? 'border-white/30 text-white hover:bg-white/10'
    : 'border-slate-300 text-slate-900 hover:bg-slate-100'

  const textContent = (
    <>
      {eyebrow ? (
        <p className={`text-xs font-semibold uppercase tracking-[0.32em] ${eyebrowClass}`}>{eyebrow}</p>
      ) : null}
      {heading ? <h2 className="mt-3 text-4xl font-semibold tracking-tight">{heading}</h2> : null}
      {subheading ? <p className={`mt-4 max-w-2xl text-lg ${subheadingClass}`}>{subheading}</p> : null}
      {hasPrimary || hasSecondary ? (
        <div className="mt-8 flex flex-wrap gap-3">
          {hasPrimary ? (
            <a href={ctaUrl} className="inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark">
              {ctaLabel}
            </a>
          ) : null}
          {hasSecondary ? (
            <a href={secondaryCtaUrl} className={`inline-flex rounded-xl border px-5 py-3 text-sm font-semibold ${secondaryBtnClass}`}>
              {secondaryCtaLabel}
            </a>
          ) : null}
        </div>
      ) : null}
    </>
  )

  if (variant === 'split' && imageUrl) {
    return (
      <section className={sectionClass}>
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-16 sm:px-10 md:grid-cols-2 md:items-center">
          <div>{textContent}</div>
          <Image src={imageUrl} alt={readString(block.imageAlt)} width={600} height={400} className="w-full rounded-2xl object-cover" />
        </div>
      </section>
    )
  }

  return (
    <section className={sectionClass}>
      <div className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        {textContent}
        {imageUrl ? (
          <Image src={imageUrl} alt={readString(block.imageAlt)} width={1200} height={630} className="mt-8 w-full rounded-2xl object-cover" />
        ) : null}
      </div>
    </section>
  )
}

function CtaBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const primaryLabel = readString(block.primaryLabel)
  const primaryUrl = safeUrlStr(block.primaryUrl)
  // FIX-048: secondary button + tone were defined in the block schema but
  // never rendered. `tone` maps to a background colour; default keeps the
  // existing brand-soft cream so legacy blocks render unchanged.
  const secondaryLabel = readString(block.secondaryLabel)
  const secondaryUrl = safeUrlStr(block.secondaryUrl)
  const tone = readString(block.tone)
  const sectionTone =
    tone === 'brand'
      ? 'bg-brand-primary text-brand-dark'
      : tone === 'dark'
        ? 'bg-slate-950 text-white'
        : tone === 'minimal'
          ? 'bg-white border-y border-slate-200 text-slate-900'
          : 'bg-[#fff8f1] text-slate-900'
  const subheadingTone = tone === 'dark' ? 'text-white/70' : 'text-slate-600'
  const secondaryButtonTone =
    tone === 'dark'
      ? 'border-white/30 text-white hover:bg-white/10'
      : 'border-slate-300 text-slate-900 hover:bg-slate-100'
  const hasPrimary = primaryLabel && primaryUrl
  const hasSecondary = secondaryLabel && secondaryUrl
  return (
    <section className={`${sectionTone} py-12`}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight">{heading}</h2> : null}
        {subheading ? <p className={`mt-3 text-base ${subheadingTone}`}>{subheading}</p> : null}
        {hasPrimary || hasSecondary ? (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasPrimary ? (
              <a
                href={primaryUrl}
                className="inline-flex rounded-xl bg-brand-primary px-5 py-3 text-sm font-semibold text-brand-dark hover:brightness-110"
              >
                {primaryLabel}
              </a>
            ) : null}
            {hasSecondary ? (
              <a
                href={secondaryUrl}
                className={`inline-flex rounded-xl border px-5 py-3 text-sm font-semibold ${secondaryButtonTone}`}
              >
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

// FIX-049: subheading field was defined in block schema but never rendered.
async function FaqAccordionBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)

  // FIX-068: resolution (service auto-pull vs manual items) lives in
  // faqsRepository so the blog page can derive FAQPage JSON-LD from the SAME
  // visible items.
  const items = await resolveFaqAccordionItems(block)

  if (items.length === 0) return null

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-3xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-2 text-base text-slate-600">{subheading}</p> : null}
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
  const url = safeUrlStr(block.videoUrl)
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

// FIX-049: gated and formId were defined in block schema but never rendered.
function DownloadBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const description = readString(block.description)
  const fileUrl = safeUrlStr(block.fileUrl)
  const cover = readString(block.coverImageUrl)
  const gated = block.gated === true || block.gated === 'true'
  const formId = readString(block.formId)
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
          {gated && formId ? (
            <p className="mt-4 text-sm text-slate-500">
              Fill out the form to access this resource.{' '}
              <a href={"/contact?form=" + encodeURIComponent(formId)} className="font-semibold text-brand-primary underline">
                Request access
              </a>
            </p>
          ) : fileUrl ? (
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

// FIX-049: authorImageUrl and logoUrl were defined in block schema but never rendered.
function TestimonialBlock({ block }: { block: Block }) {
  const quote = readString(block.quote)
  const authorName = readString(block.authorName)
  const authorRole = readString(block.authorRole)
  const companyName = readString(block.companyName)
  const authorImageUrl = readString(block.authorImageUrl)
  const logoUrl = readString(block.logoUrl)
  return (
    <section className="bg-[#fff8f1] py-12">
      <figure className="mx-auto max-w-3xl px-6 text-center">
        <blockquote className="text-2xl font-semibold tracking-tight text-slate-900">&ldquo;{quote}&rdquo;</blockquote>
        <figcaption className="mt-4 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            {authorImageUrl ? (
              <Image src={authorImageUrl} alt={authorName} width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
            ) : null}
            <span className="text-sm text-slate-600">
              {authorName}
              {authorRole ? `, ${authorRole}` : null}
              {companyName ? ` · ${companyName}` : null}
            </span>
          </div>
          {logoUrl ? (
            <Image src={logoUrl} alt={companyName || 'Company logo'} width={120} height={32} className="mt-1 h-6 w-auto object-contain opacity-70" />
          ) : null}
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
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
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
  const toolUrl = safeUrlStr(block.toolUrl)
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
  const embedUrl = safeUrlStr(block.embedUrl)
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

// ---- Content blocks (added 2026-06-30) ----

const CALLOUT_TONES: Record<string, { wrap: string; icon: string; defaultIcon: string }> = {
  info: { wrap: 'border-sky-200 bg-sky-50', icon: 'text-sky-600', defaultIcon: 'info' },
  tip: { wrap: 'border-violet-200 bg-violet-50', icon: 'text-violet-600', defaultIcon: 'lightbulb' },
  success: { wrap: 'border-emerald-200 bg-emerald-50', icon: 'text-emerald-600', defaultIcon: 'circle-check' },
  warning: { wrap: 'border-amber-200 bg-amber-50', icon: 'text-amber-600', defaultIcon: 'triangle-alert' },
}

function CalloutBlock({ block }: { block: Block }) {
  const tone = readString(block.tone) || 'info'
  const cfg = CALLOUT_TONES[tone] ?? CALLOUT_TONES.info
  const title = readString(block.title)
  const body = readString(block.body)
  if (!title && !body) return null
  const Icon = getLucideIcon(readString(block.icon) || cfg.defaultIcon)
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-3xl px-6">
        <div className={`flex gap-3 rounded-2xl border p-4 ${cfg.wrap}`}>
          <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.icon}`} />
          <div className="min-w-0">
            {title ? <p className="text-sm font-semibold text-slate-900">{title}</p> : null}
            {body ? <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-slate-700">{body}</p> : null}
          </div>
        </div>
      </div>
    </section>
  )
}

function MediaTextBlock({ block }: { block: Block }) {
  const eyebrow = readString(block.eyebrow)
  const heading = readString(block.heading)
  const body = readString(block.body)
  const imageUrl = readString(block.imageUrl)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = safeUrlStr(block.ctaUrl)
  const mediaRight = readString(block.mediaSide) === 'right'
  if (!heading && !body && !imageUrl) return null

  const textCol = (
    <div>
      {eyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">{eyebrow}</p> : null}
      {heading ? <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
      {body ? <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-700">{body}</p> : null}
      {ctaLabel && ctaUrl ? (
        <a href={ctaUrl} className="mt-5 inline-flex rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-dark hover:brightness-110">
          {ctaLabel}
        </a>
      ) : null}
    </div>
  )
  const imageCol = imageUrl ? (
    <Image src={imageUrl} alt={readString(block.imageAlt)} width={640} height={480} className="w-full rounded-2xl border border-slate-200 object-cover" />
  ) : null

  return (
    <section className="bg-white py-12">
      <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 md:grid-cols-2">
        {mediaRight ? (
          <>
            {textCol}
            {imageCol}
          </>
        ) : (
          <>
            {imageCol}
            {textCol}
          </>
        )}
      </div>
    </section>
  )
}

function FeatureGridBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const cols = readString(block.columns)
  const colClass =
    cols === '2' ? 'sm:grid-cols-2' : cols === '4' ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3'
  const items = readArray(block.items).filter(
    (item): item is { icon?: string; title?: string; description?: string } => Boolean(item) && typeof item === 'object'
  )
  if (items.length === 0 && !heading) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-2 max-w-2xl text-slate-600">{subheading}</p> : null}
        <div className={`mt-6 grid gap-5 ${colClass}`}>
          {items.map((item, idx) => {
            const Icon = getLucideIcon(item.icon)
            return (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-5 w-5" />
                </span>
                {item.title ? <p className="mt-3 text-base font-semibold text-slate-900">{item.title}</p> : null}
                {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepsBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const horizontal = readString(block.layout) === 'horizontal'
  const items = readArray(block.items).filter(
    (item): item is { title?: string; description?: string } => Boolean(item) && typeof item === 'object'
  )
  if (items.length === 0) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-2 max-w-2xl text-slate-600">{subheading}</p> : null}
        <ol className={`mt-6 ${horizontal ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
          {items.map((item, idx) => (
            <li key={idx} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-brand-dark">
                {idx + 1}
              </span>
              <div>
                {item.title ? <p className="text-base font-semibold text-slate-900">{item.title}</p> : null}
                {item.description ? <p className="mt-1 text-sm text-slate-600">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function PricingBlock({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const subheading = readString(block.subheading)
  const plans = readArray(block.plans).filter(
    (
      p
    ): p is {
      name?: string
      price?: string
      period?: string
      features?: unknown
      ctaLabel?: string
      ctaUrl?: string
      featured?: boolean
    } => Boolean(p) && typeof p === 'object'
  )
  if (plans.length === 0) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-5xl px-6">
        {heading ? <h2 className="text-3xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
        {subheading ? <p className="mt-2 max-w-2xl text-slate-600">{subheading}</p> : null}
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {plans.map((plan, idx) => {
            const features = Array.isArray(plan.features) ? plan.features.map((f) => String(f)) : []
            const featured = plan.featured === true
            const planCtaUrl = safeUrlStr(plan.ctaUrl)
            return (
              <div
                key={idx}
                className={`flex flex-col rounded-2xl border p-6 ${
                  featured ? 'border-brand-primary bg-brand-primary/5 shadow-sm' : 'border-slate-200 bg-white'
                }`}
              >
                {plan.name ? <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">{plan.name}</p> : null}
                <p className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-slate-900">{plan.price ?? ''}</span>
                  {plan.period ? <span className="text-sm text-slate-500">{plan.period}</span> : null}
                </p>
                {features.length > 0 ? (
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-brand-primary">✓</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {plan.ctaLabel && planCtaUrl ? (
                  <a
                    href={planCtaUrl}
                    className={`mt-6 inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-semibold ${
                      featured
                        ? 'bg-brand-primary text-brand-dark hover:brightness-110'
                        : 'border border-slate-300 text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {plan.ctaLabel}
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ---- Promo blocks: in-flow (inline) variants. Overlay-mode rendering lives in
// PageOverlays (client). ----

function NudgeInline({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const text = readString(block.text)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = safeUrlStr(block.ctaUrl)
  const image = readString(block.imageUrl)
  const tone = readString(block.tone) || 'light'
  if (!heading && !text) return null
  const toneClass =
    tone === 'dark'
      ? 'bg-slate-950 text-white'
      : tone === 'brand'
        ? 'bg-brand-primary text-brand-dark'
        : 'bg-white text-slate-900 ring-1 ring-slate-200'
  return (
    <section className="bg-white py-6">
      <div className="mx-auto max-w-3xl px-6">
        <div className={`flex items-start gap-3 rounded-2xl p-4 ${toneClass}`}>
          {image ? <Image src={image} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full object-cover" /> : null}
          <div className="min-w-0 flex-1">
            {heading ? <p className="text-sm font-semibold">{heading}</p> : null}
            {text ? <p className="mt-0.5 text-sm opacity-80">{text}</p> : null}
          </div>
          {ctaLabel && ctaUrl ? (
            <a href={ctaUrl} className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function OfferBannerInline({ block }: { block: Block }) {
  const text = readString(block.text)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = safeUrlStr(block.ctaUrl)
  const tone = readString(block.tone) || 'brand'
  if (!text) return null
  const toneClass =
    tone === 'dark'
      ? 'bg-slate-950 text-white'
      : tone === 'light'
        ? 'bg-white text-slate-900 ring-1 ring-slate-200'
        : 'bg-brand-primary text-brand-dark'
  return (
    <section className="py-4">
      <div className="mx-auto max-w-5xl px-6">
        <div className={`flex flex-wrap items-center justify-center gap-3 rounded-xl px-5 py-3 text-center ${toneClass}`}>
          <p className="text-sm font-semibold">{text}</p>
          {ctaLabel && ctaUrl ? (
            <a href={ctaUrl} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800">
              {ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function PopupInline({ block }: { block: Block }) {
  const heading = readString(block.heading)
  const body = readString(block.body)
  const image = readString(block.imageUrl)
  const ctaLabel = readString(block.ctaLabel)
  const ctaUrl = safeUrlStr(block.ctaUrl)
  const secondaryLabel = readString(block.secondaryCtaLabel)
  const secondaryUrl = safeUrlStr(block.secondaryCtaUrl)
  if (!heading && !body) return null
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          {image ? <Image src={image} alt="" width={800} height={320} className="h-44 w-full object-cover" /> : null}
          <div className="px-6 py-6 text-center">
            {heading ? <h2 className="text-xl font-semibold tracking-tight text-slate-900">{heading}</h2> : null}
            {body ? <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">{body}</p> : null}
            {(ctaLabel && ctaUrl) || (secondaryLabel && secondaryUrl) ? (
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {ctaLabel && ctaUrl ? (
                  <a href={ctaUrl} className="inline-flex rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-semibold text-brand-dark hover:brightness-110">
                    {ctaLabel}
                  </a>
                ) : null}
                {secondaryLabel && secondaryUrl ? (
                  <a href={secondaryUrl} className="inline-flex rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

const OVERLAY_DISPLAY_MODE = 'overlay'

/** A promo block configured to float over the page rather than sit in-flow. */
function isOverlayBlock(block: Block): boolean {
  return OVERLAY_BLOCK_TYPES.has(block.type) && readString(block.display_mode) === OVERLAY_DISPLAY_MODE
}

/**
 * Render one block as in-flow content. Shared by the page-builder (`page_blocks`)
 * and the Notion-style body interleave so the two surfaces never drift. Promo
 * blocks always render their inline variant here; overlay-mode rendering is
 * handled separately by <PageOverlays>.
 */
export function renderInlineBlock(block: Block, key: string): ReactNode {
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
    case 'callout':
      return <CalloutBlock key={key} block={block} />
    case 'media_text':
      return <MediaTextBlock key={key} block={block} />
    case 'feature_grid':
      return <FeatureGridBlock key={key} block={block} />
    case 'steps':
      return <StepsBlock key={key} block={block} />
    case 'pricing':
      return <PricingBlock key={key} block={block} />
    case 'nudge':
      return <NudgeInline key={key} block={block} />
    case 'offer_banner':
      return <OfferBannerInline key={key} block={block} />
    case 'popup':
      return <PopupInline key={key} block={block} />
    default:
      return null
  }
}

export function PageBlocksRenderer({ blocks }: { blocks: unknown }) {
  const list = readArray(blocks) as Block[]
  if (list.length === 0) return null
  const inline = list.filter((block) => !isOverlayBlock(block))
  const overlays = list.filter(isOverlayBlock)
  return (
    <>
      {inline.map((block, index) =>
        renderInlineBlock(block, `${block.type}-${typeof block.id === 'string' ? block.id : index}`)
      )}
      {overlays.length > 0 ? <PageOverlays blocks={overlays} /> : null}
    </>
  )
}
