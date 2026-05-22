# Webflow Migration — Foundation (Discovery + Importer Infra) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the discovery script and shared importer infrastructure so a single Webflow collection (`team_members`) can be migrated end-to-end via dry-run and live run.

**Architecture:** Node + TypeScript scripts under `scripts/import/` use the Webflow Data API v2 to pull content, run it through declarative field transforms, migrate assets to Firebase Storage, and write to Firestore via the existing `upsertCmsDocument` repository function. Reuses all existing CMS helpers (`slugifyForCms`, `sanitizeCmsHtml`, `uploadCmsMediaBytes`) — no duplication.

**Tech Stack:** Node 20+, TypeScript (via `tsx`), `firebase-admin` (already in repo), `cheerio` (new), `node:test` (built-in). All scripts are server-only Node — no Next.js bundle impact.

**Related spec:** [`docs/superpowers/specs/2026-05-22-webflow-migration-design.md`](../specs/2026-05-22-webflow-migration-design.md)

---

## File Structure

**New files (all under `scripts/import/`):**

```
scripts/import/
  index.ts                       # CLI orchestrator (--collection / --all / --dry-run)
  discovery.ts                   # Phase-1 discovery: dump Webflow schema + counts
  lib/
    env.ts                       # Load .env.local, validate Webflow + Firebase env
    webflowClient.ts             # Webflow Data API v2 wrapper with rate limiting
    referenceMap.ts              # In-memory webflowItemId -> firestoreSlug map
    assetMigrator.ts             # Download from Webflow CDN, upload to Firebase Storage
    report.ts                    # Per-run JSON report writer
    writer.ts                    # Idempotent upsert via upsertCmsDocument
    transform/
      primitives.ts              # direct, slug, date, boolean, number, option
      richText.ts                # cheerio HTML walker + sanitize-html
      image.ts                   # uses assetMigrator
      reference.ts               # uses referenceMap
    __tests__/
      env.test.ts
      webflowClient.test.ts
      referenceMap.test.ts
      report.test.ts
      writer.test.ts
      transform.primitives.test.ts
      transform.richText.test.ts
      transform.image.test.ts
      transform.reference.test.ts
      assetMigrator.test.ts
  team_members.ts                # First end-to-end importer (exit criterion)
```

**Modified files:**

- `package.json` — add `tsx`, `cheerio` deps; add `webflow:*` npm scripts
- `.gitignore` — add `tmp/`

**Output directory (gitignored):**

- `tmp/import-reports/` — per-run JSON reports

---

## Conventions

- **Language:** TypeScript everywhere. Run via `tsx`.
- **Test runner:** Node's built-in `node:test`. No vitest/jest.
- **Test invocation:** `node --import tsx --test scripts/import/lib/__tests__/*.test.ts`
- **Module style:** ESM. Project is `"type": "module"`.
- **Imports from `src/lib/cms/*`:** allowed (scripts run in Node, never bundled for browser).
- **Commits:** one per task. Conventional commit prefix.

---

## Task 1: Project setup — deps, gitignore, npm scripts

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`

- [ ] **Step 1: Add `cheerio` (runtime dep) and `tsx` (devDep)**

```bash
npm install cheerio@^1.0.0
npm install --save-dev tsx@^4.19.0
```

- [ ] **Step 2: Add Webflow npm scripts**

Open `package.json` and add to the `scripts` block:

```json
  "webflow:discover": "node --import tsx scripts/import/discovery.ts",
  "webflow:import": "node --import tsx scripts/import/index.ts",
  "webflow:test": "node --import tsx --test scripts/import/lib/__tests__/*.test.ts"
```

- [ ] **Step 3: Add `tmp/` to .gitignore**

Append to `.gitignore`:

```
# Importer output (per-run JSON reports, asset cache, etc.)
tmp/
```

- [ ] **Step 4: Verify setup**

```bash
npm run typecheck
```

Expected: PASS.

```bash
ls node_modules/cheerio node_modules/tsx >/dev/null && echo "deps ok"
```

Expected: `deps ok`

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore
git commit -m "chore(webflow-import): add tsx + cheerio deps and npm scripts"
```

---

## Task 2: Env loader and validation

**Files:**
- Create: `scripts/import/lib/env.ts`
- Test: `scripts/import/lib/__tests__/env.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `scripts/import/lib/__tests__/env.test.ts`:

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateEnv } from '../env'

test('validateEnv returns shape when all vars present', () => {
  const env = {
    WEBFLOW_API_TOKEN: 'tok_abc',
    WEBFLOW_SITE_ID: 'site_123',
    FIREBASE_ADMIN_PROJECT_ID: 'fs-proj',
    FIREBASE_ADMIN_CLIENT_EMAIL: 'sa@fs-proj.iam',
    FIREBASE_ADMIN_PRIVATE_KEY: 'pem',
    FIREBASE_STORAGE_BUCKET: 'fs-proj.appspot.com',
  }

  const result = validateEnv(env)
  assert.equal(result.webflow.token, 'tok_abc')
  assert.equal(result.webflow.siteId, 'site_123')
  assert.equal(result.firebase.projectId, 'fs-proj')
  assert.equal(result.firebase.storageBucket, 'fs-proj.appspot.com')
})

test('validateEnv throws when WEBFLOW_API_TOKEN missing', () => {
  assert.throws(
    () => validateEnv({ WEBFLOW_SITE_ID: 'x' }),
    /WEBFLOW_API_TOKEN/
  )
})

test('validateEnv throws when FIREBASE_STORAGE_BUCKET missing', () => {
  assert.throws(
    () => validateEnv({
      WEBFLOW_API_TOKEN: 't',
      WEBFLOW_SITE_ID: 's',
      FIREBASE_ADMIN_PROJECT_ID: 'p',
      FIREBASE_ADMIN_CLIENT_EMAIL: 'e',
      FIREBASE_ADMIN_PRIVATE_KEY: 'k',
    }),
    /FIREBASE_STORAGE_BUCKET/
  )
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/env.test.ts
```

Expected: FAIL — `Cannot find module '../env'`

- [ ] **Step 3: Implement `env.ts`**

```typescript
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

export interface WebflowEnv {
  token: string
  siteId: string
}

export interface FirebaseEnv {
  projectId: string
  clientEmail: string
  privateKey: string
  storageBucket: string
}

export interface ImporterEnv {
  webflow: WebflowEnv
  firebase: FirebaseEnv
}

const REQUIRED = [
  'WEBFLOW_API_TOKEN',
  'WEBFLOW_SITE_ID',
  'FIREBASE_ADMIN_PROJECT_ID',
  'FIREBASE_ADMIN_CLIENT_EMAIL',
  'FIREBASE_ADMIN_PRIVATE_KEY',
  'FIREBASE_STORAGE_BUCKET',
] as const

export function validateEnv(source: Record<string, string | undefined>): ImporterEnv {
  const missing: string[] = []
  for (const key of REQUIRED) {
    if (!source[key]) missing.push(key)
  }
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`)
  }
  return {
    webflow: {
      token: source.WEBFLOW_API_TOKEN!,
      siteId: source.WEBFLOW_SITE_ID!,
    },
    firebase: {
      projectId: source.FIREBASE_ADMIN_PROJECT_ID!,
      clientEmail: source.FIREBASE_ADMIN_CLIENT_EMAIL!,
      privateKey: source.FIREBASE_ADMIN_PRIVATE_KEY!,
      storageBucket: source.FIREBASE_STORAGE_BUCKET!,
    },
  }
}

export function loadEnvLocal(): void {
  try {
    const here = dirname(fileURLToPath(import.meta.url))
    const envPath = resolve(here, '../../../.env.local')
    const txt = readFileSync(envPath, 'utf8')
    for (const rawLine of txt.split(/\r?\n/)) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq === -1) continue
      const key = line.slice(0, eq).trim()
      let value = line.slice(eq + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch (err) {
    process.stderr.write(`[warn] could not read .env.local: ${(err as Error).message}\n`)
  }
}

export function loadValidatedEnv(): ImporterEnv {
  loadEnvLocal()
  return validateEnv(process.env)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/env.test.ts
```

Expected: PASS (3/3 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/env.ts scripts/import/lib/__tests__/env.test.ts
git commit -m "feat(webflow-import): env loader and validation"
```

---

## Task 3: Webflow client (Data API v2 wrapper with rate limiting)

**Files:**
- Create: `scripts/import/lib/webflowClient.ts`
- Test: `scripts/import/lib/__tests__/webflowClient.test.ts`

**Webflow Data API v2 endpoints used:**
- `GET /v2/sites/{site_id}/collections` — list collections
- `GET /v2/collections/{collection_id}` — collection schema
- `GET /v2/collections/{collection_id}/items?offset=0&limit=100` — list items (max 100/page)
- Rate limit: 60 req/min per token. On `429`, honor `retry-after` header.

- [ ] **Step 1: Write the failing tests**

```typescript
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createWebflowClient } from '../webflowClient'

function makeFetchStub(responses: Array<{ status: number, body: unknown, headers?: Record<string, string> }>) {
  let call = 0
  return mock.fn(async () => {
    const r = responses[call++]
    return new Response(JSON.stringify(r.body), {
      status: r.status,
      headers: { 'content-type': 'application/json', ...(r.headers ?? {}) },
    })
  })
}

test('listCollections returns collections array', async () => {
  const fetch = makeFetchStub([
    { status: 200, body: { collections: [{ id: 'c1', slug: 'blog' }] } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch })
  const result = await client.listCollections()
  assert.equal(result.length, 1)
  assert.equal(result[0].id, 'c1')
})

test('listItems paginates until empty', async () => {
  const fetch = makeFetchStub([
    { status: 200, body: { items: [{ id: 'i1' }, { id: 'i2' }], pagination: { total: 3, limit: 2, offset: 0 } } },
    { status: 200, body: { items: [{ id: 'i3' }], pagination: { total: 3, limit: 2, offset: 2 } } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch, pageSize: 2 })
  const items = await client.listItems('coll_id')
  assert.equal(items.length, 3)
  assert.deepEqual(items.map(i => i.id), ['i1', 'i2', 'i3'])
})

test('retries on 429 with backoff', async () => {
  const fetch = makeFetchStub([
    { status: 429, body: { code: 'rate_limit' }, headers: { 'retry-after': '0' } },
    { status: 200, body: { collections: [] } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch })
  const result = await client.listCollections()
  assert.deepEqual(result, [])
  assert.equal(fetch.mock.callCount(), 2)
})

test('throws after maxRetries consecutive 429s', async () => {
  const fetch = makeFetchStub([
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch, maxRetries: 3 })
  await assert.rejects(() => client.listCollections(), /rate limit/i)
})

test('sends Authorization header', async () => {
  const fetch = makeFetchStub([{ status: 200, body: { collections: [] } }])
  const client = createWebflowClient({ token: 'secret_token', siteId: 's', fetch })
  await client.listCollections()
  const call = fetch.mock.calls[0]
  const req = call.arguments[0] as Request
  assert.equal(req.headers.get('authorization'), 'Bearer secret_token')
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/webflowClient.test.ts
```

Expected: FAIL — `Cannot find module '../webflowClient'`

- [ ] **Step 3: Implement `webflowClient.ts`**

```typescript
export interface WebflowCollection {
  id: string
  slug: string
  displayName?: string
  fields?: WebflowField[]
}

export interface WebflowField {
  id: string
  slug: string
  displayName?: string
  type: string
  isRequired?: boolean
  validations?: Record<string, unknown>
}

export interface WebflowItem {
  id: string
  isArchived?: boolean
  isDraft?: boolean
  fieldData: Record<string, unknown>
  lastPublished?: string
  lastUpdated?: string
  createdOn?: string
}

interface PaginationMeta {
  total: number
  limit: number
  offset: number
}

interface ListItemsResponse {
  items: WebflowItem[]
  pagination: PaginationMeta
}

interface WebflowClientOptions {
  token: string
  siteId: string
  fetch?: typeof fetch
  pageSize?: number
  maxRetries?: number
  baseUrl?: string
}

const DEFAULT_BASE_URL = 'https://api.webflow.com'
const DEFAULT_PAGE_SIZE = 100
const DEFAULT_MAX_RETRIES = 3

export interface WebflowClient {
  listCollections(): Promise<WebflowCollection[]>
  getCollection(collectionId: string): Promise<WebflowCollection>
  listItems(collectionId: string): Promise<WebflowItem[]>
}

export function createWebflowClient(opts: WebflowClientOptions): WebflowClient {
  const fetchFn = opts.fetch ?? globalThis.fetch
  const pageSize = opts.pageSize ?? DEFAULT_PAGE_SIZE
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL

  async function request<T>(path: string): Promise<T> {
    let attempt = 0
    while (true) {
      const req = new Request(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${opts.token}`,
          'accept-version': '2.0.0',
          accept: 'application/json',
        },
      })
      const res = await fetchFn(req)
      if (res.status === 429) {
        attempt++
        if (attempt >= maxRetries) {
          throw new Error(`Webflow rate limit exceeded after ${maxRetries} retries (path: ${path})`)
        }
        const retryAfter = Number(res.headers.get('retry-after') ?? '1')
        await new Promise(r => setTimeout(r, Math.max(retryAfter, 1) * 1000))
        continue
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Webflow ${res.status} ${path}: ${body.slice(0, 200)}`)
      }
      return (await res.json()) as T
    }
  }

  return {
    async listCollections() {
      const data = await request<{ collections: WebflowCollection[] }>(
        `/v2/sites/${opts.siteId}/collections`
      )
      return data.collections
    },

    async getCollection(collectionId: string) {
      return request<WebflowCollection>(`/v2/collections/${collectionId}`)
    },

    async listItems(collectionId: string) {
      const all: WebflowItem[] = []
      let offset = 0
      while (true) {
        const data = await request<ListItemsResponse>(
          `/v2/collections/${collectionId}/items?offset=${offset}&limit=${pageSize}`
        )
        all.push(...data.items)
        offset += data.items.length
        if (data.items.length < pageSize || offset >= data.pagination.total) break
      }
      return all
    },
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/webflowClient.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/webflowClient.ts scripts/import/lib/__tests__/webflowClient.test.ts
git commit -m "feat(webflow-import): Data API v2 client with rate-limit retry"
```

---

## Task 4: Discovery script

**Files:**
- Create: `scripts/import/discovery.ts`

One-shot CLI. Not unit-tested (I/O + console output); manual verification is the gate.

- [ ] **Step 1: Implement `discovery.ts`**

```typescript
import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { loadValidatedEnv } from './lib/env'
import { createWebflowClient } from './lib/webflowClient'

interface DiscoveryEntry {
  id: string
  slug: string
  displayName?: string
  itemCount: number
  fields: Array<{
    id: string
    slug: string
    displayName?: string
    type: string
    isRequired?: boolean
  }>
}

async function main(): Promise<void> {
  const env = loadValidatedEnv()
  const client = createWebflowClient({
    token: env.webflow.token,
    siteId: env.webflow.siteId,
  })

  process.stdout.write('Fetching collections...\n')
  const collections = await client.listCollections()

  const entries: DiscoveryEntry[] = []
  for (const col of collections) {
    process.stdout.write(`  ${col.slug}: fetching schema + counts...\n`)
    const detailed = await client.getCollection(col.id)
    const items = await client.listItems(col.id)
    entries.push({
      id: col.id,
      slug: col.slug,
      displayName: col.displayName,
      itemCount: items.length,
      fields: (detailed.fields ?? []).map(f => ({
        id: f.id,
        slug: f.slug,
        displayName: f.displayName,
        type: f.type,
        isRequired: f.isRequired,
      })),
    })
  }

  const reportDir = resolve(process.cwd(), 'tmp/import-reports')
  mkdirSync(reportDir, { recursive: true })
  const outPath = resolve(reportDir, 'discovery.json')
  writeFileSync(outPath, JSON.stringify({
    siteId: env.webflow.siteId,
    capturedAt: new Date().toISOString(),
    totalCollections: entries.length,
    totalItems: entries.reduce((sum, e) => sum + e.itemCount, 0),
    collections: entries,
  }, null, 2))

  process.stdout.write(`\nWrote ${outPath}\n`)
  process.stdout.write(`Collections: ${entries.length}\n`)
  process.stdout.write(`Total items: ${entries.reduce((sum, e) => sum + e.itemCount, 0)}\n`)
}

main().catch(err => {
  process.stderr.write(`Discovery failed: ${(err as Error).message}\n`)
  process.exit(1)
})
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 3: Run against live Webflow API**

(Requires `WEBFLOW_API_TOKEN` and `WEBFLOW_SITE_ID` in `.env.local`.)

```bash
npm run webflow:discover
```

Expected output ends with:

```
Wrote /path/to/tmp/import-reports/discovery.json
Collections: <N>
Total items: <count>
```

- [ ] **Step 4: Manual verification — inspect the discovery report**

Open `tmp/import-reports/discovery.json`. Confirm:
- Every Webflow collection shows up
- `itemCount` matches the Webflow CMS dashboard
- Each `fields[]` entry has `slug`, `type`, and `displayName`

If anything is missing or wrong, fix `webflowClient` or `discovery.ts` and re-run.

- [ ] **Step 5: Commit**

```bash
git add scripts/import/discovery.ts
git commit -m "feat(webflow-import): discovery script — dump schema + counts"
```

---

## Task 5: Reference map

**Files:**
- Create: `scripts/import/lib/referenceMap.ts`
- Test: `scripts/import/lib/__tests__/referenceMap.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createReferenceMap } from '../referenceMap'

test('set + resolve round-trips', () => {
  const map = createReferenceMap()
  map.set('team_members', 'wf_001', 'jane-doe')
  assert.equal(map.resolve('team_members', 'wf_001'), 'jane-doe')
})

test('resolve returns undefined for unknown id', () => {
  const map = createReferenceMap()
  assert.equal(map.resolve('team_members', 'nope'), undefined)
})

test('different collections are isolated', () => {
  const map = createReferenceMap()
  map.set('team_members', 'shared_id', 'jane')
  map.set('our_customers', 'shared_id', 'acme-corp')
  assert.equal(map.resolve('team_members', 'shared_id'), 'jane')
  assert.equal(map.resolve('our_customers', 'shared_id'), 'acme-corp')
})

test('unresolved tracks misses', () => {
  const map = createReferenceMap()
  map.resolve('team_members', 'missing1')
  map.resolve('team_members', 'missing2')
  map.resolve('our_customers', 'missing3')
  const unresolved = map.unresolved()
  assert.equal(unresolved.length, 3)
  assert.ok(unresolved.some(u => u.id === 'missing1'))
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/referenceMap.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `referenceMap.ts`**

```typescript
export interface ReferenceMiss {
  collection: string
  id: string
}

export interface ReferenceMap {
  set(collection: string, webflowItemId: string, firestoreSlug: string): void
  resolve(collection: string, webflowItemId: string): string | undefined
  unresolved(): ReferenceMiss[]
  size(): number
}

export function createReferenceMap(): ReferenceMap {
  const data = new Map<string, Map<string, string>>()
  const misses: ReferenceMiss[] = []

  function bucket(collection: string): Map<string, string> {
    let b = data.get(collection)
    if (!b) {
      b = new Map()
      data.set(collection, b)
    }
    return b
  }

  return {
    set(collection, webflowItemId, firestoreSlug) {
      bucket(collection).set(webflowItemId, firestoreSlug)
    },
    resolve(collection, webflowItemId) {
      const found = data.get(collection)?.get(webflowItemId)
      if (!found) {
        misses.push({ collection, id: webflowItemId })
      }
      return found
    },
    unresolved() {
      return misses.slice()
    },
    size() {
      let total = 0
      for (const b of data.values()) total += b.size
      return total
    },
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/referenceMap.test.ts
```

Expected: PASS (4/4 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/referenceMap.ts scripts/import/lib/__tests__/referenceMap.test.ts
git commit -m "feat(webflow-import): in-memory webflowId -> firestoreSlug reference map"
```

---

## Task 6: Primitive transforms

**Files:**
- Create: `scripts/import/lib/transform/primitives.ts`
- Test: `scripts/import/lib/__tests__/transform.primitives.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  transformDirect,
  transformSlug,
  transformDate,
  transformBoolean,
  transformNumber,
  transformOption,
} from '../transform/primitives'

test('direct returns string as-is', () => {
  assert.equal(transformDirect('hello'), 'hello')
})

test('direct returns empty string for null/undefined', () => {
  assert.equal(transformDirect(null), '')
  assert.equal(transformDirect(undefined), '')
})

test('slug normalizes via slugifyForCms convention', () => {
  assert.equal(transformSlug('Hello World!'), 'hello-world')
  assert.equal(transformSlug('VAT 101'), 'vat-101')
})

test('slug throws on empty input', () => {
  assert.throws(() => transformSlug(''), /empty/i)
  assert.throws(() => transformSlug(null), /empty/i)
})

test('date parses ISO 8601 string to Date', () => {
  const d = transformDate('2024-03-15T10:30:00Z')
  assert.ok(d instanceof Date)
  assert.equal(d!.toISOString(), '2024-03-15T10:30:00.000Z')
})

test('date returns null for invalid string', () => {
  assert.equal(transformDate('garbage'), null)
  assert.equal(transformDate(null), null)
})

test('boolean coerces truthy/falsy', () => {
  assert.equal(transformBoolean(true), true)
  assert.equal(transformBoolean('true'), true)
  assert.equal(transformBoolean('false'), false)
  assert.equal(transformBoolean(null), false)
  assert.equal(transformBoolean(0), false)
})

test('number parses numeric strings', () => {
  assert.equal(transformNumber(42), 42)
  assert.equal(transformNumber('3.14'), 3.14)
  assert.equal(transformNumber(null), null)
  assert.equal(transformNumber('not a number'), null)
})

test('option looks up via table', () => {
  const table = { wf_opt_1: 'accounting', wf_opt_2: 'tax' }
  assert.equal(transformOption('wf_opt_1', table), 'accounting')
  assert.equal(transformOption('wf_opt_2', table), 'tax')
})

test('option returns null on unknown key', () => {
  const table = { a: 'A' }
  assert.equal(transformOption('unknown', table), null)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.primitives.test.ts
```

Expected: FAIL — `Cannot find module '../transform/primitives'`

- [ ] **Step 3: Implement `transform/primitives.ts`**

```typescript
import { slugifyForCms } from '../../../../src/lib/cms/slugify'

export function transformDirect(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return String(value)
}

export function transformSlug(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    throw new Error('Slug source value is empty')
  }
  const str = typeof value === 'string' ? value : String(value)
  if (!str.trim()) {
    throw new Error('Slug source value is empty after trim')
  }
  return slugifyForCms(str)
}

export function transformDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function transformBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'true' || lower === '1' || lower === 'yes'
  }
  if (typeof value === 'number') return value !== 0
  return false
}

export function transformNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

export function transformOption(value: unknown, table: Record<string, string>): string | null {
  if (typeof value !== 'string') return null
  return table[value] ?? null
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.primitives.test.ts
```

Expected: PASS (10/10 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/transform/primitives.ts scripts/import/lib/__tests__/transform.primitives.test.ts
git commit -m "feat(webflow-import): primitive transforms (direct/slug/date/bool/number/option)"
```

---

## Task 7: Asset migrator

**Files:**
- Create: `scripts/import/lib/assetMigrator.ts`
- Test: `scripts/import/lib/__tests__/assetMigrator.test.ts`

The migrator reuses `uploadCmsMediaBytes` from `src/lib/cms/storageUpload.ts`. Tests stub the uploader.

- [ ] **Step 1: Inspect existing uploader signature**

Read `src/lib/cms/storageUpload.ts` around the `uploadCmsMediaBytes` export. Expected shape:

```typescript
export async function uploadCmsMediaBytes(params: {
  bytes: Buffer
  filename: string
  contentType: string
  collection: string
  slug: string
}): Promise<{ url: string; storagePath: string; size: number }>
```

If the actual signature differs, **adapt the `UploadFn` type and the orchestrator wiring in Task 13** to match. **Do not change `uploadCmsMediaBytes`.**

- [ ] **Step 2: Write the failing tests**

```typescript
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createAssetMigrator } from '../assetMigrator'

function fetchStub(body: Buffer, contentType = 'image/png') {
  return mock.fn(async () =>
    new Response(body, { status: 200, headers: { 'content-type': contentType } })
  )
}

test('migrates a CDN url and returns new url', async () => {
  const upload = mock.fn(async () => ({
    url: 'https://storage.googleapis.com/b/cms-media/team_members/jane/photo.png',
    storagePath: 'cms-media/team_members/jane/photo.png',
    size: 123,
  }))
  const migrator = createAssetMigrator({
    fetch: fetchStub(Buffer.from([1, 2, 3])),
    upload,
  })

  const result = await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    collection: 'team_members',
    slug: 'jane',
  })

  assert.ok(result)
  assert.equal(result!.url, 'https://storage.googleapis.com/b/cms-media/team_members/jane/photo.png')
  assert.equal(upload.mock.callCount(), 1)
})

test('returns null for empty/falsy sourceUrl', async () => {
  const migrator = createAssetMigrator({
    fetch: mock.fn() as never,
    upload: mock.fn() as never,
  })
  assert.equal(await migrator.migrate({ sourceUrl: '', collection: 'x', slug: 'y' }), null)
  assert.equal(await migrator.migrate({ sourceUrl: null as unknown as string, collection: 'x', slug: 'y' }), null)
})

test('dry-run skips fetch and upload, returns synthetic url', async () => {
  const fetch = mock.fn()
  const upload = mock.fn()
  const migrator = createAssetMigrator({ fetch: fetch as never, upload: upload as never, dryRun: true })
  const result = await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    collection: 'team_members',
    slug: 'jane',
  })
  assert.ok(result)
  assert.ok(result!.url.includes('DRY-RUN'))
  assert.equal(fetch.mock.callCount(), 0)
  assert.equal(upload.mock.callCount(), 0)
})

test('infers filename from URL pathname', async () => {
  const upload = mock.fn(async (params: { filename: string }) => ({
    url: `https://storage.googleapis.com/b/cms-media/x/y/${params.filename}`,
    storagePath: `cms-media/x/y/${params.filename}`,
    size: 0,
  }))
  const migrator = createAssetMigrator({
    fetch: fetchStub(Buffer.from([1])),
    upload: upload as never,
  })
  await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/some/path/specific-file.jpg?v=1',
    collection: 'x',
    slug: 'y',
  })
  const call = upload.mock.calls[0]
  assert.equal((call.arguments[0] as { filename: string }).filename, 'specific-file.jpg')
})
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/assetMigrator.test.ts
```

Expected: FAIL — `Cannot find module '../assetMigrator'`

- [ ] **Step 4: Implement `assetMigrator.ts`**

```typescript
export interface MigrateParams {
  sourceUrl: string
  collection: string
  slug: string
}

export interface MigrateResult {
  url: string
  storagePath: string
  size: number
  sourceUrl: string
}

export interface UploadFn {
  (params: {
    bytes: Buffer
    filename: string
    contentType: string
    collection: string
    slug: string
  }): Promise<{ url: string; storagePath: string; size: number }>
}

export interface AssetMigratorOptions {
  fetch?: typeof fetch
  upload: UploadFn
  dryRun?: boolean
}

export interface AssetMigrator {
  migrate(params: MigrateParams): Promise<MigrateResult | null>
}

function inferFilename(url: string): string {
  try {
    const u = new URL(url)
    const last = u.pathname.split('/').filter(Boolean).pop() ?? 'asset'
    return last.replace(/[^A-Za-z0-9._-]/g, '_')
  } catch {
    return 'asset'
  }
}

export function createAssetMigrator(opts: AssetMigratorOptions): AssetMigrator {
  const fetchFn = opts.fetch ?? globalThis.fetch

  return {
    async migrate({ sourceUrl, collection, slug }) {
      if (!sourceUrl || typeof sourceUrl !== 'string') return null

      const filename = inferFilename(sourceUrl)

      if (opts.dryRun) {
        return {
          url: `DRY-RUN://cms-media/${collection}/${slug}/${filename}`,
          storagePath: `cms-media/${collection}/${slug}/${filename}`,
          size: 0,
          sourceUrl,
        }
      }

      const res = await fetchFn(sourceUrl)
      if (!res.ok) {
        throw new Error(`Asset fetch failed ${res.status}: ${sourceUrl}`)
      }
      const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
      const bytes = Buffer.from(await res.arrayBuffer())

      const uploaded = await opts.upload({
        bytes,
        filename,
        contentType,
        collection,
        slug,
      })

      return {
        url: uploaded.url,
        storagePath: uploaded.storagePath,
        size: uploaded.size,
        sourceUrl,
      }
    },
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/assetMigrator.test.ts
```

Expected: PASS (4/4 tests)

- [ ] **Step 6: Commit**

```bash
git add scripts/import/lib/assetMigrator.ts scripts/import/lib/__tests__/assetMigrator.test.ts
git commit -m "feat(webflow-import): asset migrator (Webflow CDN -> Firebase Storage)"
```

---

## Task 8: Image transform

**Files:**
- Create: `scripts/import/lib/transform/image.ts`
- Test: `scripts/import/lib/__tests__/transform.image.test.ts`

Webflow image fields come as `{ url, alt, fileId, ... }` or sometimes a plain URL string.

- [ ] **Step 1: Write the failing tests**

```typescript
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { transformImage } from '../transform/image'

test('migrates a Webflow image field shape', async () => {
  const migrator = {
    migrate: mock.fn(async () => ({
      url: 'https://storage.googleapis.com/b/cms-media/x/y/photo.png',
      storagePath: 'cms-media/x/y/photo.png',
      size: 100,
      sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    })),
  }
  const result = await transformImage(
    { url: 'https://uploads-ssl.webflow.com/abc/photo.png', alt: 'Jane' },
    { collection: 'team_members', slug: 'jane' },
    migrator
  )
  assert.ok(result)
  assert.equal(result!.url, 'https://storage.googleapis.com/b/cms-media/x/y/photo.png')
  assert.equal(result!.alt, 'Jane')
})

test('returns null for empty/falsy input', async () => {
  const migrator = { migrate: mock.fn() }
  assert.equal(await transformImage(null, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(await transformImage(undefined, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(await transformImage({}, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(migrator.migrate.mock.callCount(), 0)
})

test('accepts plain URL string', async () => {
  const migrator = {
    migrate: mock.fn(async () => ({
      url: 'new-url',
      storagePath: 'p',
      size: 1,
      sourceUrl: 'old-url',
    })),
  }
  const result = await transformImage(
    'https://uploads-ssl.webflow.com/abc/photo.png',
    { collection: 'x', slug: 'y' },
    migrator
  )
  assert.ok(result)
  assert.equal(result!.url, 'new-url')
  assert.equal(result!.alt, '')
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.image.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `transform/image.ts`**

```typescript
import type { AssetMigrator } from '../assetMigrator'

export interface CmsImageValue {
  url: string
  alt: string
  storagePath?: string
}

export interface TransformImageContext {
  collection: string
  slug: string
}

export async function transformImage(
  value: unknown,
  ctx: TransformImageContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<CmsImageValue | null> {
  let sourceUrl = ''
  let alt = ''

  if (typeof value === 'string' && value.trim()) {
    sourceUrl = value
  } else if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>
    sourceUrl = typeof v.url === 'string' ? v.url : ''
    alt = typeof v.alt === 'string' ? v.alt : ''
  }

  if (!sourceUrl) return null

  const migrated = await migrator.migrate({
    sourceUrl,
    collection: ctx.collection,
    slug: ctx.slug,
  })
  if (!migrated) return null

  return {
    url: migrated.url,
    alt,
    storagePath: migrated.storagePath,
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.image.test.ts
```

Expected: PASS (3/3 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/transform/image.ts scripts/import/lib/__tests__/transform.image.test.ts
git commit -m "feat(webflow-import): image transform — webflow shape -> CMS image"
```

---

## Task 9: Rich-text transform

**Files:**
- Create: `scripts/import/lib/transform/richText.ts`
- Test: `scripts/import/lib/__tests__/transform.richText.test.ts`

The transform walks HTML, finds every `<img src>` (and `srcset`), migrates the asset via `assetMigrator`, rewrites the src, then runs `sanitizeCmsHtml`.

- [ ] **Step 1: Write the failing tests**

```typescript
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { transformRichText } from '../transform/richText'

const noopMigrator = {
  migrate: mock.fn(async (p: { sourceUrl: string }) => ({
    url: `https://storage.googleapis.com/migrated/${encodeURIComponent(p.sourceUrl)}`,
    storagePath: 'p',
    size: 0,
    sourceUrl: p.sourceUrl,
  })),
}

test('returns empty string for empty/null input', async () => {
  assert.equal(await transformRichText('', { collection: 'x', slug: 'y' }, noopMigrator), '')
  assert.equal(await transformRichText(null, { collection: 'x', slug: 'y' }, noopMigrator), '')
})

test('rewrites <img src> via asset migrator', async () => {
  const html = '<p>Hello</p><img src="https://uploads-ssl.webflow.com/abc/photo.png" alt="x">'
  const out = await transformRichText(html, { collection: 'blog_posts', slug: 'post-1' }, noopMigrator)
  assert.ok(out.includes('storage.googleapis.com/migrated'))
  assert.ok(!out.includes('uploads-ssl.webflow.com'))
})

test('calls migrator once per img and keeps original on null result', async () => {
  const migrator = { migrate: mock.fn(async () => null) }
  const html = '<img src="https://example.com/photo.png">'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, migrator)
  assert.equal(migrator.migrate.mock.callCount(), 1)
  assert.ok(out.includes('example.com/photo.png'))
})

test('removes script tags via sanitizeCmsHtml', async () => {
  const html = '<p>safe</p><script>alert(1)</script>'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, noopMigrator)
  assert.ok(out.includes('safe'))
  assert.ok(!out.includes('<script'))
})

test('rewrites srcset entries', async () => {
  const html = '<img src="https://uploads-ssl.webflow.com/a/x.png" srcset="https://uploads-ssl.webflow.com/a/x-1x.png 1x, https://uploads-ssl.webflow.com/a/x-2x.png 2x">'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, noopMigrator)
  assert.ok(!out.includes('uploads-ssl.webflow.com'))
  assert.ok(out.includes('1x'))
  assert.ok(out.includes('2x'))
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.richText.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `transform/richText.ts`**

```typescript
import * as cheerio from 'cheerio'
import { sanitizeCmsHtml } from '../../../../src/lib/cms/sanitize'
import type { AssetMigrator } from '../assetMigrator'

export interface TransformRichTextContext {
  collection: string
  slug: string
}

async function rewriteSrcset(
  srcset: string,
  ctx: TransformRichTextContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<string> {
  const parts = srcset.split(',').map(p => p.trim()).filter(Boolean)
  const rewritten: string[] = []
  for (const part of parts) {
    const [url, descriptor] = part.split(/\s+/, 2)
    const migrated = await migrator.migrate({
      sourceUrl: url,
      collection: ctx.collection,
      slug: ctx.slug,
    })
    const newUrl = migrated?.url ?? url
    rewritten.push(descriptor ? `${newUrl} ${descriptor}` : newUrl)
  }
  return rewritten.join(', ')
}

export async function transformRichText(
  value: unknown,
  ctx: TransformRichTextContext,
  migrator: Pick<AssetMigrator, 'migrate'>
): Promise<string> {
  if (typeof value !== 'string' || !value.trim()) return ''

  const $ = cheerio.load(value, null, false)
  const imgs = $('img').toArray()
  for (const el of imgs) {
    const src = $(el).attr('src')
    if (src) {
      const migrated = await migrator.migrate({
        sourceUrl: src,
        collection: ctx.collection,
        slug: ctx.slug,
      })
      if (migrated) $(el).attr('src', migrated.url)
    }
    const srcset = $(el).attr('srcset')
    if (srcset) {
      $(el).attr('srcset', await rewriteSrcset(srcset, ctx, migrator))
    }
  }

  const rewrittenHtml = $.html()
  return sanitizeCmsHtml(rewrittenHtml)
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.richText.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 5: Verify sanitize.ts allows Firebase Storage hostnames**

Read `src/lib/cms/sanitize.ts`. Find the `img` tag's allowed schemes/hosts. Confirm `storage.googleapis.com` and `firebasestorage.googleapis.com` survive sanitization. If they don't, add them to the allowlist (separate commit). The richText tests above mock the migrator's output domain so they pass either way — this manual check guards real imports.

- [ ] **Step 6: Commit**

```bash
git add scripts/import/lib/transform/richText.ts scripts/import/lib/__tests__/transform.richText.test.ts
git commit -m "feat(webflow-import): richText transform — body image rewrite + sanitize"
```

---

## Task 10: Reference transform

**Files:**
- Create: `scripts/import/lib/transform/reference.ts`
- Test: `scripts/import/lib/__tests__/transform.reference.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { transformReference, transformMultiReference } from '../transform/reference'
import { createReferenceMap } from '../referenceMap'

test('single reference resolves via map', () => {
  const map = createReferenceMap()
  map.set('team_members', 'wf_001', 'jane-doe')
  assert.equal(transformReference('wf_001', 'team_members', map), 'jane-doe')
})

test('single reference returns null when unresolved', () => {
  const map = createReferenceMap()
  assert.equal(transformReference('missing', 'team_members', map), null)
})

test('multi reference resolves array', () => {
  const map = createReferenceMap()
  map.set('faq_topics', 'a', 'topic-a')
  map.set('faq_topics', 'b', 'topic-b')
  assert.deepEqual(transformMultiReference(['a', 'b'], 'faq_topics', map), ['topic-a', 'topic-b'])
})

test('multi reference drops unresolved entries', () => {
  const map = createReferenceMap()
  map.set('faq_topics', 'a', 'topic-a')
  assert.deepEqual(transformMultiReference(['a', 'missing'], 'faq_topics', map), ['topic-a'])
})

test('multi reference returns [] for non-array input', () => {
  const map = createReferenceMap()
  assert.deepEqual(transformMultiReference(null, 'x', map), [])
  assert.deepEqual(transformMultiReference('string', 'x', map), [])
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.reference.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `transform/reference.ts`**

```typescript
import type { ReferenceMap } from '../referenceMap'

export function transformReference(
  value: unknown,
  targetCollection: string,
  map: ReferenceMap
): string | null {
  if (typeof value !== 'string' || !value) return null
  return map.resolve(targetCollection, value) ?? null
}

export function transformMultiReference(
  value: unknown,
  targetCollection: string,
  map: ReferenceMap
): string[] {
  if (!Array.isArray(value)) return []
  const out: string[] = []
  for (const v of value) {
    if (typeof v !== 'string') continue
    const resolved = map.resolve(targetCollection, v)
    if (resolved) out.push(resolved)
  }
  return out
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/transform.reference.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/transform/reference.ts scripts/import/lib/__tests__/transform.reference.test.ts
git commit -m "feat(webflow-import): reference + multiReference transforms"
```

---

## Task 11: Report writer

**Files:**
- Create: `scripts/import/lib/report.ts`
- Test: `scripts/import/lib/__tests__/report.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createReport } from '../report'

test('createReport accumulates entries and writes to disk', () => {
  const dir = mkdtempSync(join(tmpdir(), 'report-test-'))
  const report = createReport({ collection: 'team_members', outputDir: dir })
  report.recordSuccess({ webflowId: 'a', slug: 'jane' })
  report.recordSuccess({ webflowId: 'b', slug: 'john' })
  report.recordWarning({ webflowId: 'c', message: 'no image' })
  report.recordFailure({ webflowId: 'd', error: 'sanitize threw' })

  const path = report.write()
  assert.ok(existsSync(path))

  const json = JSON.parse(readFileSync(path, 'utf8'))
  assert.equal(json.collection, 'team_members')
  assert.equal(json.successCount, 2)
  assert.equal(json.warningCount, 1)
  assert.equal(json.failureCount, 1)
  assert.equal(json.successes.length, 2)
})

test('createReport timestamps the filename', () => {
  const dir = mkdtempSync(join(tmpdir(), 'report-test-'))
  const report = createReport({ collection: 'blog_posts', outputDir: dir })
  const path = report.write()
  assert.match(path, /blog_posts-\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/)
})
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/report.test.ts
```

Expected: FAIL

- [ ] **Step 3: Implement `report.ts`**

```typescript
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

export interface ReportSuccess {
  webflowId: string
  slug: string
}

export interface ReportWarning {
  webflowId: string
  message: string
}

export interface ReportFailure {
  webflowId: string
  error: string
}

export interface ImportReport {
  recordSuccess(entry: ReportSuccess): void
  recordWarning(entry: ReportWarning): void
  recordFailure(entry: ReportFailure): void
  write(): string
}

export interface CreateReportOptions {
  collection: string
  outputDir: string
}

function timestampSlug(): string {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
}

export function createReport(opts: CreateReportOptions): ImportReport {
  const successes: ReportSuccess[] = []
  const warnings: ReportWarning[] = []
  const failures: ReportFailure[] = []
  const startedAt = new Date().toISOString()

  return {
    recordSuccess(e) { successes.push(e) },
    recordWarning(e) { warnings.push(e) },
    recordFailure(e) { failures.push(e) },
    write() {
      mkdirSync(opts.outputDir, { recursive: true })
      const path = join(opts.outputDir, `${opts.collection}-${timestampSlug()}.json`)
      writeFileSync(path, JSON.stringify({
        collection: opts.collection,
        startedAt,
        finishedAt: new Date().toISOString(),
        successCount: successes.length,
        warningCount: warnings.length,
        failureCount: failures.length,
        successes,
        warnings,
        failures,
      }, null, 2))
      return path
    },
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/report.test.ts
```

Expected: PASS (2/2 tests)

- [ ] **Step 5: Commit**

```bash
git add scripts/import/lib/report.ts scripts/import/lib/__tests__/report.test.ts
git commit -m "feat(webflow-import): per-run JSON report writer"
```

---

## Task 12: Writer

**Files:**
- Create: `scripts/import/lib/writer.ts`
- Test: `scripts/import/lib/__tests__/writer.test.ts`

The writer wraps `upsertCmsDocument`. In dry-run mode it skips the call and returns a synthetic result.

- [ ] **Step 1: Confirm `upsertCmsDocument` signature**

Read `src/lib/cms/collectionRepository.ts` and find the `upsertCmsDocument` export. The test below assumes:

```typescript
upsertCmsDocument(params: {
  collection: CmsCollectionKey
  slug: string
  data: Record<string, unknown>
  status?: CmsDocumentStatus
  updatedBy?: string
}): Promise<{ slug: string; id: string }>
```

If the real signature differs, **adapt the `UpsertFn` type and the orchestrator wiring in Task 13** — do not change the repository.

- [ ] **Step 2: Write the failing tests**

```typescript
import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createWriter } from '../writer'

test('write calls upsert with normalized payload', async () => {
  const upsert = mock.fn(async () => ({ slug: 'jane', id: 'doc_1' }))
  const writer = createWriter({ upsert })
  const result = await writer.write({
    collection: 'team_members',
    slug: 'jane',
    data: { name: 'Jane', bio: 'Hi' },
  })
  assert.ok(result)
  assert.equal(result!.slug, 'jane')
  assert.equal(upsert.mock.callCount(), 1)
  const args = upsert.mock.calls[0].arguments[0] as { collection: string; slug: string }
  assert.equal(args.collection, 'team_members')
  assert.equal(args.slug, 'jane')
})

test('dry-run skips upsert and returns synthetic result', async () => {
  const upsert = mock.fn()
  const writer = createWriter({ upsert: upsert as never, dryRun: true })
  const result = await writer.write({
    collection: 'team_members',
    slug: 'jane',
    data: { name: 'Jane' },
  })
  assert.ok(result)
  assert.equal(result!.slug, 'jane')
  assert.equal(upsert.mock.callCount(), 0)
})

test('write applies configured defaultStatus when status not provided', async () => {
  const upsert = mock.fn(async () => ({ slug: 's', id: 'i' }))
  const writer = createWriter({ upsert, defaultStatus: 'draft' })
  await writer.write({ collection: 'team_members', slug: 's', data: {} })
  const args = upsert.mock.calls[0].arguments[0] as { status: string }
  assert.equal(args.status, 'draft')
})

test('explicit status on write overrides defaultStatus', async () => {
  const upsert = mock.fn(async () => ({ slug: 's', id: 'i' }))
  const writer = createWriter({ upsert, defaultStatus: 'draft' })
  await writer.write({ collection: 'team_members', slug: 's', data: {}, status: 'published' })
  const args = upsert.mock.calls[0].arguments[0] as { status: string }
  assert.equal(args.status, 'published')
})

test('write propagates upsert errors', async () => {
  const upsert = mock.fn(async () => { throw new Error('firestore down') })
  const writer = createWriter({ upsert })
  await assert.rejects(
    () => writer.write({ collection: 'team_members', slug: 's', data: {} }),
    /firestore down/
  )
})
```

- [ ] **Step 3: Run the tests to verify they fail**

```bash
node --import tsx --test scripts/import/lib/__tests__/writer.test.ts
```

Expected: FAIL

- [ ] **Step 4: Implement `writer.ts`**

```typescript
export type CmsDocStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published'

export interface UpsertParams {
  collection: string
  slug: string
  data: Record<string, unknown>
  status?: CmsDocStatus
  updatedBy?: string
}

export interface UpsertResult {
  slug: string
  id: string
}

export interface UpsertFn {
  (params: UpsertParams): Promise<UpsertResult>
}

export interface WriterOptions {
  upsert: UpsertFn
  dryRun?: boolean
  defaultStatus?: CmsDocStatus
  updatedBy?: string
}

export interface Writer {
  write(params: {
    collection: string
    slug: string
    data: Record<string, unknown>
    status?: CmsDocStatus
  }): Promise<UpsertResult | null>
}

export function createWriter(opts: WriterOptions): Writer {
  const defaultStatus: CmsDocStatus = opts.defaultStatus ?? 'published'
  const updatedBy = opts.updatedBy ?? 'webflow-importer'

  return {
    async write({ collection, slug, data, status }) {
      const effectiveStatus = status ?? defaultStatus
      if (opts.dryRun) {
        return { slug, id: `dry-run-${slug}` }
      }
      return await opts.upsert({
        collection,
        slug,
        data,
        status: effectiveStatus,
        updatedBy,
      })
    },
  }
}
```

- [ ] **Step 5: Run the tests to verify they pass**

```bash
node --import tsx --test scripts/import/lib/__tests__/writer.test.ts
```

Expected: PASS (5/5 tests)

- [ ] **Step 6: Commit**

```bash
git add scripts/import/lib/writer.ts scripts/import/lib/__tests__/writer.test.ts
git commit -m "feat(webflow-import): writer wrapping upsertCmsDocument"
```

---

## Task 13: Orchestrator (CLI entrypoint)

**Files:**
- Create: `scripts/import/index.ts`

Thin CLI: parses flags, builds shared infra, dispatches per-collection. Only `team_members` exists in this plan; others land in Plan 2.

- [ ] **Step 1: Implement `index.ts`**

```typescript
import { resolve } from 'node:path'
import { loadValidatedEnv } from './lib/env'
import { createWebflowClient } from './lib/webflowClient'
import { createReferenceMap } from './lib/referenceMap'
import { createAssetMigrator } from './lib/assetMigrator'
import { createWriter, type CmsDocStatus } from './lib/writer'
import { createReport } from './lib/report'

import { importTeamMembers } from './team_members'

interface CliFlags {
  collection: string | null
  all: boolean
  dryRun: boolean
  status: CmsDocStatus | null
}

function parseFlags(argv: string[]): CliFlags {
  const flags: CliFlags = {
    collection: null,
    all: false,
    dryRun: false,
    status: null,
  }
  for (const arg of argv) {
    if (arg === '--all') flags.all = true
    else if (arg === '--dry-run') flags.dryRun = true
    else if (arg.startsWith('--collection=')) flags.collection = arg.slice('--collection='.length)
    else if (arg.startsWith('--status=')) flags.status = arg.slice('--status='.length) as CmsDocStatus
  }
  return flags
}

const TOPOLOGICAL_ORDER: ReadonlyArray<string> = [
  // Pass 1 — no refs (only team_members implemented in this plan)
  'team_members',
  // Pass 2 (deferred to Plan 2):
  // 'our_customers', 'review_sources', 'faq_topics', 'glossary_terms',
  // 'tools', 'ebooks', 'webinars', 'videos', 'podcasts',
  // 'blog_posts', 'customer_stories', 'customer_reviews', 'faq_questions',
]

async function main(): Promise<void> {
  const flags = parseFlags(process.argv.slice(2))
  if (!flags.collection && !flags.all) {
    process.stderr.write('Usage: webflow:import --collection=<name> [--dry-run] [--status=draft]\n')
    process.stderr.write('   or: webflow:import --all [--dry-run] [--status=draft]\n')
    process.exit(2)
  }

  const env = loadValidatedEnv()
  const webflow = createWebflowClient({ token: env.webflow.token, siteId: env.webflow.siteId })
  const referenceMap = createReferenceMap()

  const { uploadCmsMediaBytes } = await import('../../src/lib/cms/storageUpload')
  const assetMigrator = createAssetMigrator({
    upload: uploadCmsMediaBytes,
    dryRun: flags.dryRun,
  })

  const { upsertCmsDocument } = await import('../../src/lib/cms/collectionRepository')
  const writer = createWriter({
    upsert: upsertCmsDocument as never,
    dryRun: flags.dryRun,
    defaultStatus: flags.status ?? 'published',
  })

  const reportDir = resolve(process.cwd(), 'tmp/import-reports')
  const targets = flags.all ? TOPOLOGICAL_ORDER : [flags.collection!]

  for (const collection of targets) {
    const report = createReport({ collection, outputDir: reportDir })
    process.stdout.write(`\n=== Importing ${collection} ===\n`)
    try {
      if (collection === 'team_members') {
        await importTeamMembers({ webflow, assetMigrator, writer, referenceMap, report })
      } else {
        process.stderr.write(`Unknown collection: ${collection}\n`)
        process.exit(2)
      }
    } catch (err) {
      report.recordFailure({ webflowId: '(orchestrator)', error: (err as Error).message })
      const reportPath = report.write()
      process.stderr.write(`FAILED. Report: ${reportPath}\n`)
      process.exit(1)
    }
    const reportPath = report.write()
    process.stdout.write(`Done. Report: ${reportPath}\n`)
  }
}

main().catch(err => {
  process.stderr.write(`Importer crashed: ${(err as Error).message}\n`)
  process.exit(1)
})
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run typecheck
```

Expected: PASS. (The `as never` cast on `upsertCmsDocument` intentionally relaxes strict signature inference; tighten to a direct cast once Task 12's `UpsertFn` matches the real signature.)

- [ ] **Step 3: Commit**

```bash
git add scripts/import/index.ts
git commit -m "feat(webflow-import): CLI orchestrator with --all/--collection/--dry-run"
```

---

## Task 14: First end-to-end importer — team_members

**Files:**
- Create: `scripts/import/team_members.ts`

Exit criterion for the foundation: a real Webflow → Firestore migration of one collection, end-to-end.

`team_members` chosen because it has no reference fields, one image field, and few items.

- [ ] **Step 1: Confirm the Webflow team_members schema**

Open `tmp/import-reports/discovery.json` (created in Task 4). Find the entry whose `slug` corresponds to the Webflow team members collection. Note:
- The Webflow collection ID
- The Webflow field `slug`s (used in the mapping)
- The image field shape

The example uses placeholder Webflow field slugs (`name`, `slug`, `bio`, `photo`, `linkedin-url`, `title`) — **replace with actual slugs from discovery**.

- [ ] **Step 2: Confirm the Firestore `team_members` collection definition**

Open `src/lib/cms/collectionDefinitions.ts` and find the `team_members` definition. Note the Firestore field keys (e.g. `name`, `bio`, `title`, `photo`, `linkedin_url`). The right-hand side of the data object must use those exact keys.

- [ ] **Step 3: Implement `team_members.ts`**

```typescript
import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import {
  transformDirect,
  transformSlug,
} from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'
import { transformRichText } from './lib/transform/richText'

// Set in .env.local after running discovery — see tmp/import-reports/discovery.json
const WEBFLOW_COLLECTION_ID = process.env.WEBFLOW_TEAM_MEMBERS_COLLECTION_ID ?? ''

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importTeamMembers(ctx: ImportContext): Promise<void> {
  if (!WEBFLOW_COLLECTION_ID) {
    throw new Error('WEBFLOW_TEAM_MEMBERS_COLLECTION_ID env var not set. Find the ID in tmp/import-reports/discovery.json.')
  }

  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} team_members items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      // Webflow field slugs — adjust based on discovery.json
      const name = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? name
      slug = transformSlug(rawSlug)

      const ctxForAssets = { collection: 'team_members', slug }
      const photo = await transformImage(fd['photo'], ctxForAssets, ctx.assetMigrator)
      const bio = await transformRichText(fd['bio'], ctxForAssets, ctx.assetMigrator)

      const data: Record<string, unknown> = {
        name,
        title: transformDirect(fd['title']),
        bio,
        photo,
        linkedin_url: transformDirect(fd['linkedin-url']),
      }

      await ctx.writer.write({
        collection: 'team_members',
        slug,
        data,
      })

      ctx.referenceMap.set('team_members', item.id, slug)
      ctx.report.recordSuccess({ webflowId: item.id, slug })
      process.stdout.write(`    OK  ${slug}\n`)
    } catch (err) {
      ctx.report.recordFailure({ webflowId: item.id, error: (err as Error).message })
      process.stderr.write(`    ERR ${slug || item.id}: ${(err as Error).message}\n`)
    }
  }
}
```

- [ ] **Step 4: Find and set the team_members collection ID**

Open `tmp/import-reports/discovery.json`. Find the `id` for the team_members collection. Add to `.env.local`:

```
WEBFLOW_TEAM_MEMBERS_COLLECTION_ID=<id-from-discovery-json>
```

- [ ] **Step 5: Dry-run the importer**

```bash
npm run webflow:import -- --collection=team_members --dry-run
```

Expected: each item logs `OK  <slug>`. Report file written at `tmp/import-reports/team_members-<ts>.json`. **Zero writes** reach Firestore.

Inspect the report — `successCount` equals the number of Webflow team members; `failureCount` is 0.

If any failures: read the error, fix the mapping or transform, re-run dry-run.

- [ ] **Step 6: Live run against Firestore**

```bash
npm run webflow:import -- --collection=team_members
```

Expected: same per-item log + report. Then open `/admin/cms/team_members` in `next dev` and confirm each migrated team member appears with name, title, bio, photo, LinkedIn URL.

- [ ] **Step 7: Verify on rendered routes**

Hit the public team page (if one exists; otherwise verify in admin). Confirm:
- Photos load from Firebase Storage (URLs include `storage.googleapis.com` or `firebasestorage.googleapis.com`), not Webflow CDN
- Rich-text bodies render with formatting preserved
- No broken images

- [ ] **Step 8: Idempotency check — re-run live**

```bash
npm run webflow:import -- --collection=team_members
```

Expected: each item logs `OK  <slug>` again. Verify the Firestore document count for `team_members` did **not** double — `upsertCmsDocument` matches by slug.

- [ ] **Step 9: Commit**

```bash
git add scripts/import/team_members.ts
git commit -m "feat(webflow-import): first end-to-end importer — team_members"
```

---

## Plan Exit Criteria

All of the following must be true:

- `npm run webflow:test` passes all unit tests across `scripts/import/lib/__tests__/`.
- `npm run webflow:discover` produces a complete `tmp/import-reports/discovery.json` listing every Webflow collection with schema and item counts.
- `npm run webflow:import -- --collection=team_members --dry-run` runs without errors and emits a report file.
- `npm run webflow:import -- --collection=team_members` writes real items to Firestore, and a second run is a no-op (idempotent).
- A migrated team member is visible and correctly rendered in `/admin/cms/team_members`.

**When met:** ready to start Plan 2 (per-collection importers for the remaining 13 collections).

---

## Spec Coverage Notes

Sections of [`2026-05-22-webflow-migration-design.md`](../specs/2026-05-22-webflow-migration-design.md) covered by this plan:

- Architecture (components, lib structure) — Tasks 2–13
- Schema mapping (declarative per-collection module) — Task 14
- Asset migration (assetMigrator + image + rich-text body rewrite) — Tasks 7, 8, 9
- Idempotency (writer + upsertCmsDocument matches by slug) — Tasks 12, 14
- Dry-run support — Tasks 7, 12, 13
- Per-collection JSON report — Task 11
- Rate-limit handling (Webflow 429 retry) — Task 3
- Discovery phase — Task 4

Deferred to later plans:

- Plan 2 — per-collection importers for the other 13 collections
- Plan 3 — rich-text body image sweep on already-imported docs
- Plan 4 — SEO redirects, staging deploy, noindex enforcement
- Plan 5 — cutover runbook + Webflow decom
