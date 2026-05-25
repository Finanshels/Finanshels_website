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
