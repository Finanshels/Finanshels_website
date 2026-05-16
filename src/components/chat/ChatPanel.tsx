'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { ChatMessage } from './ChatMessage'

const WELCOME_TEXT =
  "Hi! I'm Finny — I can answer questions about Finanshels' accounting, VAT, corporate tax, payroll, and CFO services using our actual content. What's on your mind?"

const SUGGESTED_PROMPTS = [
  'Pricing for bookkeeping',
  'Corporate tax deadlines in UAE',
  'How does a fractional CFO engagement work?',
  'Talk to a human',
]

interface ChatPanelProps {
  onClose: () => void
  pageUrl?: string
}

export function ChatPanel({ onClose, pageUrl }: ChatPanelProps) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({
          pageUrl:
            pageUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined),
        }),
      }),
    [pageUrl]
  )

  const { messages, sendMessage, status, error } = useChat({ transport })

  const [input, setInput] = useState('')
  const isStreaming = status === 'streaming' || status === 'submitted'
  const scrollerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = scrollerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isStreaming])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-semibold text-white">
            F
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Finny — Finanshels</p>
            <p className="text-xs text-slate-500">Typically replies instantly</p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3 text-sm text-slate-900 shadow-sm">
              {WELCOME_TEXT}
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submit(prompt)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:text-orange-600"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Finny is thinking…
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            Something went wrong reaching the assistant. Please try again in a moment.
          </div>
        )}
      </div>

      <form
        className="border-t border-slate-200 px-3 py-3 sm:px-4"
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit(input)
              }
            }}
            placeholder="Ask about accounting, VAT, tax, CFO, payroll…"
            className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || isStreaming}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 px-1 text-[10px] leading-relaxed text-slate-400">
          By chatting you agree to our{' '}
          <a href="/privacy-policy" className="underline hover:text-slate-600">
            Privacy Policy
          </a>
          . We may follow up via email or WhatsApp.
        </p>
      </form>
    </div>
  )
}
