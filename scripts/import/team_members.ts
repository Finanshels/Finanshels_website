import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'
import { transformDirect, transformSlug } from './lib/transform/primitives'
import { transformImage } from './lib/transform/image'
import { transformRichText } from './lib/transform/richText'

const WEBFLOW_COLLECTION_ID = '6478e2307e71b5438f247af1'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importTeamMembers(ctx: ImportContext): Promise<void> {
  const items = await ctx.webflow.listItems(WEBFLOW_COLLECTION_ID)
  process.stdout.write(`  Fetched ${items.length} team_members items\n`)

  for (const item of items) {
    const fd = item.fieldData
    let slug = ''
    try {
      const fullName = transformDirect(fd['name'])
      const rawSlug = fd['slug'] ?? fullName
      slug = transformSlug(rawSlug)

      const assetCtx = { collection: 'team_members', slug }
      const photo = await transformImage(fd['team-member-portrait-picture'], assetCtx, ctx.assetMigrator)
      const fullBio = await transformRichText(fd['team-member-bio'], assetCtx, ctx.assetMigrator)

      const data: Record<string, unknown> = {
        full_name: fullName,
        job_title: transformDirect(fd['team-member-job-title']),
        short_bio: transformDirect(fd['team-member-excerpt']),
        full_bio: fullBio,
        photo,
        email: transformDirect(fd['team-member-email']),
        phone: transformDirect(fd['team-member-phone-number']),
        linkedin_url: transformDirect(fd['team-member-linkedin-link']),
        twitter_url: transformDirect(fd['team-member-twitter-link']),
        website_url: transformDirect(fd['team-member-website']),
        display_on_team_page: true,
        display_as_author: true,
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
