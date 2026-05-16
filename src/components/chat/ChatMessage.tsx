'use client'

import type { UIMessage } from 'ai'
import { useMemo } from 'react'

interface ChatMessageProps {
  message: UIMessage
}

interface LinkSegment {
  type: 'link'
  label: string
  url: string
}

interface TextSegment {
  type: 'text'
  text: string
}

type Segment = LinkSegment | TextSegment

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function parseInlineMarkdown(text: string): Segment[] {
  const segments: Segment[] = []
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index) })
    }
    if (isSafeHttpUrl(match[2]!)) {
      segments.push({ type: 'link', label: match[1]!, url: match[2]! })
    } else {
      segments.push({ type: 'text', text: match[0]! })
    }
    lastIndex = match.index + match[0]!.length
  }
  if (lastIndex < text.length) {
    segments.push({ type: 'text', text: text.slice(lastIndex) })
  }
  return segments
}

function renderText(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n{2,}/g)
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n')
    return (
      <p key={pIdx} className="whitespace-pre-wrap break-words leading-relaxed">
        {lines.map((line, lIdx) => {
          const segments = parseInlineMarkdown(line)
          return (
            <span key={lIdx}>
              {segments.map((seg, sIdx) =>
                seg.type === 'link' ? (
                  <a
                    key={sIdx}
                    href={seg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 underline underline-offset-2 hover:text-orange-700"
                  >
                    {seg.label}
                  </a>
                ) : (
                  <span key={sIdx}>{seg.text}</span>
                )
              )}
              {lIdx < lines.length - 1 ? <br /> : null}
            </span>
          )
        })}
      </p>
    )
  })
}

export function ChatMessage({ message }: ChatMessageProps) {
  const text = useMemo(() => {
    return (message.parts ?? [])
      .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
      .map((p) => p.text)
      .join('\n\n')
  }, [message.parts])

  const isUser = message.role === 'user'
  if (!text.trim()) return null

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm',
          isUser
            ? 'bg-orange-600 text-white rounded-br-md'
            : 'bg-slate-100 text-slate-900 rounded-bl-md',
        ].join(' ')}
      >
        <div className="space-y-2">{renderText(text)}</div>
      </div>
    </div>
  )
}
