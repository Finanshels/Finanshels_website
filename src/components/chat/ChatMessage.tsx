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

interface BoldSegment {
  type: 'bold'
  text: string
}

interface TextSegment {
  type: 'text'
  text: string
}

type Segment = LinkSegment | BoldSegment | TextSegment

function isSafeHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function stripListBullet(line: string): string {
  return line.replace(/^\s*(?:[-*•]|\d+\.)\s+/, '')
}

function parseInlineMarkdown(rawLine: string): Segment[] {
  const line = stripListBullet(rawLine)
  const segments: Segment[] = []
  const tokenRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*]+?)\*\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: line.slice(lastIndex, match.index) })
    }
    if (match[1] && match[2]) {
      if (isSafeHttpUrl(match[2])) {
        segments.push({ type: 'link', label: match[1], url: match[2] })
      } else {
        segments.push({ type: 'text', text: match[0] })
      }
    } else if (match[3]) {
      segments.push({ type: 'bold', text: match[3] })
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < line.length) {
    segments.push({ type: 'text', text: line.slice(lastIndex) })
  }
  return segments
}

function renderText(text: string): React.ReactNode[] {
  const paragraphs = text.split(/\n{2,}/g)
  return paragraphs.map((para, pIdx) => {
    const lines = para.split('\n')
    return (
      <p
        key={pIdx}
        className="whitespace-pre-wrap break-words leading-relaxed"
        style={{ overflowWrap: 'anywhere' }}
      >
        {lines.map((line, lIdx) => {
          const segments = parseInlineMarkdown(line)
          return (
            <span key={lIdx}>
              {segments.map((seg, sIdx) => {
                if (seg.type === 'link') {
                  return (
                    <a
                      key={sIdx}
                      href={seg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 underline underline-offset-2 hover:text-orange-700"
                    >
                      {seg.label}
                    </a>
                  )
                }
                if (seg.type === 'bold') {
                  return (
                    <strong key={sIdx} className="font-semibold">
                      {seg.text}
                    </strong>
                  )
                }
                return <span key={sIdx}>{seg.text}</span>
              })}
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
    <div className={`flex min-w-0 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[78%] min-w-0 rounded-2xl px-3.5 py-2 text-sm shadow-sm sm:max-w-[85%]',
          isUser
            ? 'bg-orange-600 text-white rounded-br-md'
            : 'bg-slate-100 text-slate-900 rounded-bl-md',
        ].join(' ')}
      >
        <div className="space-y-1.5">{renderText(text)}</div>
      </div>
    </div>
  )
}
