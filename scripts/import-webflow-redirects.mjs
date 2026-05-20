#!/usr/bin/env node
/**
 * Generate redirect entries from a Google Search Console "Pages" CSV export.
 *
 * Usage:
 *   node scripts/import-webflow-redirects.mjs <path-to-gsc-pages-export.csv>
 *
 * GSC default export columns: Top pages, Clicks, Impressions, CTR, Position.
 *
 * Emits redirect entries for URL paths that are not in CURRENT_ROUTES.
 * Output goes to stdout — paste into legacyRedirects() in next.config.mjs
 * after reviewing destinations.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const CURRENT_ROUTES = new Set([
  '/',
  '/about',
  '/contact',
  '/pricing',
  '/products',
  '/services',
  '/solutions',
  '/customers',
  '/careers',
  '/privacy',
  '/terms',
  '/blog',
  '/glossary',
  '/accounting-services-dubai',
  '/accounting-services-abu-dhabi',
  '/accounting-services-sharjah',
])

function parseCsvLine(line) {
  const out = []
  let cur = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      inQuotes = !inQuotes
      continue
    }
    if (c === ',' && !inQuotes) {
      out.push(cur)
      cur = ''
      continue
    }
    cur += c
  }
  out.push(cur)
  return out
}

function toPath(url) {
  try {
    const u = new URL(url)
    return u.pathname.replace(/\/$/, '') || '/'
  } catch {
    return null
  }
}

function guessDestination(path) {
  if (path.startsWith('/blog/')) return path
  if (path.startsWith('/glossary/')) return path
  if (CURRENT_ROUTES.has(path)) return path
  return '/?webflow-legacy=1'
}

function main() {
  const file = process.argv[2]
  if (!file) {
    console.error('Usage: node scripts/import-webflow-redirects.mjs <gsc-pages-export.csv>')
    process.exit(1)
  }

  const raw = readFileSync(resolve(file), 'utf8')
  const lines = raw.split(/\r?\n/).filter(Boolean)
  const data = lines.slice(1)

  const entries = []
  const seen = new Set()
  for (const line of data) {
    const cols = parseCsvLine(line)
    const url = cols[0]
    if (!url) continue
    const path = toPath(url)
    if (!path || path === '/' || seen.has(path)) continue
    seen.add(path)
    if (CURRENT_ROUTES.has(path)) continue
    entries.push({ source: path, destination: guessDestination(path), permanent: true })
  }

  entries.sort((a, b) => a.source.localeCompare(b.source))

  console.log('// Paste into legacyRedirects() in next.config.mjs:')
  console.log('return [')
  for (const e of entries) {
    console.log(`  { source: '${e.source}', destination: '${e.destination}', permanent: true },`)
  }
  console.log(']')
  console.error(`Generated ${entries.length} redirect candidates.`)
}

main()
