// scripts/import/team_members.ts — STUB. Replaced by Task 14.
import type { WebflowClient } from './lib/webflowClient'
import type { AssetMigrator } from './lib/assetMigrator'
import type { Writer } from './lib/writer'
import type { ReferenceMap } from './lib/referenceMap'
import type { ImportReport } from './lib/report'

interface ImportContext {
  webflow: WebflowClient
  assetMigrator: AssetMigrator
  writer: Writer
  referenceMap: ReferenceMap
  report: ImportReport
}

export async function importTeamMembers(_ctx: ImportContext): Promise<void> {
  throw new Error('team_members importer not yet implemented (Task 14)')
}
