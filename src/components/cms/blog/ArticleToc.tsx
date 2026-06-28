'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/cms/articleToc'

/**
 * Sticky "Index" rail. Built from the article's h2/h3 headings; highlights the
 * section currently in view (IntersectionObserver) and smooth-scrolls on click.
 * Rendered only when the server decides there are enough headings to be useful.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')

  useEffect(() => {
    if (items.length === 0) return
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      // Activate a heading once it enters the top ~third of the viewport.
      { rootMargin: '-96px 0px -66% 0px', threshold: 0 }
    )
    headings.forEach((heading) => observer.observe(heading))
    return () => observer.disconnect()
  }, [items])

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    setActiveId(id)
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-slate-400">Index</p>
      <ul className="border-l border-slate-200">
        {items.map((item) => {
          const isActive = activeId === item.id
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(event) => handleClick(event, item.id)}
                className={[
                  'group -ml-px flex gap-3 border-l-2 py-1.5 transition-colors',
                  item.level === 3 ? 'pl-7' : 'pl-4',
                  isActive
                    ? 'border-[#f16610] text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900',
                ].join(' ')}
              >
                {item.number ? (
                  <span
                    className={[
                      'pt-0.5 font-mono text-[11px] tabular-nums',
                      isActive ? 'text-[#f16610]' : 'text-slate-400 group-hover:text-slate-500',
                    ].join(' ')}
                  >
                    {String(item.number).padStart(2, '0')}
                  </span>
                ) : null}
                <span className={['leading-snug', isActive ? 'font-semibold' : 'font-medium'].join(' ')}>
                  {item.text}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
