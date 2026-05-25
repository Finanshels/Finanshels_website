import { resolve } from 'node:path'
import { loadValidatedEnv } from './lib/env'
import { createWebflowClient } from './lib/webflowClient'
import { createReferenceMap } from './lib/referenceMap'
import { createAssetMigrator, type UploadFn } from './lib/assetMigrator'
import { createWriter, type CmsDocStatus, type UpsertFn } from './lib/writer'
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
  // Pass 1 — no refs (only team_members implemented in Plan 1)
  'team_members',
  // Pass 2 deferred to Plan 2.
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

  // ---- Adapter: uploadCmsMediaBytes → UploadFn ----
  // Real signature: { buffer, originalFilename, slug, contentType } → { url, byteSize }
  // The real fn fixes the object path to cms-media/${slug}${ext}, ignoring collection.
  // To avoid collisions across collections, encode the collection + item-slug into the
  // storage slug (e.g. "team_members/jane/photo"). The real fn still controls extension.
  const { uploadCmsMediaBytes } = await import('../../src/lib/cms/storageUpload')
  const uploadAdapter: UploadFn = async ({ bytes, filename, contentType, collection, slug }) => {
    const baseName = filename.replace(/\.[^.]+$/, '') || 'asset'
    const storageSlug = `${collection}/${slug}/${baseName}`
    const result = await uploadCmsMediaBytes({
      buffer: bytes,
      originalFilename: filename,
      slug: storageSlug,
      contentType,
    })
    return {
      url: result.url,
      storagePath: `cms-media/${storageSlug}`,
      size: result.byteSize,
    }
  }
  const assetMigrator = createAssetMigrator({
    upload: uploadAdapter,
    dryRun: flags.dryRun,
  })

  // ---- Adapter: upsertCmsDocument → UpsertFn ----
  // Real signature: positional (collection, id, payload, updatedBy?) → void
  // The repo reads status from payload.status, so merge it in.
  // Document id == slug per project convention (CLAUDE.md).
  const { upsertCmsDocument } = await import('../../src/lib/cms/collectionRepository')
  const { CMS_COLLECTION_DEFINITION_MAP } = await import('../../src/lib/cms/collectionDefinitions')
  const upsertAdapter: UpsertFn = async ({ collection, slug, data, status, updatedBy }) => {
    if (!CMS_COLLECTION_DEFINITION_MAP[collection as keyof typeof CMS_COLLECTION_DEFINITION_MAP]) {
      throw new Error(`Unknown CMS collection key: ${collection}`)
    }
    const payload = status ? { ...data, status } : data
    await upsertCmsDocument(
      collection as never, // CmsCollectionKey is checked above
      slug,
      payload,
      updatedBy
    )
    return { slug, id: slug }
  }
  const writer = createWriter({
    upsert: upsertAdapter,
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
