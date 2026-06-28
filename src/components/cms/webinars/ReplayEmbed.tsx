import { toEmbedUrl } from '@/lib/cms/webinarFormat'

/**
 * Open (un-gated) on-demand replay. Accepts a YouTube/Vimeo share link or a
 * direct embed URL; `toEmbedUrl` normalizes the common share formats.
 */
export function ReplayEmbed({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url)
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
      <div className="relative aspect-video w-full">
        <iframe
          src={embed}
          title={`${title} — replay`}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  )
}
