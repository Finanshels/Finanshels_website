'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { LeadForm, type LeadDetails } from './LeadForm'

interface ChatPanelProps {
  onClose: () => void
  pageUrl?: string
}

interface CapturedLead {
  lead: LeadDetails
  sessionId: string
}

const WHATSAPP_NUMBER = '971521549572'
const CONTACT_PATH = '/contact'

function whatsappHref(service: string): string {
  const message = `Hi Finanshels team, I'd like to talk to someone about ${service}.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

const CHIP_CLASS =
  'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-orange-400 hover:text-orange-600'

export function ChatPanel({ onClose, pageUrl }: ChatPanelProps) {
  const [captured, setCaptured] = useState<CapturedLead | null>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({
          pageUrl:
            pageUrl ?? (typeof window !== 'undefined' ? window.location.href : undefined),
          lead: captured?.lead,
          sessionId: captured?.sessionId,
        }),
      }),
    [pageUrl, captured]
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
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

  function handleLeadSubmitted(lead: LeadDetails, sessionId: string) {
    setCaptured({ lead, sessionId })
    sendMessage({ text: lead.message })
  }

  return (
    <div className="flex h-full w-full min-w-0 flex-col overflow-hidden bg-white">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-semibold text-white">
            F
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Finny — Finanshels</p>
            <p className="text-xs text-slate-500">
              {captured ? `Chatting with ${captured.lead.firstName}` : 'Typically replies instantly'}
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label="Close chat"
          onClick={onClose}
          className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {!captured ? (
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <LeadForm pageUrl={pageUrl} onSubmitted={handleLeadSubmitted} />
        </div>
      ) : (
        <>
          <div
            ref={scrollerRef}
            className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-slate-50/60"
          >
            <div className="mx-auto w-full max-w-3xl space-y-3 px-4 py-5 sm:px-6 sm:py-7">
              {messages.length === 0 && (
                <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-100">
                  Connecting you with Finny…
                </div>
              )}

              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
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

              {!isStreaming && messages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => submit(`Pricing plans — ${captured.lead.service}`)}
                    className={CHIP_CLASS}
                  >
                    Pricing plans
                  </button>
                  <button
                    type="button"
                    onClick={() => submit(`Know more — ${captured.lead.service}`)}
                    className={CHIP_CLASS}
                  >
                    Know more
                  </button>
                  <a
                    href={CONTACT_PATH}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CHIP_CLASS}
                  >
                    Get a quote
                  </a>
                  <a
                    href={whatsappHref(captured.lead.service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={CHIP_CLASS}
                  >
                    Talk to Human
                  </a>
                </div>
              )}
            </div>
          </div>

          <form
            className="border-t border-slate-200 bg-white px-3 py-3 sm:px-6 sm:py-4"
            onSubmit={(event) => {
              event.preventDefault()
              submit(input)
            }}
          >
            <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
              <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    submit(input)
                  }
                }}
                placeholder="Ask about accounting, VAT, tax, CFO, payroll…"
                className="max-h-40 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
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
            <p className="mx-auto mt-2 max-w-3xl px-1 text-[10px] leading-relaxed text-slate-400">
              By chatting you agree to our{' '}
              <a href="/privacy-policy" className="underline hover:text-slate-600">
                Privacy Policy
              </a>
              . We may follow up via email or WhatsApp.
            </p>
          </form>
        </>
      )}
    </div>
  )
}
