/**
 * FIX-074: art-directed responsive image. When an editor supplies a separate
 * mobile crop, phones get that crop and larger screens get the desktop image —
 * the June-29 ask for "separate desktop/mobile images or a mobile crop". Uses a
 * native <picture> with a `media` source so only ONE image is ever downloaded
 * (the two-<Image> show/hide trick fetches both). Falls back to a plain image
 * when there is no mobile variant.
 */
export type ResponsiveImageProps = {
  desktopSrc: string
  mobileSrc?: string | null
  alt: string
  className?: string
  width?: number
  height?: number
  /** Above-the-fold images should load eagerly to avoid a late hero paint. */
  priority?: boolean
  /** Max viewport width (px) that receives the mobile crop. */
  mobileMaxWidth?: number
}

export function ResponsiveImage({
  desktopSrc,
  mobileSrc,
  alt,
  className,
  width,
  height,
  priority = false,
  mobileMaxWidth = 640,
}: ResponsiveImageProps) {
  const primary = desktopSrc || mobileSrc || ''
  if (!primary) return null

  return (
    <picture>
      {mobileSrc ? <source media={`(max-width: ${mobileMaxWidth - 1}px)`} srcSet={mobileSrc} /> : null}
      {/* eslint-disable-next-line @next/next/no-img-element -- <picture> art direction needs a raw <img> */}
      <img
        src={primary}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
