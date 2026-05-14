# Next.js rules

App Router conventions for this project. Defer to the global `vercel:nextjs` skill for general App Router patterns.

## Mixed JSX + TSX

- Marketing screens (`.jsx`) under `src/screens/` and most `src/app/*/page.jsx`.
- CMS layer is strictly TypeScript (`.tsx`/`.ts`).
- New code must be TypeScript. Don't migrate JSX→TSX speculatively; touch it only when working on it.

## Server Actions

- `next.config.mjs` sets `bodySizeLimit: '32mb'` (raised from default 1MB). Don't lower this — media uploads ride on it.
- Media uploads use the dedicated API route `/api/admin/cms/media/upload`, not a server action. Don't move media to server actions.

## Middleware

`src/middleware.ts` matches `/admin/:path*`. It's a defense-in-depth layer:

- Public admin prefixes (`/admin/login`, `/admin/logout`, `/admin/forgot`, `/admin/reset`) pass through.
- Other admin routes require either `finanshels_admin_v2` (current) or `finanshels_admin` (legacy) cookie.
- **Every admin page MUST still call `requireAdminAuth()`** — middleware only checks cookie presence, not signature.

When adding an admin route:
1. Drop it under `src/app/admin/`.
2. Call `requireAdminAuth()` at the top of the page/layout.
3. Don't add the route to `PUBLIC_ADMIN_PREFIXES` unless it's truly unauthenticated.

## Revalidation

Two paths to revalidation:

1. **CMS save** (most common): `collectionRepository` reads `routePattern` + `listingRoute` from `collectionDefinitions.ts` and calls `revalidatePath` for the doc route, the listing route, `/sitemap.xml`, and `/llms.txt`. **Automatic.**
2. **External trigger** (publish job): `POST /api/revalidate` with `Authorization: Bearer ${REVALIDATE_SECRET}` and JSON `{ "path": "/blog/slug" }` or `{ "paths": [...] }`.

Don't sprinkle `revalidatePath` calls elsewhere. If you need to revalidate from a new place, route it through the repository or `/api/revalidate`.

## Routing

- Generic content detail page: `src/app/content/[collection]/[slug]/page.tsx` — resolves all 15 routed collections.
- Marketing-specific routes (`/blog`, `/glossary`, `/customers`, etc.) live alongside `/content/<collection>` for SEO-friendly URLs.
- `/[...slug]` catch-all is the marketing fallback; check it before adding new top-level routes to avoid collisions.

## SEO surfaces

| Surface | Source |
|---|---|
| `/sitemap.xml` | `src/app/sitemap.ts` — paginates Firestore in batches of 300, revalidate 1h |
| `/llms.txt` | `src/app/llms.txt/` — machine-readable canonical URLs for AI answer engines |
| Per-page metadata | `generateMetadata` on each page; CMS-driven pages pull from `seoTitle`/`seoDescription` |
| JSON-LD | `defaultSchemaType` on the collection definition + optional per-doc `schema_type_override` |

When adding a new routed collection, both `sitemap.ts` and `llms.txt` need to include it — verify both.

## Caching

Current: `revalidatePath`-based. If/when you migrate to Next.js 16 Cache Components:

- Read the `vercel:next-cache-components` skill first.
- The migration is non-trivial because of how the revalidation flow is wired across `collectionRepository` and `/api/revalidate`. Plan it in a spec, not ad-hoc.

## Dev server

- Default: `npm run dev` (webpack).
- Faster HMR: `npm run dev:turbopack`. Some Tiptap / sanitize-html edge cases differ; if you hit a weird import error, fall back to webpack and file an issue.
