# CMS — Firestore + Next.js operations

How the Finanshels CMS stores, serves, secures, and revalidates content.

- **Storage:** Firestore (GCP), accessed only through **Firebase Admin** (server-only).
- **Frontend:** Next.js 15 App Router on Vercel reads documents in Server Components / route handlers.
- **Writes:** all CMS writes go through the server-side repository layer (`src/lib/cms/collectionRepository.ts`). Clients never write to Firestore.

Related docs:

- [cms-field-guide.md](./cms-field-guide.md) — engineer reference: field types, sections, and the merge/strip model.
- [cms/marketing-field-guide.md](./cms/marketing-field-guide.md) — which fields the marketing team fills, per collection.
- [cms/field-inventory.md](./cms/field-inventory.md) — **auto-generated** exact field list per collection.
- [cms/hidden-fields-audit.md](./cms/hidden-fields-audit.md) — what's hidden / dead and what to keep.

---

## Collections

11 collections. The `CmsCollectionKey` union in `src/lib/cms/collectionDefinitions.ts` is the authoritative list.

| Collection | Title field | Public surface | Schema.org |
|---|---|---|---|
| `blog_posts` | `title` | **Dedicated:** `/blog`, `/blog/[slug]` | BlogPosting |
| `glossary_terms` | `term` | **Dedicated:** `/glossary`, `/glossary/[slug]` | DefinedTerm |
| `customer_reviews` | `review_title` | Generic `/content/customer_reviews/[slug]` | Review |
| `customer_stories` | `story_title` | Generic `/content/customer_stories/[slug]` | Article |
| `podcasts` | `episode_title` | Generic `/content/podcasts/[slug]` | PodcastEpisode |
| `faqs` | `question` | Generic `/content/faqs/[slug]` | Question |
| `webinars` | `webinar_title` | Generic `/content/webinars/[slug]` | Event |
| `tools` | `tool_name` | **Admin-only** (no public render) | SoftwareApplication |
| `ebooks` | `ebook_title` | **Admin-only** (no public render) | Book |
| `team_members` | `full_name` | **Admin-only** (no public render) | Person |
| `media_assets` | `title` | **Admin-only** (utility library) | MediaObject |

**Public-surface rules**

- **Document ID = slug** for every collection (predictable URLs, idempotent writes).
- **Dedicated routes** (`blog`, `glossary`) get bespoke SEO-friendly pages and drive their own revalidation via `routePattern` + `listingRoute`.
- **Generic route** `src/app/content/[collection]/[slug]/page.tsx` renders any non-blocklisted collection, **published status only**.
- **Admin-only** collections are in `SENSITIVE_GENERIC_ROUTE_BLOCKLIST` (in that route) — they refuse the generic route to avoid leaking PII (team contact details), raw customer records, gated download URLs, or tool embed code.

### Blog article template ("The Index" editorial system)

`/blog` and `/blog/[slug]` use a bespoke reading layout. **Every reader-facing feature below is _derived at render time_ from existing fields — no CMS field backs them, and none should be added for these.**

| Feature | Derived from | Code |
|---|---|---|
| Reading time (`N min read`) | word count of `body` | `src/lib/cms/readingTime.ts` (`estimateReadingMinutes`, ~220 wpm) |
| Sticky "Index" TOC + heading anchors | `h2`/`h3` in `body` (cheerio injects `id`s, extracts TOC) | `src/lib/cms/articleToc.ts` (`buildArticleToc`, **server-only**) + `components/cms/blog/ArticleToc.tsx` (client, active-section highlight) |
| Reading-progress hairline | scroll position (pure UI) | `components/cms/blog/ReadingProgress.tsx` (client) |
| "The bottom line" summary box | `excerpt` | inline in `app/blog/[slug]/page.tsx` |
| Category pill / breadcrumb | `blog_category` → `blogTaxonomy.ts` labels | `src/lib/cms/blogTaxonomy.ts` (shared by listing + article) |
| Tags row | `blog_tags` | inline |
| Author byline + initials avatar | `author` / `authorName` | `components/cms/blog/AuthorAvatar.tsx` |
| Share (X / LinkedIn / copy link) | `title` + canonical URL | `components/cms/blog/ShareRow.tsx` (client) |
| Section numbering, pull-quotes, captions | CSS only, scoped to `.fin-article` | `src/styles/globals.css` |
| Listing lead story | most-recent post of the current (filtered) set | `LeadStory` in `app/blog/page.tsx` |

- `cheerio` runs **server-side only** — `articleToc.ts` starts with `import 'server-only'`; the TOC type is pulled into the client via `import type` (erased at build). Never import `articleToc.ts` from a `'use client'` file.
- The TOC rail renders only when `buildArticleToc` finds **≥2 headings**; otherwise the article is a single centered column.
- Related posts are intentionally **not** implemented (would add a repository query) — revisit if needed.

---

## Status workflow

Three states, defined once on `globalCoreFields()`:

```
draft → in_review → published
```

- **`published`** is the only status that renders on public routes.
- **`draft` / `in_review`** are admin-preview only.
- Status is **not** set from a form field. It is resolved server-side from the editor header's **Save** (keeps/sets draft) and **Publish** buttons (the `EditorStatusControls` component). Any `status` value posted from the body form is ignored.
- Legacy documents carrying `approved` or `scheduled` are normalized to `in_review` on read (`collectionRepository.ts`). There is no scheduling pipeline.

Roles gate who can publish:

| Role | Read/write | Publish | Manage users | Manage owners |
|---|---|---|---|---|
| owner | yes | yes | yes | yes |
| admin | yes | yes | yes (except owners) | no |
| editor | yes | submits to `in_review` | no | no |
| viewer | read-only | no | no | no |

---

## Revisions

Every save writes a snapshot to the document's `/_revisions` subcollection. Rollback is available in the admin panel. Because the revision trail is written by the repository, **all writes must go through `collectionRepository.ts`** — bypassing it loses history.

---

## Revalidation

Two paths, both server-side:

1. **On save (automatic).** `collectionRepository` reads `routePattern` + `listingRoute` from the collection definition and revalidates the document route, the listing route, `/sitemap.xml`, and `/llms.txt`. No ad-hoc `revalidatePath` calls — set the route on the definition.
2. **External trigger.** `POST /api/revalidate` with `Authorization: Bearer ${REVALIDATE_SECRET}` and `{ "path": "/blog/slug" }` or `{ "paths": [...] }`. Used by publish jobs / GCP functions on Firestore write.

---

## Composite indexes

`firestore.indexes.json` is the single source of truth. When a query throws an "index required" link in dev:

1. Add the index to `firestore.indexes.json`.
2. `npm run firebase:deploy`.
3. Re-run the query.

Do **not** click the console auto-create link — it bypasses source control. Current indexed queries cover `status` + ordering for `blog_posts` and `glossary_terms`.

---

## Scale & cost limits

- **Blog listing** reads the latest **48** posts.
- **Glossary listing** loads up to **200** terms with a client-side filter.
- **Sitemap** paginates Firestore in batches of **300**, `revalidate = 1 hour`.

A collection that grows past these orders of magnitude needs cursor pagination, not a larger page size.

---

## Environment variables

| Var | Purpose |
|---|---|
| `FIREBASE_ADMIN_PROJECT_ID` | GCP project id |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Service account email |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Service account PEM (handled by `normalizePrivateKey`) |
| `CMS_ADMIN_PASSWORD` | Bootstrap owner password (env login) |
| `CMS_ADMIN_SESSION_SECRET` | **Required in production** — HMAC key for the session cookie |
| `CMS_EDITOR_PASSWORD` | Optional legacy editor password |
| `REVALIDATE_SECRET` | Bearer token for `/api/revalidate` |

`FIREBASE_ADMIN_PRIVATE_KEY` arrives mangled in several formats depending on the host. Never parse it by hand — `src/lib/cms/firestore.ts`'s `normalizePrivateKey()` handles multi-line PEM, single-line `\n`, quoted, CRLF, and base64.

---

## Security

- `firestore.rules` **denies all client access** — reads and writes go through Admin SDK server code only. Do not loosen this; route any new read through a Server Component or route handler.
- `firebase-admin` must never reach the client bundle. Any server-only module starts with `import 'server-only'`.
- Service-account JSON never reaches the browser. `REVALIDATE_SECRET` must be long and random; restrict the function invoker to your backend.

---

## Admin panel

- Editor: `/admin/cms` (collection-driven; one editor serves edit `?slug=…` and create `?intent=create`).
- Login: `/admin/login` · Users: `/admin/settings/users` · Profile: `/admin/settings/profile`.
- Every admin route is double-guarded: middleware checks cookie presence; each page still calls `requireAdminAuth()`.

Users live in the `cms_users` Firestore collection with PBKDF2-SHA256 hashes (200k iterations, per-user salt). Cookie sessions store `userId.tokenVersion.hmac` and are invalidated when a password is reset. The system refuses to remove or demote the last active owner.

**Bootstrap a new project:**

1. Set `CMS_ADMIN_PASSWORD` and `CMS_ADMIN_SESSION_SECRET`.
2. Open `/admin/login`, leave email empty, enter the env password → signs in as `Owner (env)`.
3. Invite teammates under `/admin/settings/users`; they change their password under `/admin/settings/profile` after first login.

---

## Page builder & relationships

- **Page blocks** (`page_blocks`): structured JSON page builder. Catalog is `CMS_BLOCK_TYPES` in `collectionDefinitions.ts`; rendering is one branch per type in `src/components/cms/PageBlocksRenderer.tsx`. The two must stay in sync.
- **Relationships:** typed `reference` / `multi_reference` fields declared per collection, plus a reverse-reference ("Where this is used") panel fed by `CMS_INCOMING_REFERENCES` (`src/lib/cms/definitions/incomingReferences.ts`).
- **Schema markup:** each collection has a `defaultSchemaType`; an optional per-document `schema_type_override` (curated per collection) narrows it.
