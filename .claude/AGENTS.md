# Agents & skills for this project

Use the global ECC agents/skills. This file lists which ones matter most for finanshels_web and **when to invoke them**.

## Always-on for this codebase

| Trigger | Agent / skill | Why |
|---|---|---|
| Any `.ts`/`.tsx` change | `typescript-reviewer` | Mixed `.jsx`/`.tsx` codebase; strict TS only in CMS layer. |
| Any change to `firestore.rules` | `firestore-rules-reviewer` (this repo) | Invariant: deny client, admin-only. |
| Any change to `src/middleware.ts` or `src/lib/cms/adminAuth.ts` | `admin-auth-reviewer` (this repo) | Cookie HMAC + tokenVersion invalidation is subtle. |
| Any change to `collectionDefinitions.ts` | `cms-collection-builder` (this repo) | Must update `fieldCodec.ts` and possibly `PageBlocksRenderer.tsx` together. |
| Build fails | `ecc:build-fix` | Often a `firebase-admin` leak into client bundle. |
| Pre-commit on security-sensitive files | `security-reviewer` | Auth, env handling, Firestore rules. |
| Any UI change to admin panel | `vercel:react-best-practices` + Playwright via `e2e-runner` | Admin routes are double-guarded; can't be tested from anonymous browser. |

## Skills worth knowing

| Skill | Use for |
|---|---|
| `vercel:nextjs` | App Router patterns, Server Actions, middleware, revalidation |
| `vercel:next-cache-components` | If/when you migrate from `revalidatePath` to cache tags |
| `vercel:routing-middleware` | Reasoning about the admin middleware matcher |
| `vercel:env-vars` | Firebase Admin env var quirks |
| `ecc:nextjs-turbopack` | `npm run dev:turbopack` issues |
| `ecc:frontend-design-direction` | Marketing page redesigns |
| `superpowers:test-driven-development` | New CMS features |
| `superpowers:writing-plans` | After a spec in `docs/superpowers/specs/` |
| `superpowers:executing-plans` | Driving plans in `docs/superpowers/plans/` |
| `ecc:documentation-lookup` (Context7) | When in doubt on Next.js / firebase-admin / Tiptap APIs |

## Anti-patterns to flag

When you see these in a diff, escalate to the matching reviewer:

- `import 'firebase-admin'` in any file reachable from a `'use client'` component → **build-fix + typescript-reviewer**
- Direct `getFirestore().collection(...)` outside `src/lib/cms/*Repository.ts` → **code-reviewer** (repository layer owns writes)
- New admin route without `requireAdminAuth()` → **admin-auth-reviewer**
- `firestore.rules` granting any `allow read|write` without `if false` → **firestore-rules-reviewer**
- Inline `JSON.parse` on form values instead of `parseFieldValue` → **typescript-reviewer**
- New collection without `routePattern` / `listingRoute` → **cms-collection-builder**
- `revalidatePath` outside the `/api/revalidate` route or `collectionRepository.ts` → **code-reviewer**

## Parallelism guidance

For non-trivial CMS work, run these in parallel:

1. `cms-collection-builder` (correctness against the pattern)
2. `typescript-reviewer` (type safety)
3. `security-reviewer` (if touching auth, env, or user input)

Aggregate findings, fix CRITICAL/HIGH, then `npm run typecheck && npm run build`.
