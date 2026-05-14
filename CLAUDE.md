# Finanshels Web — Claude project memory

Marketing site + CMS for [finanshels.com](https://finanshels.com). Next.js 15 App Router on Vercel, Firestore via Firebase Admin.

> Project-specific guidance lives here; cross-project rules come from the **global ECC plugin** (`~/.claude/rules/ecc/`). Do not duplicate global content here.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 15 App Router, React 18 (mixed `.jsx` marketing + `.tsx` CMS) |
| Hosting | Vercel (`vercel.json`) |
| Data | Firestore via `firebase-admin` (server-only) |
| Auth | Custom cookie + HMAC sessions (`src/lib/cms/adminAuth.ts`) |
| Validation | Zod |
| Styling | Tailwind + `@tailwindcss/typography` |
| Editor | Tiptap |
| Email | Resend |

## Where things live

| Area | Entry point | Notes |
|---|---|---|
| CMS definitions (SoT) | [src/lib/cms/collectionDefinitions.ts](src/lib/cms/collectionDefinitions.ts) | 1447 LOC. 15 collections × 9 sections. Read [docs/cms-firestore.md](docs/cms-firestore.md) before editing. |
| Field encode/decode (SoT) | [src/lib/cms/fieldCodec.ts](src/lib/cms/fieldCodec.ts) | Every `CmsFieldType` has exactly one codec. Decode throws `InvalidFieldValueError` on bad input. |
| Firestore client | [src/lib/cms/firestore.ts](src/lib/cms/firestore.ts) | `normalizePrivateKey` handles 5 mangled env formats. |
| Admin auth | [src/lib/cms/adminAuth.ts](src/lib/cms/adminAuth.ts) + [src/middleware.ts](src/middleware.ts) | Cookie HMAC, `tokenVersion` invalidation, PBKDF2-SHA256 200k. |
| Revalidation | [src/app/api/revalidate/route.ts](src/app/api/revalidate/route.ts) | Bearer-auth POST, called from GCP Functions on Firestore write. |
| Page-blocks renderer | [src/components/cms/PageBlocksRenderer.tsx](src/components/cms/PageBlocksRenderer.tsx) | One branch per block type in `CMS_BLOCK_TYPES`. |
| Admin panel | [src/app/admin/cms/](src/app/admin/cms/) | Collection-driven editor; per-type create flow in `/admin/cms/new/`. |
| Routed content | [src/app/content/](src/app/content/) | Generic detail page resolves all 15 collections. |
| Firestore rules | [firestore.rules](firestore.rules) | **Deny all client access.** Reads/writes via Admin SDK only. |

## Read these first when starting CMS work

1. [docs/cms-firestore.md](docs/cms-firestore.md) — collections, indexes, env, security, workflow
2. [docs/cms-field-guide.md](docs/cms-field-guide.md) — every field type
3. [docs/cms/marketing-field-guide.md](docs/cms/marketing-field-guide.md) — marketing-specific
4. [docs/cms-marketing-field-guide.md](docs/cms-marketing-field-guide.md)
5. [.claude/rules/cms.md](.claude/rules/cms.md) — CMS invariants

## Hard invariants

1. **`firebase-admin` MUST stay out of the client bundle.** Any `import` chain reaching browser code breaks the build (precedent: commit c5d6155). Use `import 'server-only'` at the top of any new server-only module.
2. **No client writes to Firestore.** `firestore.rules` denies everything; all CMS writes go through `collectionRepository.ts` server-side.
3. **`collectionDefinitions.ts` is the SoT.** Adding a field type without updating `fieldCodec.ts` is a bug. Adding a block without a renderer branch is a bug.
4. **Per-collection revalidation is automatic** via `routePattern` + `listingRoute` on each definition. Don't add ad-hoc `revalidatePath` calls — set the route on the definition.
5. **Admin routes are double-guarded** — middleware blocks unauthenticated requests; every admin page must still call `requireAdminAuth()`.
6. **`CMS_ADMIN_SESSION_SECRET` is required in production.** The dev fallback throws on `NODE_ENV=production`.

## Conventions

- **FIX-NNN comments** mark tracked fixes (e.g. `// FIX-031:`). When a recurring class of bug is fixed, add a FIX-NNN comment so future Claude doesn't regress it. Grep for existing numbers before assigning.
- **Server Actions body limit is 32MB** (raised from default 1MB for media-adjacent forms). New large-form actions don't need extra config.
- **Statuses**: `draft → in_review → approved → scheduled → published`. Only `published` renders publicly; `draft` is admin-preview-only.
- **Document ID = slug** for routed collections.
- **JS files are .jsx** (legacy marketing pages); **TS files are .tsx/.ts** (CMS + new work). New code should be TypeScript.

## Commands

```bash
npm run dev              # next dev
npm run dev:turbopack    # next dev --turbopack
npm run typecheck        # tsc --noEmit  (run before claiming a TS task is done)
npm run build            # production build
npm run firebase:deploy  # deploy firestore rules + indexes
npm run db:check         # node scripts/check-firestore.mjs
```

## Workflows

| You're doing... | Use |
|---|---|
| Adding a CMS field type | `/cms-field` slash command or `cms-collection-builder` agent |
| Adding a CMS collection | `/cms-collection` |
| Adding a page-builder block | `/cms-block` |
| Pre-deploy check | `/deploy-check` |
| Touching `firestore.rules` | `firestore-rules-reviewer` agent |
| Touching `middleware.ts` / `adminAuth.ts` | `admin-auth-reviewer` agent |
| Any TS change | run `npm run typecheck`; invoke `typescript-reviewer` agent for non-trivial diffs |
| Planning a feature | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` then `docs/superpowers/plans/` |

## Don't do

- Don't add `firebase-admin` imports to files reachable from `'use client'` components.
- Don't write to Firestore from API routes outside `src/lib/cms/*Repository.ts` — repository layer owns writes.
- Don't introduce a new collection without wiring `routePattern` + `listingRoute` (revalidation will silently miss).
- Don't bypass `fieldCodec.ts` with inline `JSON.parse`/`String(...)` on form values; codec owns this.
- Don't commit `.firebaserc` (use `.firebaserc.example`).
- Don't add `console.log` to production paths; logging discipline matters here because admin handles credentials.
