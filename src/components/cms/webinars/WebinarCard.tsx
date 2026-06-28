import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, PlayCircle } from 'lucide-react'
import type { WebinarCardData } from '@/lib/cms/webinarsRepository'
import { formatWebinarDate } from '@/lib/cms/webinarFormat'
import { WebinarStatusBadge } from './WebinarStatusBadge'

/**
 * Hub card. For upcoming/live it leads with the date; for on-demand it leads
 * with a "Watch replay" affordance. The whole card links to /webinars/[slug].
 */
export function WebinarCard({ webinar }: { webinar: WebinarCardData }) {
  const isOnDemand = webinar.status === 'completed' && webinar.hasRecording
  const dateLabel = formatWebinarDate(webinar.startDatetime, webinar.timezone)

  return (
    <Link
      href={`/webinars/${webinar.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {webinar.bannerImage ? (
          <Image
            src={webinar.bannerImage}
            alt={webinar.title}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <PlayCircle className="size-10" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <WebinarStatusBadge status={webinar.status} hasRecording={webinar.hasRecording} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          {isOnDemand ? (
            <>
              <PlayCircle className="size-3.5" />
              Watch replay
            </>
          ) : dateLabel ? (
            <>
              <CalendarDays className="size-3.5" />
              {dateLabel}
            </>
          ) : null}
        </div>

        <h3 className="mt-2 line-clamp-2 text-lg font-semibold leading-snug text-slate-900 transition group-hover:text-blue-700">
          {webinar.title}
        </h3>

        {webinar.summary ? (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{webinar.summary}</p>
        ) : null}

        {webinar.hostPartnerName ? (
          <p className="mt-auto pt-3 text-xs text-slate-500">In partnership with {webinar.hostPartnerName}</p>
        ) : null}
      </div>
    </Link>
  )
}
