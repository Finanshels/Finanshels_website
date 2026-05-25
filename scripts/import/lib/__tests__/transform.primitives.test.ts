import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  transformDirect,
  transformSlug,
  transformDate,
  transformBoolean,
  transformNumber,
  transformOption,
} from '../transform/primitives'

test('direct returns string as-is', () => {
  assert.equal(transformDirect('hello'), 'hello')
})

test('direct returns empty string for null/undefined', () => {
  assert.equal(transformDirect(null), '')
  assert.equal(transformDirect(undefined), '')
})

test('slug normalizes via slugifyForCms convention', () => {
  assert.equal(transformSlug('Hello World!'), 'hello-world')
  assert.equal(transformSlug('VAT 101'), 'vat-101')
})

test('slug throws on empty input', () => {
  assert.throws(() => transformSlug(''), /empty/i)
  assert.throws(() => transformSlug(null), /empty/i)
})

test('date parses ISO 8601 string to Date', () => {
  const d = transformDate('2024-03-15T10:30:00Z')
  assert.ok(d instanceof Date)
  assert.equal(d!.toISOString(), '2024-03-15T10:30:00.000Z')
})

test('date returns null for invalid string', () => {
  assert.equal(transformDate('garbage'), null)
  assert.equal(transformDate(null), null)
})

test('boolean coerces truthy/falsy', () => {
  assert.equal(transformBoolean(true), true)
  assert.equal(transformBoolean('true'), true)
  assert.equal(transformBoolean('false'), false)
  assert.equal(transformBoolean(null), false)
  assert.equal(transformBoolean(0), false)
})

test('number parses numeric strings', () => {
  assert.equal(transformNumber(42), 42)
  assert.equal(transformNumber('3.14'), 3.14)
  assert.equal(transformNumber(null), null)
  assert.equal(transformNumber('not a number'), null)
})

test('option looks up via table', () => {
  const table = { wf_opt_1: 'accounting', wf_opt_2: 'tax' }
  assert.equal(transformOption('wf_opt_1', table), 'accounting')
  assert.equal(transformOption('wf_opt_2', table), 'tax')
})

test('option returns null on unknown key', () => {
  const table = { a: 'A' }
  assert.equal(transformOption('unknown', table), null)
})
