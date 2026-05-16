'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { ChatPanel } from './ChatPanel'

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
    if (window.matchMedia('(max-width: 640px)').matches) {
      document.body.style.overflow = 'hidden'
    }
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
          aria-label="Open chat"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white shadow-xl shadow-orange-600/30 transition hover:scale-105 hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 sm:bottom-6 sm:right-6"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-400" />
          </span>
        </button>
      )}

      {open && (
        <>
          {/* Mobile bottom sheet (<=640px) */}
          <div className="fixed inset-0 z-[70] sm:hidden">
            <div
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <div
              className="absolute inset-x-0 bottom-0 overflow-hidden rounded-t-3xl bg-white shadow-2xl"
              style={{
                height: '85dvh',
                paddingBottom: 'env(safe-area-inset-bottom, 0px)',
                animation: 'finanshels-chat-rise 220ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div className="flex justify-center pt-2">
                <span className="h-1.5 w-10 rounded-full bg-slate-200" aria-hidden />
              </div>
              <div className="h-[calc(85dvh-12px)]">
                <ChatPanel onClose={() => setOpen(false)} />
              </div>
            </div>
          </div>

          {/* Desktop floating panel (>=640px) */}
          <div
            className="fixed bottom-5 right-5 z-[70] hidden sm:bottom-6 sm:right-6 sm:flex"
            style={{ animation: 'finanshels-chat-rise 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div
              className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200"
              style={{ width: '400px', height: 'min(640px, calc(100dvh - 48px))' }}
            >
              <ChatPanel onClose={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}

      <style jsx global>{`
        @keyframes finanshels-chat-rise {
          from {
            transform: translateY(24px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
