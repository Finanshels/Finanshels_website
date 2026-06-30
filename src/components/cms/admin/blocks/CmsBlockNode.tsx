'use client'

// Tiptap node for a Notion-style inline CMS block embedded in body content.
//
// Serializes to a self-contained sentinel <div data-cms-block data-cms-props>
// (see blockProps.ts) so it round-trips through the stored HTML string with no
// parallel field. In the editor it renders a placeholder card with an inline
// editor reusing the same <BlockFields> form as the page-builder. On the public
// page, ArticleBodyWithBlocks replaces the sentinel with the real block.

import { useState } from 'react'
import { Node } from '@tiptap/core'
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from '@tiptap/react'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { CMS_BLOCK_TYPE_MAP } from '@/lib/cms/collectionDefinitions'
import { BlockFields, type ReferenceOptionMap } from '@/components/cms/admin/blocks/BlockFields'
import { decodeBlockProps, encodeBlockProps } from '@/lib/cms/blockProps'

export const CMS_BLOCK_NODE_NAME = 'cmsBlock'

export type CmsBlockOptions = {
  referenceOptions: ReferenceOptionMap
}

function nodeSummary(props: Record<string, unknown>): string {
  for (const key of ['heading', 'title', 'text', 'quote', 'eyebrow']) {
    const value = props[key]
    if (typeof value === 'string' && value.trim()) return value.trim().slice(0, 60)
  }
  return ''
}

function CmsBlockNodeView({ node, updateAttributes, deleteNode, extension, selected }: ReactNodeViewProps) {
  const [editing, setEditing] = useState(false)
  const blockType = String(node.attrs.blockType || '')
  const props = (node.attrs.props as Record<string, unknown>) || {}
  const def = CMS_BLOCK_TYPE_MAP[blockType] ?? null
  const referenceOptions = (extension.options as CmsBlockOptions).referenceOptions || {}
  const summary = nodeSummary(props)

  const setProp = (fieldName: string, value: unknown) => {
    updateAttributes({ props: { ...props, [fieldName]: value } })
  }

  return (
    <NodeViewWrapper
      className={`my-3 overflow-hidden rounded-xl border bg-white ${
        selected ? 'border-brand-primary ring-2 ring-brand-primary/20' : 'border-cms-rule'
      }`}
      data-cms-block-view={blockType}
    >
      <div
        className="flex items-center gap-2 border-b border-cms-rule bg-cms-soft px-3 py-2"
        contentEditable={false}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <span className="rounded-md bg-brand-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-primary">
          Block
        </span>
        <span className="text-sm font-semibold text-slate-900">{def?.label ?? blockType}</span>
        {summary ? <span className="hidden truncate text-xs text-slate-500 sm:block">— {summary}</span> : null}
        <div className="ml-auto flex items-center gap-1">
          {def ? (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              title={editing ? 'Done editing' : 'Edit block'}
              className="rounded-md p-1.5 text-slate-500 hover:bg-white hover:text-slate-800"
            >
              {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => deleteNode()}
            title="Remove block"
            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {editing && def ? (
        <div
          className="space-y-3 px-3 py-3"
          contentEditable={false}
          onMouseDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <p className="text-[11px] text-slate-500">{def.description}</p>
          <BlockFields
            fields={def.fields}
            values={props}
            onChange={setProp}
            referenceOptions={referenceOptions}
            idPrefix={`node-${blockType}`}
          />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => def && setEditing(true)}
          contentEditable={false}
          className="block w-full px-3 py-3 text-left text-xs text-slate-500 hover:bg-cms-soft"
        >
          {def ? summary || 'Empty — click to configure this block.' : `Unknown block type "${blockType}".`}
        </button>
      )}
    </NodeViewWrapper>
  )
}

export const CmsBlockNode = Node.create<CmsBlockOptions>({
  name: CMS_BLOCK_NODE_NAME,
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return { referenceOptions: {} }
  },

  addAttributes() {
    return {
      blockType: {
        default: '',
        parseHTML: (el) => el.getAttribute('data-cms-block') || '',
        renderHTML: () => ({}),
      },
      props: {
        default: {} as Record<string, unknown>,
        parseHTML: (el) => decodeBlockProps(el.getAttribute('data-cms-props')),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-cms-block]' }]
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-cms-block': String(node.attrs.blockType || ''),
        'data-cms-props': encodeBlockProps((node.attrs.props as Record<string, unknown>) || {}),
      },
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CmsBlockNodeView)
  },
})
