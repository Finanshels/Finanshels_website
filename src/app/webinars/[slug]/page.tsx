import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, CalendarDays, ExternalLink, MonitorPlay, Tag } from 'lucide-react'
import { PageBlocksRenderer } from '@/components/cms/PageBlocksRenderer'
import { CoHostList } from '@/components/cms/webinars/CoHostList'
import { CountdownTimer } from '@/components/cms/webinars/CountdownTimer'
import { DownloadsSection } from '@/components/cms/webinars/DownloadsSection'
import { GatedReplay } from '@/components/cms/webinars/GatedReplay'
import { ReplayEmbed } from '@/components/cms/webinars/ReplayEmbed'
import { SpeakerList } from '@/components/cms/webinars/SpeakerList'
import { WebinarAgenda } from '@/components/cms/webinars/WebinarAgenda'
import { WebinarCard } from '@/components/cms/webinars/WebinarCard'
import { WebinarRegisterForm } from '@/components/cms/webinars/WebinarRegisterForm'
import { WebinarStatusBadge } from '@/components/cms/webinars/WebinarStatusBadge'
import { getSiteUrl } from '@/lib/cms/config'
import { sanitizeCmsHtml } from '@/lib/cms/sanitize'
import { formatWebinarDate, platformLabel } from '@/lib/cms/webinarFormat'
import { getPublishedWebinarBySlug, type WebinarDetail } from '@/lib/cms/webinarsRepository'
import { safeJsonLd } from '@/lib/seo/safeJsonLd'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const webinar = await getPublishedWebinarBySlug(slug)
  if (!webinar) return { title: 'Webinar not found' }

  const title = webinar.seo.seoTitle || webinar.title
  const description = webinar.seo.metaDescription || webinar.summary || undefined
  const ogImage = webinar.seo.ogImage || webinar.bannerImage || undefined
  const canonical = webinar.seo.canonicalUrl || `/webinars/${webinar.slug}`

  return {
    title,
    description,
    keywords: webinar.seo.focusKeyword || undefined,
    alternates: { canonical },
    robots: webinar.seo.robotsMeta || undefined,
    openGraph: {
      title: webinar.seo.ogTitle || title,
      description: webinar.seo.ogDescription || description,
      url: `/webinars/${webinar.slug}`,
      type: webinar.status === 'completed' ? 'video.other' : 'website',
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

function buildJsonLd(webinar: WebinarDetail): Record<string, unknown> {
  const site = getSiteUrl()
  const url = `${site}/webinars/${webinar.slug}`
  const organizer = { '@type': 'Organization', name: 'Finanshels', url: site }

  if (webinar.status === 'completed' && webinar.recordingUrl) {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: webinar.title,
      description: webinar.seo.metaDescription || webinar.summary || undefined,
      thumbnailUrl: webinar.bannerImage || webinar.seo.ogImage || undefined,
      uploadDate: webinar.startDatetime || undefined,
      contentUrl: webinar.recordingUrl,
      embedUrl: webinar.recordingUrl,
      publisher: organizer,
      url,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: webinar.title,
    description: webinar.seo.metaDescription || webinar.summary || undefined,
    image: webinar.bannerImage || webinar.seo.ogImage || undefined,
    startDate: webinar.startDatetime || undefined,
    endDate: webinar.endDatetime || undefined,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'VirtualLocation', url },
    organizer,
    url,
  }
}

/** Compact meta row used in both the upcoming aside and the on-demand header. */
function MetaRow({ webinar }: { webinar: WebinarDetail }) {
  const dateLabel = formatWebinarDate(webinar.startDatetime, webinar.timezone)
  return (
    <dl className="space-y-3 text-sm">
      {dateLabel ? (
        <div className="flex items-start gap-2.5 text-slate-700">
          <CalendarDays className="mt-0.5 size-4 shrink-0 text-slate-400" />
          <span>{dateLabel}</span>
        </div>
      ) : null}
      <div className="flex items-start gap-2.5 text-slate-700">
        <MonitorPlay className="mt-0.5 size-4 shrink-0 text-slate-400" />
        <span>{platformLabel(webinar.platform)}</span>
      </div>
      {/* FIX-068: one or many co-hosts/partners (was a single partner line). */}
      <CoHostList coHosts={webinar.coHosts} />
    </dl>
  )
}

function KeyTopics({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
        >
          <Tag className="size-3.5 text-slate-400" />
          {t}
        </span>
      ))}
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold tracking-tight text-slate-900">{children}</h2>
}

/** The registration call — native form by default, external CTA for collabs. */
function RegisterPanel({ webinar }: { webinar: WebinarDetail }) {
  if (webinar.registrationMode === 'external' && webinar.registrationUrl) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xl sm:p-7">
        <h3 className="text-lg font-semibold text-slate-900">Register for this webinar</h3>
        <p className="mt-1.5 text-sm text-slate-600">Registration is handled by our co-host.</p>
        <a
          href={webinar.registrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          Register now
          <ExternalLink className="size-4" />
        </a>
      </div>
    )
  }
  return <WebinarRegisterForm webinarSlug={webinar.slug} webinarTitle={webinar.title} />
}

function Related({ webinar }: { webinar: WebinarDetail }) {
  if (webinar.relatedPosts.length === 0 && webinar.relatedWebinars.length === 0) return null
  return (
    <div className="space-y-10">
      {webinar.relatedWebinars.length > 0 ? (
        <section>
          <SectionHeading>More webinars</SectionHeading>
          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {webinar.relatedWebinars.map((w) => (
              <WebinarCard key={w.slug} webinar={w} />
            ))}
          </div>
        </section>
      ) : null}

      {webinar.relatedPosts.length > 0 ? (
        <section>
          <SectionHeading>Related reading</SectionHeading>
          <ul className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {webinar.relatedPosts.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group flex items-center justify-between gap-4 p-4 transition hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 group-hover:text-blue-700">{p.title}</p>
                    {p.excerpt ? <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{p.excerpt}</p> : null}
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

export default async function WebinarDetailPage({ params }: Props) {
  const { slug } = await params
  const webinar = await getPublishedWebinarBySlug(slug)
  if (!webinar) notFound()

  const isOnDemand = webinar.status === 'completed'
  const descriptionHtml = sanitizeCmsHtml(webinar.description)
  // FIX-068: written recap, shown on the replay page only.
  const recapHtml = isOnDemand && webinar.postEventSummary ? sanitizeCmsHtml(webinar.postEventSummary) : ''
  const jsonLd = buildJsonLd(webinar)

  return (
    <main className="bg-gradient-to-b from-white to-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
        <Link
          href="/webinars"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          All webinars
        </Link>

        <div className="mt-6 flex flex-col gap-3">
          <WebinarStatusBadge status={webinar.status} hasRecording={webinar.hasRecording} className="self-start" />
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{webinar.title}</h1>
          {webinar.summary ? <p className="max-w-3xl text-lg text-slate-600">{webinar.summary}</p> : null}
        </div>

        {/* On-demand: lead with the replay — gated behind registration when
            replay_gated is set (FIX-068), otherwise open. */}
        {isOnDemand && webinar.recordingUrl ? (
          <div className="mt-8">
            {webinar.replayGated ? (
              <GatedReplay
                url={webinar.recordingUrl}
                title={webinar.title}
                webinarSlug={webinar.slug}
                teaserUrl={webinar.teaserVideoUrl}
              />
            ) : (
              <ReplayEmbed url={webinar.recordingUrl} title={webinar.title} />
            )}
          </div>
        ) : null}

        {isOnDemand && !webinar.recordingUrl ? (
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
            This webinar has ended. The recording is being prepared — check back shortly, or{' '}
            <Link href="/webinars" className="font-semibold underline">
              browse other sessions
            </Link>
            .
          </div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          {/* Main column */}
          <div className="space-y-12">
            {/* Upcoming hero visual + countdown. FIX-068: a teaser clip takes
                precedence over the static banner when supplied. */}
            {!isOnDemand ? (
              <div className="space-y-6">
                {webinar.teaserVideoUrl ? (
                  <ReplayEmbed url={webinar.teaserVideoUrl} title={`${webinar.title} — preview`} />
                ) : webinar.bannerImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <Image
                      src={webinar.bannerImage}
                      alt={webinar.title}
                      fill
                      sizes="(min-width: 1024px) 640px, 100vw"
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : null}
                {webinar.startDatetime ? (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      {webinar.status === 'live' ? 'Live now' : 'Starts in'}
                    </span>
                    <CountdownTimer targetIso={webinar.startDatetime} />
                  </div>
                ) : null}
              </div>
            ) : null}

            {descriptionHtml ? (
              <section>
                <SectionHeading>{isOnDemand ? 'About this session' : "What you'll learn"}</SectionHeading>
                <div
                  className="prose prose-slate mt-4 max-w-none prose-headings:font-semibold prose-a:text-blue-700"
                  dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
              </section>
            ) : null}

            {recapHtml ? (
              <section>
                <SectionHeading>Session recap</SectionHeading>
                <div
                  className="prose prose-slate mt-4 max-w-none prose-headings:font-semibold prose-a:text-blue-700"
                  dangerouslySetInnerHTML={{ __html: recapHtml }}
                />
              </section>
            ) : null}

            {webinar.agenda.length > 0 ? (
              <section>
                <SectionHeading>{isOnDemand ? 'What was covered' : "What we'll cover"}</SectionHeading>
                <div className="mt-5">
                  <WebinarAgenda items={webinar.agenda} />
                </div>
              </section>
            ) : null}

            {webinar.keyTopics.length > 0 ? (
              <section>
                <SectionHeading>Key topics</SectionHeading>
                <div className="mt-4">
                  <KeyTopics topics={webinar.keyTopics} />
                </div>
              </section>
            ) : null}

            {isOnDemand && webinar.downloads.length > 0 ? (
              <section>
                <SectionHeading>Resources from this session</SectionHeading>
                <p className="mt-1 text-sm text-slate-500">Slides and templates shared during the webinar.</p>
                <div className="mt-5">
                  <DownloadsSection resources={webinar.downloads} />
                </div>
              </section>
            ) : null}

            {webinar.speakers.length > 0 ? (
              <section>
                <SectionHeading>{webinar.speakers.length > 1 ? 'Speakers' : 'Speaker'}</SectionHeading>
                <div className="mt-5">
                  <SpeakerList speakers={webinar.speakers} />
                </div>
              </section>
            ) : null}

            <Related webinar={webinar} />
          </div>

          {/* Aside */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            {!isOnDemand ? (
              <div className="space-y-5">
                <RegisterPanel webinar={webinar} />
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <MetaRow webinar={webinar} />
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-base font-semibold text-slate-900">Session details</h3>
                  <div className="mt-4">
                    <MetaRow webinar={webinar} />
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-blue-50 p-6 text-center">
                  <p className="text-sm text-slate-700">Want to attend the next one live?</p>
                  <Link
                    href="/webinars"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    See upcoming webinars
                    <ArrowRight className="size-4" />
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>

        {webinar.pageBlocks.length > 0 ? (
          <div className="mt-14">
            <PageBlocksRenderer blocks={webinar.pageBlocks} />
          </div>
        ) : null}
      </div>
    </main>
  )
}
