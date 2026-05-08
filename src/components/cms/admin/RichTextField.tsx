'use client'

import { useMemo, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import {
  Bold,
  Italic,
  Strikethrough,
  Underline as UnderlineIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Eraser,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  TextQuote,
  Code as InlineCode,
  Code2,
  Minus,
  Link2,
  Image as ImageIcon,
  Video,
  Table as TableIcon,
  CornerDownLeft,
  Undo2,
  Redo2,
  ClipboardPaste,
  Eye,
} from 'lucide-react'

type Props = {
  name: string
  initialValue: string
  placeholder?: string
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 pb-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
      {children}
    </p>
  )
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col">{children}</div>
}

function ToolbarRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-0.5 rounded-md border border-[#ebe0d2] bg-white p-0.5">{children}</div>
}

function IconBtn({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[12px] font-medium transition ${
        active
          ? 'bg-brand-primary/15 text-brand-primary shadow-[inset_0_0_0_1px_rgba(241,102,16,0.35)]'
          : 'text-slate-700 hover:bg-[#fff3e8] hover:text-slate-900'
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <span aria-hidden className="mx-0.5 h-4 w-px bg-[#eee2d3]" />
}

export default function RichTextField({ name, initialValue, placeholder }: Props) {
  const [html, setHtml] = useState(initialValue || '')
  const [showSource, setShowSource] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      Underline,
      Subscript,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: placeholder || 'Write content…',
      }),
    ],
    [placeholder]
  )

  const editor = useEditor({
    extensions,
    content: initialValue || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-slate max-w-none min-h-[360px] bg-white px-5 py-5 text-[15px] leading-7 text-slate-800 focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
    },
    immediatelyRender: false,
  })

  const plain = editor?.getText() ?? ''
  const wordCount = plain.trim() ? plain.trim().split(/\s+/).length : 0
  const charCount = plain.length

  const promptUrl = (current?: string, message = 'Enter URL'): string | null => {
    if (typeof window === 'undefined') return null
    const value = window.prompt(message, current ?? 'https://')
    return value ? value.trim() : null
  }

  const setLink = () => {
    if (!editor) return
    const existing = editor.getAttributes('link').href as string | undefined
    const url = promptUrl(existing, 'Link URL')
    if (!url) return
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  const insertImage = () => {
    if (!editor) return
    const url = promptUrl('https://', 'Image URL')
    if (!url) return
    editor.chain().focus().setImage({ src: url, alt: '' }).run()
  }
  const insertVideo = () => {
    if (!editor) return
    const url = promptUrl('https://', 'Video URL (YouTube, Vimeo, …)')
    if (!url) return
    editor
      .chain()
      .focus()
      .insertContent(
        `<p><a href="${url}" target="_blank" rel="noreferrer">${url}</a></p>`
      )
      .run()
  }
  const insertTable = () => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }
  const applySource = (next: string) => {
    if (!editor) return
    editor.commands.setContent(next, { emitUpdate: true })
    setHtml(next)
  }

  return (
    <div className="mt-2">
      <input type="hidden" name={name} value={html} readOnly />

      <div className="overflow-hidden rounded-xl border border-[#e7dccf] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
        {/* Toolbar */}
        <div className="border-b border-[#efe5da] bg-[#fffaf5] px-3 pt-2.5 pb-2">
          <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
            <ToolbarGroup>
              <GroupLabel>Heading</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Heading 1" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>H1</IconBtn>
                <IconBtn label="Heading 2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>H2</IconBtn>
                <IconBtn label="Heading 3" active={editor?.isActive('heading', { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>H3</IconBtn>
                <IconBtn label="Heading 4" active={editor?.isActive('heading', { level: 4 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 4 }).run()}>H4</IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>Format</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Bold (Cmd/Ctrl+B)" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()}>
                  <Bold className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Italic (Cmd/Ctrl+I)" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()}>
                  <Italic className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Underline (Cmd/Ctrl+U)" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
                  <UnderlineIcon className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Strikethrough" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()}>
                  <Strikethrough className="h-3.5 w-3.5" />
                </IconBtn>
                <Sep />
                <IconBtn label="Superscript" active={editor?.isActive('superscript')} onClick={() => editor?.chain().focus().toggleSuperscript().run()}>
                  <SuperscriptIcon className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Subscript" active={editor?.isActive('subscript')} onClick={() => editor?.chain().focus().toggleSubscript().run()}>
                  <SubscriptIcon className="h-3.5 w-3.5" />
                </IconBtn>
                <Sep />
                <IconBtn label="Inline code" active={editor?.isActive('code')} onClick={() => editor?.chain().focus().toggleCode().run()}>
                  <InlineCode className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Clear formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
                  <Eraser className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>Align</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Align left" active={editor?.isActive({ textAlign: 'left' })} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
                  <AlignLeft className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Align center" active={editor?.isActive({ textAlign: 'center' })} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
                  <AlignCenter className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Align right" active={editor?.isActive({ textAlign: 'right' })} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
                  <AlignRight className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>Lists</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Bulleted list" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                  <List className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Numbered list" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                  <ListOrdered className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>Blocks</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Quote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                  <TextQuote className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Code block" active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
                  <Code2 className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="HTML embed (paste in source view)" onClick={() => setShowSource((v) => !v)} active={showSource}>
                  <span className="font-mono text-[11px]">&lt;/&gt;</span>
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>
          </div>

          <div className="mt-2 flex flex-wrap items-start gap-x-4 gap-y-2">
            <ToolbarGroup>
              <GroupLabel>Insert</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Insert / edit link" active={editor?.isActive('link')} onClick={setLink}>
                  <Link2 className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Insert image" onClick={insertImage}>
                  <ImageIcon className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Insert video link" onClick={insertVideo}>
                  <Video className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Insert table" onClick={insertTable}>
                  <TableIcon className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Divider" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
                  <Minus className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Hard break" onClick={() => editor?.chain().focus().setHardBreak().run()}>
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>History</GroupLabel>
              <ToolbarRow>
                <IconBtn label="Undo (Cmd/Ctrl+Z)" onClick={() => editor?.chain().focus().undo().run()}>
                  <Undo2 className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label="Redo (Shift+Cmd/Ctrl+Z)" onClick={() => editor?.chain().focus().redo().run()}>
                  <Redo2 className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>

            <ToolbarGroup>
              <GroupLabel>Source</GroupLabel>
              <ToolbarRow>
                <IconBtn
                  label="Paste from clipboard"
                  onClick={async () => {
                    if (typeof navigator === 'undefined' || !navigator.clipboard) return
                    try {
                      const text = await navigator.clipboard.readText()
                      if (text) editor?.chain().focus().insertContent(text).run()
                    } catch {
                      /* ignore permission denied */
                    }
                  }}
                >
                  <ClipboardPaste className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn label={showSource ? 'Close HTML source' : 'View HTML source'} active={showSource} onClick={() => setShowSource((v) => !v)}>
                  <span className="font-mono text-[11px]">&lt;/&gt;</span>
                </IconBtn>
                <IconBtn label={showPreview ? 'Hide preview' : 'Live preview'} active={showPreview} onClick={() => setShowPreview((v) => !v)}>
                  <Eye className="h-3.5 w-3.5" />
                </IconBtn>
              </ToolbarRow>
            </ToolbarGroup>
          </div>
        </div>

        {/* Editor surface */}
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
          <div className={showPreview ? 'border-r border-[#efe5da]' : ''}>
            {showSource ? (
              <textarea
                value={html}
                onChange={(e) => applySource(e.target.value)}
                spellCheck={false}
                className="block min-h-[360px] w-full bg-white px-5 py-5 font-mono text-xs leading-6 text-slate-800 focus:outline-none"
              />
            ) : (
              <EditorContent editor={editor} />
            )}
          </div>
          {showPreview ? (
            <div className="min-h-[360px] bg-[#fffaf5] px-5 py-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">Live preview</p>
              <article
                className="prose prose-slate max-w-none text-[15px] leading-7"
                dangerouslySetInnerHTML={{ __html: html || '<p class="text-slate-400">Start writing to preview content.</p>' }}
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#efe5da] bg-[#fffcf8] px-3 py-2 text-xs text-slate-500">
          <p className="text-[11px]">Hover any button for its keyboard shortcut.</p>
          <div className="flex items-center gap-3">
            <span><strong className="font-semibold text-slate-700">{wordCount}</strong> words</span>
            <span aria-hidden>·</span>
            <span><strong className="font-semibold text-slate-700">{charCount}</strong> chars</span>
            <span aria-hidden>·</span>
            <span><strong className="font-semibold text-slate-700">~{Math.max(1, Math.round(wordCount / 220))}</strong> min read</span>
          </div>
        </div>
      </div>
    </div>
  )
}
