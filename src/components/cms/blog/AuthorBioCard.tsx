import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AuthorAvatar } from './AuthorAvatar'
import { AuthorSocialLinks } from '@/components/cms/authors/AuthorSocialLinks'
import type { AuthorProfile } from '@/lib/cms/authorsRepository'

/**
 * FIX-068: end-of-article "about the author" card. Pulls photo, bio, and
 * socials from the central author record and links to the full `/author/[slug]`
 * profile. For legacy posts with no resolved profile, falls back to the compact
 * "Written by {name}" badge that shipped before.
 */
export function AuthorBioCard({ name, profile }: { name: string; profile: AuthorProfile | null }) {
  if (!profile) {
    return (
      <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <AuthorAvatar name={name} size="md" />
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Written by</p>
          <p className="text-sm font-semibold text-slate-800">{name}</p>
        </div>
      </div>
    )
  }

  const bio = profile.shortBio || profile.fullBio

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Written by</p>
      <div className="mt-3 flex items-start gap-4">
        <AuthorAvatar name={name} photo={profile.photo} size="lg" />
        <div className="min-w-0">
          <Link href={`/author/${profile.slug}`} className="text-base font-semibold text-slate-900 transition-colors hover:text-[#f16610]">
            {name}
          </Link>
          {profile.jobTitle ? <p className="text-sm text-slate-500">{profile.jobTitle}</p> : null}
          {bio ? <p className="mt-2 text-sm leading-relaxed text-slate-600">{bio}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <AuthorSocialLinks socials={profile.socials} name={name} size={16} />
            <Link
              href={`/author/${profile.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#b3470a] transition-colors hover:text-[#f16610]"
            >
              View profile
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
