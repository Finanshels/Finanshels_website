# CMS field guide (admin)

This describes what each **section** of the CMS editor controls, how fields are typed, and what gets stored in Firestore. Source of truth for field lists: `src/lib/cms/collectionDefinitions.ts` (merged definitions) and `getAllFields()`.

Related: operational setup in [CMS on GCP + Next.js](./cms-firestore.md).

---

## Sections (tabs / panels)

| Section | Purpose |
|--------|---------|
| **Main editor** | Identity (canonical title field + URL slug where applicable) plus long-form content: excerpts, bodies, definitions, blocks. Slug follows the title on **new** documents until you edit the slug manually. |
| **Publish** (sidebar) | Scheduling, workflow status (draft/published/…), references to other collections, tags, numbers, short text, feature flags, and collection-specific metadata. |
| **Card** | Overrides for **listing cards** (title, description, image, icon, CTA). If empty, the site falls back to main title / excerpt / featured image. |
| **Listing** | How this type appears on **index pages**: search, sort, layout, pagination. |
| **Detail** | **Detail page chrome**: breadcrumbs, related content, share row, template variant. |
| **Blocks** | Structured `page_blocks` JSON for page-builder sections (hero, stats, FAQ, etc.). |
| **Relations** | Auto-generated **outbound** links to other collections (per content model). |
| **SEO** | Meta title, description, canonical, Open Graph, robots, schema type hints. |
| **AEO** | “Answer engine” extras: direct answer, FAQ JSON, HowTo steps, speakable text. |
| **GEO** | Generative-search signals: citations, statistics JSON, expert quotes, related entities. |

### Creating new documents

Clicking **+ New …** opens a focused per-type page at `/admin/cms/new/[collection]` that asks only for the essentials needed to ship a draft of that content type. The full editor (sections, SEO, AEO, GEO, blocks) opens automatically after Save. The mapping of essentials per collection lives in `src/lib/cms/createProfiles.ts`; Blog posts and Customer stories also offer optional starter templates on the create page.

---

## Field types (format → stored value)

| Type | UI | Stored in Firestore |
|------|----|---------------------|
| `text` | Single-line input | string |
| `textarea` | Plain textarea, or **rich text** (Tiptap) when the field is the main body (name contains `body`, `content`, etc.) | string (HTML for rich text) |
| `number` | number input | number |
| `boolean` | Checkbox (“Enabled”) | boolean |
| `datetime` | `datetime-local` | string (ISO slice) / normalized timestamp on save |
| `email` | email input | string |
| `url` / `image` / `file` | URL input; image/file may show **datalist** suggestions from Media | string (URL) |
| `icon` | Text input | string — **Lucide** icon name in kebab-case (e.g. `arrow-right`) **or** a full `https://` image URL |
| `tags` | Comma-separated text | array of strings (split on save) |
| `select` | Dropdown | string |
| `json` | Textarea (monospace) | parsed JSON object/array or dropped if invalid |
| `reference` | Dropdown of **document IDs** from the target collection (label = title field) | string (referenced document id) |
| `multi_reference` | Searchable checkbox list | array of string ids |
| `blocks` | Visual block editor | JSON array of block objects |

### Icons and card images

- **Card image** (`image`): always a direct **https** URL. Prefer your CDN or a Media asset URL.
- **Card icon** (`icon`): either a **Lucide** key (see [Lucide icon search](https://lucide.dev/icons/)) or an image URL if you need a custom asset.

---

## Blog posts (`blog_posts`) — trimmed fields

Global core fields that duplicated blog-specific or server-managed data are **hidden** in the Publish form for blog posts only:

- `updated_at`, `published_at` — use **`publish_date`** for editors; the API still sets `updatedAt` / resolves `publishedAt` from `publish_date` where needed.
- `categories`, `tags` — use **`blog_category`** and **`blog_tags`** instead.
- `short_description` — use **`excerpt`**.
- `related_content` — use **`related_posts`** (multi-reference).

---

## Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| Author dropdown only shows “Select reference” | No `team_members` documents, Firestore not configured locally, or query needed a fallback (the admin now retries without `orderBy`). Add at least one team member with **`full_name`** (or legacy `name`). |
| Save seems to do nothing | After save, look for the **Saved · cache refreshed** pill in the **top bar** next to Save; errors show there and in a red banner above the form body. |
| Slug does not follow title | Slug auto-sync applies only when **creating** a new item (`+ New …`). Editing an existing doc keeps the slug until you change it. |

---

## Code map

| Concern | File |
|--------|------|
| Merged fields & sections | `src/lib/cms/collectionDefinitions.ts` |
| Admin layout & save | `src/app/admin/cms/page.tsx` |
| Title ↔ slug (client) | `src/components/cms/admin/CmsTitleSlugFields.tsx`, `src/lib/cms/slugify.ts` |
| Rich text toolbar | `src/components/cms/admin/RichTextField.tsx` |
| Listing reference options | `src/lib/cms/collectionRepository.ts` → `listReferenceOptions` |
