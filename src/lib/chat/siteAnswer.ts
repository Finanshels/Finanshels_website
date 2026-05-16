import 'server-only'

import { searchSiteContent, type SiteSearchHit } from './siteSearch'

export interface SiteAnswer {
  text: string
  citations: SiteSearchHit[]
}

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'can', 'may', 'might', 'must', 'shall', 'i', 'you', 'he', 'she', 'it',
  'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'this',
  'that', 'these', 'those', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'about',
  'as', 'by', 'from', 'me', 'my', 'your', 'our', 'their', 'his', 'her', 'so',
])

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((tok) => tok.length > 2 && !STOP_WORDS.has(tok))
}

function pickRelevantSnippet(snippet: string, queryTokens: string[], maxLen = 360): string {
  if (!snippet) return ''
  if (snippet.length <= maxLen) return snippet
  const lower = snippet.toLowerCase()
  let bestIdx = -1
  for (const tok of queryTokens) {
    const idx = lower.indexOf(tok)
    if (idx >= 0 && (bestIdx === -1 || idx < bestIdx)) bestIdx = idx
  }
  if (bestIdx < 0) return snippet.slice(0, maxLen).trim() + '…'
  const start = Math.max(0, bestIdx - 80)
  const end = Math.min(snippet.length, start + maxLen)
  const slice = snippet.slice(start, end).trim()
  const prefix = start > 0 ? '…' : ''
  const suffix = end < snippet.length ? '…' : ''
  return `${prefix}${slice}${suffix}`
}

function hasMeaningfulOverlap(hit: SiteSearchHit, queryTokens: string[]): boolean {
  if (queryTokens.length === 0) return false
  const lowerSnippet = hit.snippet.toLowerCase()
  const lowerTitle = hit.title.toLowerCase()
  for (const tok of queryTokens) {
    if (lowerSnippet.includes(tok) || lowerTitle.includes(tok)) return true
  }
  return false
}

export async function buildSiteAnswer(query: string): Promise<SiteAnswer | null> {
  const trimmed = query.trim()
  if (trimmed.length < 3) return null

  const hits = await searchSiteContent(trimmed, 3)
  if (hits.length === 0) return null

  const queryTokens = tokenize(trimmed)
  const relevant = hits.filter((h) => hasMeaningfulOverlap(h, queryTokens))
  if (relevant.length === 0) return null

  const primary = relevant[0]
  const snippet = pickRelevantSnippet(primary.snippet, queryTokens)
  const otherLinks = relevant
    .slice(1)
    .map((h) => `- [${h.title}](${h.url})`)
    .join('\n')

  const sections = [
    `Here's what we have on this from [${primary.title}](${primary.url}):`,
    `> ${snippet}`,
  ]
  if (otherLinks) sections.push(`Also related:\n${otherLinks}`)
  sections.push(
    `If this doesn't quite answer your question, share a bit more detail or say "talk to a human" and our team will follow up.`,
  )

  return {
    text: sections.join('\n\n'),
    citations: relevant,
  }
}
