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
