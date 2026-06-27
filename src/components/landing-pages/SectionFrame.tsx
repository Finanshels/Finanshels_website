'use client'

/**
 * Edit-mode wrapper used ONLY inside the Studio live preview. It makes each
 * rendered section selectable/hoverable and reports clicks back to the editor.
 *
 * In production (editMode off) this component is never rendered — the renderer
 * outputs sections directly — so the public page is byte-identical.
 */
export function SectionFrame({
  sectionId,
  selected,
  onSelect,
  onHover,
  children,
}: {
  sectionId: string
  selected: boolean
  onSelect?: (id: string) => void
  onHover?: (id: string | null) => void
  children: React.ReactNode
}) {
  return (
    <div
      data-lp-section-id={sectionId}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(sectionId)
      }}
      onMouseEnter={() => onHover?.(sectionId)}
      onMouseLeave={() => onHover?.(null)}
      className={`relative cursor-pointer transition-[outline] ${
        selected
          ? 'outline outline-2 -outline-offset-2 outline-violet-500'
          : 'hover:outline hover:outline-2 hover:-outline-offset-2 hover:outline-violet-300'
      }`}
    >
      {selected ? (
        <span className="pointer-events-none absolute left-0 top-0 z-10 rounded-br-md bg-violet-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Selected
        </span>
      ) : null}
      {children}
    </div>
  )
}
