---
description: Scaffold a new CMS field type end-to-end (definitions + codec + admin form)
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# /cms-field — add a new CMS field type

You are adding a new field type to the Finanshels CMS. The CMS is collection-driven; field types are a closed union. Three files change atomically — miss any one and the system silently breaks.

## Inputs

Ask the user if any of these are unclear:
- **Field type name** (e.g. `color`, `currency`, `date_range`). Lowercase, snake_case.
- **Storage shape** (e.g. `string`, `number`, `{ from: string, to: string }`).
- **Editor UI** (defaults to `<input type="text">`; ask only if it needs something custom).
- **Validation** (required? format constraints?).

## Steps

1. **Read first** to internalize the existing pattern:
   - [src/lib/cms/collectionDefinitions.ts](../../src/lib/cms/collectionDefinitions.ts) — find `CmsFieldType` union (top of file).
   - [src/lib/cms/fieldCodec.ts](../../src/lib/cms/fieldCodec.ts) — see how every existing type encodes/decodes.
   - [.claude/rules/cms.md](../rules/cms.md) — invariants.

2. **Extend the union** in `collectionDefinitions.ts`:
   ```ts
   export type CmsFieldType =
     | 'text'
     | ...
     | '<your-new-type>'
   ```
   If the new type needs extra metadata (like `rowFormat` for `rows`), add an optional field to `CmsFieldDefinition`.

3. **Add a codec** in `fieldCodec.ts`:
   ```ts
   const FIELD_CODECS: Record<CmsFieldType, Codec> = {
     ...
     '<your-new-type>': {
       encode(value, field) { /* stored -> form string */ },
       decode(raw, field) {
         if (!raw.trim()) return undefined
         // validate; throw InvalidFieldValueError(field.name, '...') on bad input
         return parsed
       },
     },
   }
   ```
   **Decode MUST throw** on malformed input. Silently dropping = FIX-001 regression.

4. **Admin form rendering** — if the type needs a non-text UI:
   - Find where existing types render in the admin form (grep for `field.type ===` under `src/app/admin/cms/` and `src/components/cms/admin/`).
   - Add the new branch alongside.

5. **Sanitization** — if the new type stores HTML, plug into `src/lib/cms/sanitize.ts`.

6. **Use it** — add the new field to at least one collection in `collectionDefinitions.ts` so the change is exercised.

7. **Verify**:
   ```bash
   npm run typecheck
   npm run dev
   ```
   Open `/admin/cms`, edit a doc with the new field, save, reload, confirm round-trip.

8. **Document** — append a row to [docs/cms-field-guide.md](../../docs/cms-field-guide.md) describing the type, storage shape, and example value.

9. **FIX-NNN** — if this fixes a recurring bug, grep for the highest `FIX-` number in the codebase and add a `// FIX-<next>:` comment at the codec.

## Don't

- Don't add `JSON.parse(field.value)` inline in admin pages — the codec owns that.
- Don't return `undefined` from `decode` for malformed input — throw `InvalidFieldValueError`.
- Don't widen `CmsFieldDefinition.defaultValue` further; it's `unknown` for a reason.
