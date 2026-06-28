import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Headphones, Play } from 'lucide-react'
import { PodcastBrowser } from '@/components/cms/PodcastBrowser'
import { DevCmsBanner } from '@/components/cms/DevCmsBanner'
import { isCmsConfigured } from '@/lib/cms/config'
import { listPublishedPodcasts, type PodcastCardData } from '@/lib/cms/collectionRepository'
import { CollectionHubHeader } from '@/components/cms/CollectionHubHeader'

export const revalidate = 300

export const metadata = {
  title: 'Podcast',
  description:
    'The Finanshels podcast — candid conversations on startup finance, tax, and building across MENA. Listen to every episode.',
  alternates: { canonical: '/podcasts' },
  openGraph: {
    title: 'The Finanshels Podcast',
    description:
      'Candid conversations on startup finance, tax, and building across MENA.',
    url: '/podcasts',
    type: 'website',
  },
}

/** Large feature for the latest episode. */
function LeadEpisode({ episode }: { episode: PodcastCardData }) {
  const meta = [
    episode.episodeNumber ? `Episode ${episode.episodeNumber}` : null,
    episode.podcastName,
    episode.duration,
  ]
    .filter(Boolean)
    .join('  ·  ')

  return (
    <Link
      href={`/content/podcasts/${episode.slug}`}
      className="group mb-12 block overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:border-[#f16610]/40 hover:shadow-xl hover:shadow-slate-900/5"
    >
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[360px]">
          {episode.heroImage ? (
            <Image
              src={episode.heroImage}
              alt={episode.title}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
              <Headphones className="h-12 w-12 text-white/60" aria-hidden />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Latest episode</span>
            {meta ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">{meta}</span>
            ) : null}
          </div>

          <h2 className="mt-4 text-balance text-3xl font-bold leading-[1.1] tracking-tight text-slate-900 group-hover:text-[#f16610] sm:text-4xl">
            {episode.title}
          </h2>

          {episode.summary ? (
            <p className="mt-4 line-clamp-3 text-base leading-relaxed text-slate-600">{episode.summary}</p>
          ) : null}

          <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f16610] px-5 py-2.5 text-sm font-semibold text-white transition group-hover:bg-[#d8550a] w-fit">
            <Play className="h-4 w-4 fill-white" aria-hidden />
            Listen now
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default async function PodcastsPage() {
  const episodes = await listPublishedPodcasts(200).catch((err) => {
    console.warn('[podcasts] listing failed:', err instanceof Error ? err.message : err)
    return [] as PodcastCardData[]
  })
  const cmsReady = isCmsConfigured()

  const lead = episodes[0]

  return (
    <div className="bg-[#faf8f4]">
      <DevCmsBanner />

      <CollectionHubHeader
        eyebrow="Podcast · MENA finance"
        title="The Finanshels Podcast"
        subtitle="Candid conversations on startup finance, tax, and building across the Gulf—with the founders and operators living it."
        cta={{ href: '/blog', label: 'Read the blog' }}
      />

      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-12">
        {!cmsReady ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center">
            <p className="text-lg font-medium text-slate-800">Episodes load from Firestore on GCP.</p>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Set the Firebase Admin service-account variables on Vercel. Until then this page stays empty by design.
            </p>
          </div>
        ) : episodes.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-600">
            No published episodes yet. Publish documents in the{' '}
            <code className="font-mono text-sm">podcasts</code> collection with{' '}
            <code className="font-mono text-sm">status: &quot;published&quot;</code>.
          </p>
        ) : (
          <>
            {lead ? <LeadEpisode episode={lead} /> : null}
            {episodes.length > 1 ? (
              <section className="mt-4">
                <div className="mb-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#b3470a]">Archive</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">All episodes</h2>
                </div>
                <PodcastBrowser episodes={episodes} />
              </section>
            ) : null}
          </>
        )}
      </div>

      <section className="border-t border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:px-8 lg:px-12">
          <h2 className="text-balance text-4xl font-bold tracking-tight">Got a story worth telling?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            We feature founders and finance leaders building across MENA. Pitch yourself or a guest.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="mailto:contact@finanshels.com"
              className="inline-flex items-center gap-2 rounded-full bg-[#f16610] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d8550a]"
            >
              Come on the show
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
