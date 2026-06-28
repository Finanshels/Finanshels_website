import { test } from 'node:test'
import assert from 'node:assert/strict'
import { diffExceedsPublished } from '../diff'

test('null snapshot (never published) counts as having changes', () => {
  assert.equal(diffExceedsPublished({ title: 'A' }, null), true)
})

test('identical draft and snapshot -> no changes', () => {
  assert.equal(diffExceedsPublished({ title: 'A', body: 'x' }, { title: 'A', body: 'x' }), false)
})

test('a differing public field -> has changes', () => {
  assert.equal(diffExceedsPublished({ title: 'A' }, { title: 'B' }), true)
})

test('key order does not matter', () => {
  assert.equal(diffExceedsPublished({ a: 1, b: 2 }, { b: 2, a: 1 }), false)
})

test('volatile meta keys are ignored', () => {
  const draft = { title: 'A', updated_at: 2, status: 'published', has_unpublished_changes: true }
  const snap = { title: 'A', updated_at: 1, status: 'draft' }
  assert.equal(diffExceedsPublished(draft, snap), false)
})

test('nested differences are detected', () => {
  assert.equal(diffExceedsPublished({ seo: { title: 'A' } }, { seo: { title: 'B' } }), true)
})

test('array order is significant (genuine content change)', () => {
  assert.equal(diffExceedsPublished({ tags: ['a', 'b'] }, { tags: ['b', 'a'] }), true)
})
