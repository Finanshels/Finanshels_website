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
