import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createWriter, type UpsertParams, type UpsertResult } from '../writer'

test('write calls upsert with normalized payload', async () => {
  const upsert = mock.fn(async (_params: UpsertParams): Promise<UpsertResult> => ({
    slug: 'jane',
    id: 'doc_1',
  }))
  const writer = createWriter({ upsert })
  const result = await writer.write({
    collection: 'team_members',
    slug: 'jane',
    data: { name: 'Jane', bio: 'Hi' },
  })
  assert.ok(result)
  assert.equal(result!.slug, 'jane')
  assert.equal(upsert.mock.callCount(), 1)
  const args = upsert.mock.calls[0]!.arguments[0]
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
  const upsert = mock.fn(async (_params: UpsertParams): Promise<UpsertResult> => ({
    slug: 's',
    id: 'i',
  }))
  const writer = createWriter({ upsert, defaultStatus: 'draft' })
  await writer.write({ collection: 'team_members', slug: 's', data: {} })
  const args = upsert.mock.calls[0]!.arguments[0]
  assert.equal(args.status, 'draft')
})

test('explicit status on write overrides defaultStatus', async () => {
  const upsert = mock.fn(async (_params: UpsertParams): Promise<UpsertResult> => ({
    slug: 's',
    id: 'i',
  }))
  const writer = createWriter({ upsert, defaultStatus: 'draft' })
  await writer.write({ collection: 'team_members', slug: 's', data: {}, status: 'published' })
  const args = upsert.mock.calls[0]!.arguments[0]
  assert.equal(args.status, 'published')
})

test('write propagates upsert errors', async () => {
  const upsert = mock.fn(async (_params: UpsertParams): Promise<UpsertResult> => {
    throw new Error('firestore down')
  })
  const writer = createWriter({ upsert })
  await assert.rejects(
    () => writer.write({ collection: 'team_members', slug: 's', data: {} }),
    /firestore down/,
  )
})
