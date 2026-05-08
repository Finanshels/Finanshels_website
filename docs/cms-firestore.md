# CMS on GCP + Next.js on Vercel

Content lives in **Firestore** (same project as Firebase or standalone GCP). The marketing site on **Vercel** reads with **Firebase Admin** (server-only). Editors or migration jobs write documents from GCP (Cloud Functions, Dataflow, internal admin on Cloud Run, etc.).

## Collections

### `blog_posts`

- **Document ID** = URL slug (e.g. `uae-corporate-tax-checklist`).
- **Fields** (see `src/lib/cms/schemas/blog.ts`):

| Field           | Type        | Notes                                      |
|----------------|-------------|--------------------------------------------|
| `title`        | string      | Required                                   |
| `slug`         | string      | Should match document ID                   |
| `bodyHtml`     | string      | HTML body content; alias `body`             |
| `excerpt`      | string      | Optional                                   |
| `publishedAt`  | timestamp   | Required for ordering                      |
| `updatedAt`    | timestamp   | Optional                                   |
| `authorName`   | string      | Optional                                   |
| `heroImageUrl` | string      | Optional; any HTTPS URL                    |
| `seoTitle`     | string      | Optional                                   |
| `seoDescription` | string    | Optional                                   |
| `status`       | `draft` \| `published` | Use `published` for live URLs   |

### `glossary_terms`

- **Document ID** = slug.
- **Fields** (`src/lib/cms/schemas/glossary.ts`): `term`, `definition` (HTML or plain text), optional `bodyHtml`, `relatedSlugs`, `updatedAt`, `status`.

## Firestore composite indexes

Create in Firebase console (or `firestore.indexes.json`) when queries fail with an index link:

1. `blog_posts`: `status` ASC, `publishedAt` DESC  
2. `blog_posts`: `status` ASC, `slug` ASC (sitemap pagination)  
3. `glossary_terms`: `status` ASC, `term` ASC  
4. `glossary_terms`: `status` ASC, `slug` ASC  

You can deploy rules + indexes from this repo with Firebase CLI:

```bash
npx firebase login
npx firebase use --add
npx firebase deploy --only firestore:rules,firestore:indexes
```

Repo files:
- `firebase.json`
- `firestore.rules`
- `firestore.indexes.json`
- `.firebaserc.example` (copy to `.firebaserc` locally)

## Vercel environment variables

Copy `.env.example` → `.env.local` for local development.

- `FIREBASE_ADMIN_PROJECT_ID`
- `FIREBASE_ADMIN_CLIENT_EMAIL`
- `FIREBASE_ADMIN_PRIVATE_KEY` — paste full key; replace real newlines with `\n` in the env string if required by your host.

## On-demand revalidation

After a publish job updates Firestore, call:

```http
POST https://<your-domain>/api/revalidate
Authorization: Bearer <REVALIDATE_SECRET>
Content-Type: application/json

{ "path": "/blog/your-slug" }
```

Or `{ "paths": ["/blog/a", "/glossary/b"] }`.

Implement the caller as a **GCP Cloud Function** (2nd gen) triggered by Firestore `onWrite` for `blog_posts/{slug}` and `glossary_terms/{slug}`, filtering to meaningful changes and `status == published`.

## Scale (400+ blogs, 500+ glossary)

- **Blog index**: currently lists the latest **48** posts; extend with cursor pagination or Algolia / Vertex AI Search.  
- **Glossary index**: loads up to **200** terms with client-side filter; add pagination or server-side search for full 500+.  
- **Sitemap**: paginates Firestore reads in batches of 300; `revalidate` on `sitemap.ts` is 1 hour.

## Security

- Never expose service account JSON to the browser.  
- `REVALIDATE_SECRET` must be long random; restrict Function invoker to your backend only.  
- Firestore **rules**: deny client writes to CMS collections; writes only via Admin SDK from trusted GCP services.

## Admin panel for marketing

- Route: `/admin/cms`
- Login route: `/admin/login`
- Settings: `/admin/settings/users` (Admins/Owners), `/admin/settings/profile` (everyone)
- Required env:
  - `CMS_ADMIN_PASSWORD` — bootstrap-only owner password. Sign in once with email
    empty + this password to create real team users.
  - `CMS_EDITOR_PASSWORD` (optional, legacy)
  - `CMS_ADMIN_SESSION_SECRET` (REQUIRED in production — used for cookie HMAC)

### User access management

Real users live in Firestore collection **`cms_users`** with PBKDF2-SHA256 password
hashes (200k iterations, per-user salt). Cookie sessions store `userId.tokenVersion.hmac`
and are invalidated automatically when a password is reset.

Roles (highest → lowest):

| Role   | CMS read/write | Publish/Approve | Manage users          | Manage owners |
|--------|----------------|-----------------|-----------------------|---------------|
| owner  | yes            | yes             | yes                   | yes           |
| admin  | yes            | yes             | yes (except owners)   | no            |
| editor | yes            | submits to `in_review` | no             | no            |
| viewer | read-only      | no              | no                    | no            |

Document fields on `cms_users/{id}`:

- `email` (lowercased), `name`
- `role` (`owner | admin | editor | viewer`)
- `status` (`active | disabled`)
- `passwordHash`, `passwordSalt`, `passwordIterations`
- `tokenVersion` (incremented on password reset to invalidate live sessions)
- `createdAt`, `createdBy`, `updatedAt`, `lastLoginAt`

Bootstrap flow for a new project:

1. Set `CMS_ADMIN_PASSWORD` and `CMS_ADMIN_SESSION_SECRET` in env.
2. Open `/admin/login`, leave email empty, enter the env password → signs in as `Owner (env)`.
3. Go to `/admin/settings/users` and invite each marketing teammate (name, email,
   initial password, role).
4. Hand them the credentials over a secure channel; they should change their
   password under `/admin/settings/profile` after first login.

### Last-owner protection

The system prevents removing or demoting the last active `owner` to avoid lockout.
Owners can only be modified by other owners.

The admin panel is now collection-driven and supports:
- Different field sets per collection (publish + SEO + AEO + GEO)
- Rich text editor (WYSIWYG) for long-form editorial fields
- Collections: `videos`, `our_customers`, `tools`, `review_sources`, `customer_reviews`, `podcasts`,
  `faq_questions`, `faq_topics`, `customer_stories`, `ebooks`, `webinars`, `blog_posts`, `glossary_terms`,
  `team_members`
- Collection-specific templates and route hints (for routed types like blog/glossary)

Webflow parity gap report: `docs/webflow-cms-parity-audit.md`

Revalidation is automatic by collection. Each collection now declares
`routePattern` (detail page) and `listingRoute` (index page) in
`src/lib/cms/collectionDefinitions.ts`, so when a document is saved both routes
are revalidated together with `/sitemap.xml` and `/llms.txt`. Examples:

- `blog_posts` -> `/blog`, `/blog/[slug]`
- `glossary_terms` -> `/glossary`, `/glossary/[slug]`
- `videos` / `tools` / `customers` / `team_members` / etc -> `/<collection>`, `/<collection>/[slug]`

Workflow and governance:
- Statuses: `draft`, `in_review`, `approved`, `scheduled`, `published`
- Scheduling supported via `scheduledAt` timestamp
- Localization fields: `locale`, `localeGroupId`
- Revisions stored per document in `/_revisions` subcollection with admin rollback support

## Universal card / listing / detail / blocks / relations

Every collection definition now ships with five collapsible sections inside
`/admin/cms`:

1. **Card** — universal fields used wherever a content card is rendered
   (`card_title`, `card_description`, `card_image`, `card_icon`, `card_label`,
   `card_cta_label`, `card_cta_link`, `featured`, `sort_order`). This avoids
   the frontend reaching into title/excerpt to invent card copy.
2. **Listing page** — controls the listing template for the collection
   (`listing_hero_title`, `listing_hero_subtitle`, `listing_hero_image`,
   `enable_search`, `enable_filters`, `default_sort`, `items_per_page`,
   `sticky_cta_label`, `sticky_cta_link`).
3. **Detail page** — shared detail-page controls
   (`detail_hero_title`, `detail_hero_subtitle`, `detail_hero_image`,
   `enable_breadcrumbs`, `enable_social_share`, `enable_related_content`,
   `lead_capture_form_id`, `sticky_side_cta_label`, `sticky_side_cta_link`).
4. **Page blocks** — a structured JSON page builder powered by
   `PageBlocksEditor`. Editors choose from a catalog of reusable blocks and
   compose layouts without engineering work. Stored in `page_blocks` as
   ordered JSON, rendered by `src/components/cms/PageBlocksRenderer.tsx`.
5. **Relationships** — typed cross-collection pickers (`related_team_members`,
   `related_customers`, `related_reviews`, etc.) plus a
   **"Where this is used"** reverse-reference panel that lists every other
   document linking to the current item (see
   `listReverseReferences` in `src/lib/cms/collectionRepository.ts`).

### Page builder block catalog

Defined in `CMS_BLOCK_TYPES` (see `collectionDefinitions.ts`):

`hero`, `rich_text`, `cta`, `testimonial`, `faq_accordion`, `stats`,
`logo_wall`, `video_embed`, `tool_embed`, `form`, `download`, `speaker`,
`related_content`, `table`, `timeline`.

Each block declares its own field schema. To add a new block, append an entry
to `CMS_BLOCK_TYPES` and add a renderer branch in
`src/components/cms/PageBlocksRenderer.tsx`.

### Cross-collection relationships

Relationship targets are declared as `reference` / `multiReference` fields on
the source collection and as `IncomingReferenceSpec` entries in
`CMS_INCOMING_REFERENCES` so they show up in the reverse-reference panel.
Built-in relationships:

- Blog posts ↔ Team members (author + co-authors)
- Glossary terms ↔ FAQ questions
- Videos ↔ Team members
- Customer reviews ↔ Our customers
- Customer stories ↔ Our customers + Customer reviews
- FAQ questions ↔ FAQ topics
- Ebooks / Webinars / Videos / Blog posts / Tools ↔ each other via
  `related_content`
- Review sources ↔ Customer reviews

### URL structure

Detail routes for every routed collection live under
`/<collection>/{slug}` and resolve through
`src/app/content/[collection]/[slug]/page.tsx`. Listing routes live at
`/<collection>` (e.g. `/blog`, `/glossary`, `/videos`, `/customers`,
`/tools`, `/team`).

### Schema markup

Each collection has a `defaultSchemaType` (e.g. `Article`, `DefinedTerm`,
`VideoObject`, `FAQPage`, `Person`). The detail template renders JSON-LD
based on that default, with an optional per-document
`schema_type_override`.

### SEO / system decisions

- **Slug strategy** — `slug` is editable per document; document IDs default
  to slug.
- **Schema** — per-collection default + per-document override.
- **Internal linking** — typed relationship fields auto-populate "Related
  content" sections; manual override is always allowed via
  `related_content`.
- **Multi-language** — `locale` and `localeGroupId` are persisted on every
  document.
- **Search** — `enable_search` toggles the listing-page search input;
  Firestore-backed list endpoints support filter + sort via the universal
  listing fields.
- **Taxonomy** — `tags` and `categories` arrays are present on every
  collection.
- **Preview mode** — `status: draft` documents are accessible to authenticated
  CMS users via the admin preview link.
- **Draft/publish workflow** — `draft → in_review → approved → scheduled →
  published`.
- **Author attribution** — `authorName`, `author_team_member` reference, and
  optional `co_authors`.
- **Lead capture hooks** — `lead_capture_form_id`, `download_asset_url`,
  `sticky_cta_*` fields surface in tools, ebooks, webinars, blogs.
- **Analytics** — universal `card_cta_link` / `sticky_cta_link` /
  `lead_capture_form_id` fields make it trivial to wire click and submit
  events at render time.

## SEO / GEO / AEO output

- `/llms.txt` publishes machine-readable canonical URLs for AI systems.
