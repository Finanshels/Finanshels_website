import 'server-only'

import { getSiteUrl } from '@/lib/cms/config'

export interface SiteSearchHit {
  title: string
  url: string
  snippet: string
}

interface LlmsIndexEntry {
  title: string
  url: string
  keywords: string[]
}

interface CachedIndex {
  entries: LlmsIndexEntry[]
  fetchedAt: number
}

const INDEX_TTL_MS = 60 * 60 * 1000
let indexCache: CachedIndex | null = null

const pageCache = new Map<string, { html: string; fetchedAt: number }>()
const PAGE_TTL_MS = 30 * 60 * 1000
const PAGE_CACHE_MAX = 200

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

function urlToKeywords(url: string, title: string): string[] {
  try {
    const u = new URL(url)
    const pathTokens = u.pathname.split('/').flatMap((seg) => seg.split('-')).filter(Boolean)
    return Array.from(new Set([...tokenize(title), ...pathTokens.map((t) => t.toLowerCase())]))
  } catch {
    return tokenize(title)
  }
}

async function loadIndex(): Promise<LlmsIndexEntry[]> {
  if (indexCache && Date.now() - indexCache.fetchedAt < INDEX_TTL_MS) {
    return indexCache.entries
  }

  const site = getSiteUrl()
  try {
    const res = await fetch(`${site}/llms.txt`, { cache: 'no-store' })
    if (!res.ok) {
      return indexCache?.entries ?? []
    }
    const text = await res.text()
    const entries: LlmsIndexEntry[] = []
    const seen = new Set<string>()

    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed.startsWith('- ')) continue
      const rest = trimmed.slice(2)
      const colonIdx = rest.indexOf(': ')
      if (colonIdx === -1) continue
      const title = rest.slice(0, colonIdx).trim()
      const url = rest.slice(colonIdx + 2).trim()
      if (!url.startsWith('http')) continue
      if (seen.has(url)) continue
      seen.add(url)
      entries.push({ title, url, keywords: urlToKeywords(url, title) })
    }

    if (!seen.has(site)) {
      entries.unshift({
        title: 'Finanshels homepage',
        url: site,
        keywords: ['finanshels', 'home', 'accounting', 'cfo', 'vat', 'tax'],
      })
    }

    indexCache = { entries, fetchedAt: Date.now() }
    return entries
  } catch (err) {
    console.warn('[chat:siteSearch] failed to load /llms.txt:', err instanceof Error ? err.message : err)
    return indexCache?.entries ?? []
  }
}

function scoreEntry(entry: LlmsIndexEntry, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0
  let score = 0
  for (const token of queryTokens) {
    if (entry.keywords.includes(token)) score += 3
    else if (entry.keywords.some((k) => k.includes(token) || token.includes(k))) score += 1
  }
  return score
}

function htmlToText(html: string, maxLen = 3500): string {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
  return body.slice(0, maxLen)
}

async function fetchPageText(url: string): Promise<string | null> {
  const cached = pageCache.get(url)
  if (cached && Date.now() - cached.fetchedAt < PAGE_TTL_MS) return cached.html

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'user-agent': 'FinanshelsChatBot/1.0 (+https://finanshels.com)' },
    })
    if (!res.ok) return null
    const html = await res.text()
    const text = htmlToText(html)

    if (pageCache.size >= PAGE_CACHE_MAX) {
      const firstKey = pageCache.keys().next().value
      if (firstKey) pageCache.delete(firstKey)
    }
    pageCache.set(url, { html: text, fetchedAt: Date.now() })
    return text
  } catch (err) {
    console.warn('[chat:siteSearch] fetch failed for', url, err instanceof Error ? err.message : err)
    return null
  }
}

export async function searchSiteContent(query: string, limit = 3): Promise<SiteSearchHit[]> {
  if (!query || query.trim().length < 2) return []
  const entries = await loadIndex()
  if (entries.length === 0) return []

  const tokens = tokenize(query)
  const scored = entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)

  const fallback =
    scored.length > 0
      ? scored
      : entries.slice(0, limit).map((entry) => ({ entry, score: 0 }))

  const hits: SiteSearchHit[] = []
  for (const { entry } of fallback) {
    const snippet = (await fetchPageText(entry.url)) ?? entry.title
    hits.push({ title: entry.title, url: entry.url, snippet })
  }
  return hits
}
