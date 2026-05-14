---
description: Pre-deploy checks — typecheck, build, Firestore rules, env, smoke
allowed-tools: Bash, Read, Grep, Glob
---

# /deploy-check — pre-deploy verification

Run before pushing to `main` (which triggers a Vercel production deploy) or before `npm run firebase:deploy`. Stop on the first failure.

## Checks

### 1. Type safety

```bash
npm run typecheck
```

Must pass with zero errors. `tsc --noEmit` does NOT catch `firebase-admin` client-bundle leaks — see step 2.

### 2. Production build

```bash
npm run build
```

This is the source of truth for client-bundle leaks. If you touched `firebase-admin` adjacent code, this must pass.

Watch for:
- `Module not found: Can't resolve 'fs'` → `firebase-admin` leaked to client. Add `import 'server-only'` or split the file.
- `Type error` that didn't show in typecheck → some Next.js plugins type-check at build time.

### 3. Firestore rules sanity

```bash
grep -n "allow read\|allow write" firestore.rules
```

Every `allow` must be paired with `if false` or a strict admin-only condition. Anything else triggers `firestore-rules-reviewer`.

### 4. Required env vars (production)

For Vercel production, these MUST be set:

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY`
- `CMS_ADMIN_PASSWORD`
- `CMS_ADMIN_SESSION_SECRET` (refuses fallback in production)
- `REVALIDATE_SECRET`

Verify in the Vercel dashboard or:
```bash
vercel env ls production
```

### 5. Firestore indexes

If you changed queries or added a collection, re-deploy indexes:

```bash
npm run firebase:deploy   # deploys firestore:rules,firestore:indexes
```

Don't auto-create indexes via the Firebase console link — they bypass source control.

### 6. SEO surfaces

If you added a new routed collection, both must include it:

```bash
grep -l "<your-new-collection>" src/app/sitemap.ts src/app/llms.txt
```

Should match both files. If not, /cms-collection step 8 was skipped.

### 7. Smoke test (manual)

In dev (`npm run dev`):
1. `/admin/login` — log in
2. Navigate to the changed collection in `/admin/cms`
3. Save a doc → confirm "saved" toast, no error
4. Open the public URL → confirm content renders + JSON-LD present (`view-source` → `<script type="application/ld+json">`)
5. Check `/sitemap.xml` and `/llms.txt` if applicable

### 8. Git hygiene

```bash
git status --short
```

- No `.firebaserc` staged (use `.firebaserc.example`).
- No `.env*` files staged.
- No `firebase-debug.log` staged.

## When all green

You're cleared to merge or deploy. Tag the commit with the FIX-NNN it closes (if any) in the body.
