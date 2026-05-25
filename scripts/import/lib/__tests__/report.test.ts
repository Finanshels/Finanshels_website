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
