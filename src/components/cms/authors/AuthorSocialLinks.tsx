import type { ComponentType } from 'react'
import { Globe } from 'lucide-react'
import { Instagram, Linkedin, Twitter } from '@/components/icons/BrandIcons'
import type { AuthorSocials } from '@/lib/cms/authorsRepository'

type IconComponent = ComponentType<{ size?: number | string; className?: string }>

/**
 * FIX-068: author social icon row. Server-safe (plain links). Reused by the
 * blog byline, the blog footer "about the author" card, and `/author/[slug]`.
 */
export function AuthorSocialLinks({
  socials,
  name,
  size = 16,
  className = '',
}: {
  socials: AuthorSocials
  name: string
  size?: number
  className?: string
}) {
  const links: { href: string; label: string; Icon: IconComponent }[] = []
  if (socials.linkedin) links.push({ href: socials.linkedin, label: `${name} on LinkedIn`, Icon: Linkedin })
  if (socials.twitter) links.push({ href: socials.twitter, label: `${name} on X / Twitter`, Icon: Twitter })
  if (socials.instagram) links.push({ href: socials.instagram, label: `${name} on Instagram`, Icon: Instagram })
  if (socials.website) links.push({ href: socials.website, label: `${name}'s website`, Icon: Globe })

  if (links.length === 0) return null

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <a
          key={href}
          href={href}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label={label}
          className="text-slate-400 transition-colors hover:text-[#f16610]"
        >
          <Icon size={size} />
        </a>
      ))}
    </div>
  )
}
