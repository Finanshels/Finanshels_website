import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { WebinarCard } from '@/components/cms/webinars/WebinarCard'
import { WebinarStatusBadge } from '@/components/cms/webinars/WebinarStatusBadge'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedWebinars, type WebinarCardData } from '@/lib/cms/webinarsRepository'
import { formatWebinarDate } from '@/lib/cms/webinarFormat'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Webinars',
  description:
    'Live and on-demand webinars on UAE corporate tax, VAT, accounting, and scaling finance — from the Finanshels team and partners.',
  alternates: { canonical: '/webinars' },
  openGraph: {
    title: 'Finanshels Webinars',
    description:
      'Live and on-demand webinars on UAE corporate tax, VAT, accounting, and scaling finance.',
    url: '/webinars',
    type: 'website',
  },
}

function startTime(w: WebinarCardData): number {
  const t = w.startDatetime ? new Date(w.startDatetime).getTime() : 0
  return Number.isNaN(t) ? 0 : t
}

/** The most prominent upcoming webinar: featured first, then soonest. */
function FeaturedWebinar({ webinar }: { webinar: WebinarCardData }) {
  const dateLabel = formatWebinarDate(webinar.startDatetime, webinar.timezone)
  return (
    <Link
      href={`/webinars/${webinar.slug}`}
      className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md lg:grid-cols-2"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-blue-100 to-slate-200 lg:aspect-auto">
        {webinar.bannerImage ? (
          <Image
            src={webinar.bannerImage}
            alt={webinar.title}
            fill
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
        <WebinarStatusBadge status={webinar.status} hasRecording={webinar.hasRecording} className="self-start" />
        {dateLabel ? (
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <CalendarDays className="size-4" />
            {dateLabel}
          </div>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{webinar.title}</h2>
        {webinar.summary ? <p className="text-base text-slate-600">{webinar.summary}</p> : null}
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
          {webinar.status === 'completed' ? 'Watch the replay' : 'Save your seat'}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function WebinarsHubPage() {
  const all = isCmsConfigured() ? await listPublishedWebinars() : []

  const upcoming = all
    .filter((w) => w.status === 'upcoming' || w.status === 'live')
    .sort((a, b) => startTime(a) - startTime(b))
  const onDemand = all
    .filter((w) => w.status === 'completed' && w.hasRecording)
    .sort((a, b) => startTime(b) - startTime(a))

  // Lead with a featured upcoming webinar (or the soonest); fall back to the
  // newest on-demand session when nothing is scheduled.
  const featured =
    upcoming.find((w) => w.featured) ?? upcoming[0] ?? onDemand.find((w) => w.featured) ?? onDemand[0] ?? null
  const upcomingRest = upcoming.filter((w) => w.slug !== featured?.slug)
  const onDemandRest = featured && featured.status === 'completed'
    ? onDemand.filter((w) => w.slug !== featured.slug)
    : onDemand

  const hasAny = all.length > 0

  return (
    <main className="bg-gradient-to-b from-white to-slate-50">
      <CollectionHubHeader
        eyebrow="Webinars"
        title="Learn from the people who do this every day."
        subtitle="Live sessions and on-demand replays on UAE corporate tax, VAT, accounting, and the operating playbook for scaling finance teams."
        cta={{ href: '/blog', label: 'Browse the blog' }}
      />
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">

        {!hasAny ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
            No webinars published yet. Check back soon.
          </div>
        ) : (
          <>
            {featured ? (
              <section className="mt-12">
                <FeaturedWebinar webinar={featured} />
              </section>
            ) : null}

            {upcomingRest.length > 0 ? (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upcoming webinars</h2>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingRest.map((w) => (
                    <WebinarCard key={w.slug} webinar={w} />
                  ))}
                </div>
              </section>
            ) : null}

            {onDemandRest.length > 0 ? (
              <section className="mt-16">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">On-demand library</h2>
                <p className="mt-1 text-sm text-slate-500">Watch past sessions any time — no registration required.</p>
                <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {onDemandRest.map((w) => (
                    <WebinarCard key={w.slug} webinar={w} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </main>
  )
}
