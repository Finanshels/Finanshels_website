import Link from 'next/link'
import { AuthorAvatar } from './AuthorAvatar'
import { AuthorSocialLinks } from '@/components/cms/authors/AuthorSocialLinks'
import type { AuthorProfile } from '@/lib/cms/authorsRepository'

/**
 * FIX-068: top-of-article byline. Shows the author photo + "Written by {name}"
 * together (stakeholder ask), with the job title and social icons pulled from
 * the central author record. The name links to `/author/[slug]` when a profile
 * resolved; falls back to a plain name + initials badge for legacy posts whose
 * `author` is a bare display-name string.
 */
export function AuthorByline({ name, profile }: { name: string; profile: AuthorProfile | null }) {
  return (
    <span className="flex items-center gap-3">
      <AuthorAvatar name={name} photo={profile?.photo ?? null} size="md" />
      <span className="flex flex-col gap-0.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-sm text-slate-500">
            Written by{' '}
            {profile ? (
              <Link href={`/author/${profile.slug}`} className="font-semibold text-slate-800 transition-colors hover:text-[#f16610]">
                {name}
              </Link>
            ) : (
              <span className="font-semibold text-slate-800">{name}</span>
            )}
          </span>
          {profile ? <AuthorSocialLinks socials={profile.socials} name={name} size={15} /> : null}
        </span>
        {profile?.jobTitle ? <span className="text-xs text-slate-500">{profile.jobTitle}</span> : null}
      </span>
    </span>
  )
}
