# Firebase rules

## Hard invariant: admin SDK is server-only

`firebase-admin` MUST NEVER reach the client bundle. Symptoms when it leaks:

- Build fails with `Module not found: Can't resolve 'fs'` or similar Node-only imports.
- Edge-runtime route fails at deploy.

**Precedent:** commit `c5d6155` — "fix(cms-admin): keep firebase-admin out of the client bundle".

### Prevention

- Any module that imports from `firebase-admin/*` must start with `import 'server-only'` (or be an explicit Server Component / route handler).
- Don't re-export server functions from a barrel file that's also imported by `'use client'` code.
- The Vercel build is the source of truth; `npm run typecheck` will NOT catch a client-bundle leak. Run `npm run build` before claiming a `firebase-admin`-adjacent change is done.

## Firestore rules invariant

`firestore.rules` denies everything by default:

```
match /{document=**} {
  allow read, write: if false;
}
```

**Do not loosen this.** All CMS reads/writes go through the Admin SDK from server code. The only valid edits to `firestore.rules` are tightening (rare) or adding deny patterns for new collections (defense in depth).

If you find yourself wanting to add `allow read` to enable a client read — stop and route that read through a Next.js Route Handler or Server Component instead.

## Env vars

Required server-side:

| Var | Purpose |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | GCP project id |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account private key (PEM) |
| `CMS_ADMIN_PASSWORD` | Bootstrap owner password |
| `CMS_ADMIN_SESSION_SECRET` | **REQUIRED in production** — HMAC key for session cookie |
| `CMS_EDITOR_PASSWORD` | Optional legacy editor password |
| `REVALIDATE_SECRET` | Bearer token for `/api/revalidate` |

### Private key gotchas

`FIREBASE_ADMIN_PRIVATE_KEY` arrives mangled in 5 different ways depending on the host. `src/lib/cms/firestore.ts` has `normalizePrivateKey()` which handles:

- Real multi-line PEM
- Single-line with literal `\n` sequences (most common on Vercel)
- Quoted (single or double)
- CRLF line endings
- Base64-encoded entire PEM

**Don't try to parse the key yourself.** Use `normalizePrivateKey`.

## Indexes

`firestore.indexes.json` is the single source of truth for composite indexes. When a query throws an "index required" link in dev:

1. Add the index to `firestore.indexes.json`.
2. `npm run firebase:deploy`.
3. Re-run the query.

Do not click the auto-create link in the Firebase console — it bypasses source control.

## Cost & limits

- `blog_posts` listing reads latest 48 (Firestore pagination cost).
- Glossary listing loads up to 200 docs with client filter.
- Sitemap paginates in batches of 300 with `revalidate = 1 hour`.

If a new collection grows past these orders of magnitude, add cursor pagination instead of raising the page size.
