import { resolve } from 'node:path'
import { loadValidatedEnv } from './lib/env'
import { createWebflowClient } from './lib/webflowClient'
import { createReferenceMap } from './lib/referenceMap'
import { createAssetMigrator, type UploadFn } from './lib/assetMigrator'
import { createWriter, type CmsDocStatus, type UpsertFn } from './lib/writer'
import { createReport } from './lib/report'

import { importTeamMembers } from './team_members'
import { importOurCustomers } from './our_customers'
import { importGlossaryTerms } from './glossary_terms'
import { importFaqs } from './faqs'
import { importBlogPosts } from './blog_posts'
import { importWebinars } from './webinars'
import { importEbooks } from './ebooks'
import { importPodcasts } from './podcasts'

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
  // Pass 1 — no cross-collection refs
  'team_members',
  'our_customers',
  'glossary_terms',
  'faqs',
  'webinars',
  'ebooks',
  'podcasts',
  // Pass 2 — depend on Pass 1 collections
  'blog_posts',
  // To be added:
  // 'review_sources', 'tools', 'videos',
  // 'customer_stories', 'customer_reviews',
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
    // Extract the actual object path (with extension) from the Firebase Storage
    // download URL: https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<encoded-path>?...
    let storagePath = `cms-media/${storageSlug}`
    try {
      const afterO = new URL(result.url).pathname.split('/o/')[1]
      if (afterO) storagePath = decodeURIComponent(afterO)
    } catch {
      // Fall back to extensionless path if URL parsing fails.
    }
    return {
      url: result.url,
      storagePath,
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
    // Always include `slug` in the document payload alongside it being the doc id.
    // The admin form reads the slug field from the document data; without this,
    // the editor's Slug input renders empty even though the doc id is correct.
    const payload = status ? { ...data, slug, status } : { ...data, slug }
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
      } else if (collection === 'our_customers') {
        await importOurCustomers({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'glossary_terms') {
        await importGlossaryTerms({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'faqs') {
        await importFaqs({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'blog_posts') {
        await importBlogPosts({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'webinars') {
        await importWebinars({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'ebooks') {
        await importEbooks({ webflow, assetMigrator, writer, referenceMap, report })
      } else if (collection === 'podcasts') {
        await importPodcasts({ webflow, assetMigrator, writer, referenceMap, report })
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
