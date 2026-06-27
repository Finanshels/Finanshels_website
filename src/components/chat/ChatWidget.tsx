'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { MessageCircle } from 'lucide-react'

const ChatPanel = dynamic(() => import('./ChatPanel').then((m) => ({ default: m.ChatPanel })), {
  loading: () => null,
  ssr: false,
})

const HIDDEN_PREFIXES = ['/admin']

export function ChatWidget() {
  const pathname = usePathname() ?? '/'
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!mounted) return null
  if (HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null

  return (
    <>
      {!open && (
        <button
          type="button"
          aria-label="Talk to Finny"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2.5 rounded-full bg-orange-600 pl-4 pr-5 py-3 text-sm font-semibold text-white shadow-xl shadow-orange-600/30 transition hover:scale-[1.03] hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 sm:bottom-6 sm:right-6"
        >
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
            <MessageCircle className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-300 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-300" />
            </span>
          </span>
          <span className="whitespace-nowrap">Talk to Finny</span>
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[70] flex bg-white"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            animation: 'finanshels-chat-rise 220ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Chat with Finny"
        >
          <ChatPanel onClose={() => setOpen(false)} />
        </div>
      )}

      <style jsx global>{`
        @keyframes finanshels-chat-rise {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
