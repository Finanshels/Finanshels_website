import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseTool } from '../../cms/schemas/tools'

const RAW = {
  slug: 'vat-calculator',
  status: 'published',
  tool_name: 'UAE VAT Calculator',
  short_description: 'Add or remove 5% VAT in seconds.',
  tool_route_key: 'vat-calculator',
  hub_group: 'Calculators',
  gated: true,
  lead_capture_enabled: true,
  related_services: ['vat'],
  benefits: ['Instant 5% VAT', 'Filing checklist'],
}

test('parses a valid published tool', () => {
  const t = parseTool(RAW, 'vat-calculator')
  assert.ok(t)
  assert.equal(t!.slug, 'vat-calculator')
  assert.equal(t!.toolRouteKey, 'vat-calculator')
  assert.equal(t!.hubGroup, 'Calculators')
  assert.equal(t!.gate, 'soft')
  assert.deepEqual(t!.benefits, ['Instant 5% VAT', 'Filing checklist'])
})

test('gate is "open" when gated is false', () => {
  const t = parseTool({ ...RAW, gated: false }, 'vat-calculator')
  assert.equal(t!.gate, 'open')
})

test('returns null when required fields missing', () => {
  const t = parseTool({ status: 'published' }, 'broken')
  assert.equal(t, null)
})
