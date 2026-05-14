// FIX-031: single source of truth for field encoding/decoding.
//
// `stringifyFieldValue` (encode: stored value → string for the form) and
// `parseFieldValue` (decode: form string → stored value) previously lived as
// two separate switch statements in page.tsx and could drift. They now share
// this registry: each field type owns its codec exactly once.
//
// Behavioural fixes folded in:
//   - boolean decode accepts `'TRUE'`, `'YES'`, `'On'` etc. (previously lowercase only)
//   - blocks / json / number / reference decoders throw InvalidFieldValueError
//     on malformed input so the save action can surface a typed error to the
//     editor instead of silently dropping the value (FIX-001).

import type { CmsFieldDefinition, CmsFieldType } from './collectionDefinitions'

export class InvalidFieldValueError extends Error {
  constructor(public readonly fieldName: string, public readonly reason: string) {
    super(`Invalid value for field ${fieldName}: ${reason}`)
    this.name = 'InvalidFieldValueError'
  }
}

type Codec = {
  encode(value: unknown, field: CmsFieldDefinition): string
  decode(raw: string, field: CmsFieldDefinition): unknown
}

const TRUTHY = new Set(['true', '1', 'on', 'yes', 'y'])

const PASS_THROUGH_STRING: Codec = {
  encode: (v) => (v === undefined || v === null ? '' : String(v)),
  decode: (raw) => (raw.trim() ? raw : undefined),
}

/** Pipe-separated row separator. Pick something an editor is unlikely to type in normal prose. */
const ROW_FIELD_SEPARATOR = '|'

const FIELD_CODECS: Record<CmsFieldType, Codec> = {
  text: PASS_THROUGH_STRING,
  textarea: PASS_THROUGH_STRING,
  email: PASS_THROUGH_STRING,
  url: PASS_THROUGH_STRING,
  image: PASS_THROUGH_STRING,
  file: PASS_THROUGH_STRING,
  icon: PASS_THROUGH_STRING,
  select: PASS_THROUGH_STRING,
  datetime: {
    encode: (v) => {
      if (v instanceof Date) return v.toISOString().slice(0, 16)
      if (typeof v === 'string') return v.slice(0, 16)
      return ''
    },
    decode: (raw) => (raw.trim() ? raw : undefined),
  },
  boolean: {
    encode: (v) => {
      if (v === true || v === 1 || v === '1') return 'true'
      if (typeof v === 'string' && TRUTHY.has(v.trim().toLowerCase())) return 'true'
      return 'false'
    },
    // Lowercase normalize so 'TRUE', 'Yes', 'On' all work — previously these
    // were silently coerced to false.
    decode: (raw) => TRUTHY.has(raw.trim().toLowerCase()),
  },
  number: {
    encode: (v) => (v === undefined || v === null ? '' : String(v)),
    decode: (raw, field) => {
      const t = raw.trim()
      if (!t) return undefined
      const n = Number(t)
      if (!Number.isFinite(n)) throw new InvalidFieldValueError(field.name, 'not a finite number')
      return n
    },
  },
  tags: {
    encode: (v) => (Array.isArray(v) ? v.join(', ') : v === undefined || v === null ? '' : String(v)),
    decode: (raw) => (raw.trim() ? raw.split(',').map((x) => x.trim()).filter(Boolean) : undefined),
  },
  json: {
    encode: (v) => (v === undefined || v === null ? '' : JSON.stringify(v, null, 2)),
    decode: (raw, field) => {
      const t = raw.trim()
      if (!t) return undefined
      try {
        return JSON.parse(t)
      } catch {
        throw new InvalidFieldValueError(field.name, 'invalid JSON')
      }
    },
  },
  reference: {
    encode: (v) => (v === undefined || v === null ? '' : String(v)),
    decode: (raw) => {
      const t = raw.trim()
      return t.length > 0 ? t : undefined
    },
  },
  multi_reference: {
    // Encode used only for read-side round-trip (e.g. server-rendered initial
    // value). The save action delivers multi_reference via formData.getAll()
    // and bypasses this codec on the decode path.
    encode: (v) => (Array.isArray(v) ? v.join(', ') : v === undefined || v === null ? '' : String(v)),
    decode: (raw) => raw.split(',').map((x) => x.trim()).filter(Boolean),
  },
  blocks: {
    encode: (v) => {
      if (Array.isArray(v)) return JSON.stringify(v)
      if (typeof v === 'string' && v.trim().startsWith('[')) return v
      return '[]'
    },
    decode: (raw, field) => {
      if (!raw.trim()) return []
      let parsed: unknown
      try {
        parsed = JSON.parse(raw)
      } catch {
        throw new InvalidFieldValueError(field.name, 'invalid JSON for blocks')
      }
      if (!Array.isArray(parsed)) {
        throw new InvalidFieldValueError(field.name, 'blocks must be a JSON array')
      }
      return parsed
    },
  },
  // Structured rows. Editor sees a textarea, one row per line, fields
  // separated by `|`. Backend stores an array of objects keyed by `rowFormat`.
  //
  //   rowFormat: ['title', 'url', 'publisher']
  //   textarea:  "The State of UAE Tax | https://x.com | EY"
  //   stored:    [{ title: 'The State of UAE Tax', url: 'https://x.com', publisher: 'EY' }]
  //
  // Editors with `|` in their content can escape with `\|` (decoded back).
  rows: {
    encode: (v, field) => {
      if (!Array.isArray(v) || !field.rowFormat) return ''
      const keys = field.rowFormat
      return v
        .map((row) => {
          const obj = (row as Record<string, unknown>) ?? {}
          return keys
            .map((k) => String(obj[k] ?? '').replace(/\|/g, '\\|'))
            .join(` ${ROW_FIELD_SEPARATOR} `)
        })
        .join('\n')
    },
    decode: (raw, field) => {
      if (!raw.trim()) return undefined
      if (!field.rowFormat || field.rowFormat.length === 0) {
        throw new InvalidFieldValueError(field.name, 'rowFormat missing on field definition')
      }
      const keys = field.rowFormat
      const rows = raw
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
          // Split on un-escaped `|`, then unescape.
          const parts = line.split(/(?<!\\)\|/).map((p) => p.trim().replace(/\\\|/g, '|'))
          const obj: Record<string, string> = {}
          keys.forEach((key, i) => {
            obj[key] = parts[i] ?? ''
          })
          return obj
        })
      return rows.length > 0 ? rows : undefined
    },
  },
}

export function encodeFieldValue(field: CmsFieldDefinition, value: unknown): string {
  return FIELD_CODECS[field.type].encode(value, field)
}

export function decodeFieldValue(field: CmsFieldDefinition, raw: string): unknown {
  return FIELD_CODECS[field.type].decode(raw, field)
}
