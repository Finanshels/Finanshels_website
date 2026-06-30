// Slash-menu detection for the body editor — a small ProseMirror plugin instead
// of pulling in @tiptap/suggestion. It only DETECTS a `/query` trigger and
// reports it to React via `onStateChange`; React owns the menu UI, filtering,
// keyboard handling, and block insertion. This keeps the editor↔menu contract
// simple and the dependency graph unchanged.

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import type { EditorView } from '@tiptap/pm/view'

export type SlashMenuRect = { left: number; top: number; bottom: number }

export type SlashMenuState = {
  query: string
  range: { from: number; to: number }
  rect: SlashMenuRect | null
}

export type SlashMenuOptions = {
  onStateChange: (state: SlashMenuState | null) => void
}

export const slashMenuPluginKey = new PluginKey('cmsSlashMenu')

/** A `/` at line start or after whitespace, followed by the (space-free) query. */
const TRIGGER_RE = /(^|\s)(\/[^\s]*)$/

function detect(view: EditorView): SlashMenuState | null {
  const { selection } = view.state
  if (!selection.empty) return null

  const { $from } = selection
  if (!$from.parent.isTextblock) return null

  const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼')
  const match = TRIGGER_RE.exec(textBefore)
  if (!match) return null

  const trigger = match[2] // includes the leading '/'
  const cursorPos = $from.pos
  const from = cursorPos - trigger.length
  const to = cursorPos

  let rect: SlashMenuRect | null = null
  try {
    const coords = view.coordsAtPos(from)
    rect = { left: coords.left, top: coords.top, bottom: coords.bottom }
  } catch {
    rect = null
  }

  return { query: trigger.slice(1), range: { from, to }, rect }
}

export const SlashMenu = Extension.create<SlashMenuOptions>({
  name: 'cmsSlashMenu',

  addOptions() {
    return { onStateChange: () => {} }
  },

  addProseMirrorPlugins() {
    const { onStateChange } = this.options
    return [
      new Plugin({
        key: slashMenuPluginKey,
        view() {
          return {
            update: (view) => {
              if (!view.hasFocus()) {
                onStateChange(null)
                return
              }
              onStateChange(detect(view))
            },
            destroy: () => onStateChange(null),
          }
        },
      }),
    ]
  },
})
