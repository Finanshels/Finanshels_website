# CMS hidden & dead field audit

Action list for deciding which CMS fields to **remove** vs **keep**. Derived from the live `src/lib/cms/collectionDefinitions.ts` and a reader-grep across `src/**`.

How a field disappears from an editor:

- **`strip`** — `HIDDEN_FIELDS_BY_COLLECTION[key].strip` removes a globally-defined field from one collection (it stays live in others).
- **`legacyAliases`** — old field names kept only to suppress pre-migration document keys; never rendered.
- **suppressed section** — `SUPPRESSED_SECTIONS_BY_COLLECTION[key]` drops a whole section.

Re-derive any number here with `npx tsx scripts/gen-field-inventory.mts` (→ [field-inventory.md](./field-inventory.md)).

---

## TL;DR

| Bucket | Count | Verdict |
|---|---|---|
| **Dead layout fields** (visible, 0 readers) | 6 fields × 10 collections = 60 inputs | **REMOVE globally** |
| **Hidden-by-strip** fields | per-collection | **KEEP** (live in other collections / server-managed) |
| **Legacy aliases** | ~30 names | **REMOVE-eligible** once old-doc migration is confirmed |
| **Suppressed sections** | blog, glossary, team, media | **KEEP** (intentional) |

There are **no globally-dead hidden fields left** — the blog (and in-progress glossary) trims already deleted those. The remaining win is the opposite of hidden: **dead fields that are still visible.**

---

## A. Dead layout fields — REMOVE (highest impact)

`globalContentLayoutFields()` injects 7 fields into every collection. Six of them have **zero readers** anywhere in `src/**` (no renderer, schema, or listing consumes them), yet they show in **10 of 12** editors:

| Field | Readers | Collections showing it | Verdict |
|---|---|---|---|
| `hero_heading` | 0 | 10 | **Remove** |
| `hero_subheading` | 0 | 10 | **Remove** |
| `sidebar_cta_enabled` | 0 | 10 | **Remove** |
| `primary_cta_variant` | 0 | 10 | **Remove** |
| `template_variant` | 0 | 10 | **Remove** |
| `sections` ("legacy JSON") | 0 | 10 | **Remove** (superseded by the Blocks tab) |
| `body` | many | 10 | **Keep** (the article/long-form body) |

Originally showing in all 10: `media_assets`, `glossary_terms`, `our_customers`, `tools`, `customer_reviews`, `podcasts`, `faqs`, `customer_stories`, `ebooks`, `webinars`. (`blog_posts` and `team_members` already strip/suppress them — they're the clean reference.) Since the 2026-06-28 per-collection trims (`customer_stories`, `podcasts`, `faqs`, `ebooks`, …) several now strip the layout block locally; `tools` and `webinars` are the remaining untrimmed editors.

**Mechanism — one change cleans all 10:** delete the six fields from `globalContentLayoutFields()` in `collectionDefinitions.ts`, keeping `body`. No reader breaks (0 readers). Then `PROFILE_LAYOUT_STRIP` and the per-collection strips that list these names can be slimmed. Existing Firestore values are simply never shown again (no migration).

---

## B. Hidden-by-strip fields — KEEP

Every field hidden by a `strip` list is hidden **contextually** — it's still live in at least one other collection, or it's server-managed. Deleting the global field would break the collections that still use it. Examples:

| Hidden in | Field | Why hidden | Still used by |
|---|---|---|---|
| blog, customers, reviews, podcasts, ebooks, webinars, faqs, team, media | `categories`, `tags` | replaced by a typed field (`blog_category`, `expertise_tags`, …) | collections that keep the generic taxonomy |
| most collections | `published_at`, `updated_at` | server-managed timestamps | resolved on save |
| blog, team, media, … | `thumbnail_image`, `icon` | no thumbnail/icon concept there | glossary, customer_stories, tools |
| blog | `cta_label`, `cta_link` | CTAs come from the CTA page-block | ebooks, webinars (publish CTA) |

**Verdict: keep.** No action — these are working as intended.

> Note: `podcasts` defines `thumbnail_image` in its own publish override **and** lists it in `strip`, so the thumbnail is currently hidden there. If podcasts should have a thumbnail, remove `thumbnail_image` from the podcasts strip list. (Low priority.)

---

## C. Legacy aliases — REMOVE-eligible after a migration check

Never rendered; they exist only to suppress old camelCase keys on pre-migration documents. Safe to delete **once you confirm no live Firestore docs still carry them** (a one-off scan). Current set:

| Collection | Legacy aliases |
|---|---|
| blog_posts | `authorName`, `heroImageUrl`, `bodyHtml`, `category` |
| glossary_terms | `definition`, `bodyHtml`, `relatedSlugs` |
| our_customers | `companyName`, `logoUrl` |
| tools | `name`, `description`, `toolUrl`, `iconUrl` |
| customer_reviews | `title`, `quote`, `reviewerName`, `reviewerRole`, `companyName` |
| podcasts | `title`, `summary`, `audioUrl`, `platformUrls` |
| customer_stories | `title`, `companyName`, `challenge`, `solution`, `results` |
| ebooks | `title`, `summary`, `downloadUrl`, `coverImageUrl` |
| webinars | `title`, `registrationUrl`, `hostName`, `speakers` |
| team_members | `name`, `role`, `bio`, `photoUrl`, `linkedinUrl`, `twitterUrl` |

Some are still used as **read fallbacks** by the parse functions (e.g. `bodyHtml`/`authorName`/`heroImageUrl` in `schemas/blog.ts`). Don't remove those from the schemas — only from the `legacyAliases` strip lists, and only after the migration scan.

---

## D. In-progress / inconsistent state — FIX

1. **`glossary_terms` is mid-trim and currently broken.** Its real fields (`definition_full`, `alphabet_letter`, `synonyms`, `example_usage`, `applicability_region`, `featured`) have been removed from the editor, but the **dead layout bloat (Section A) and global noise are still showing**, and Card/Listing/Detail/Blocks/Relations/GEO are now suppressed. Either the trim needs finishing (add the bloat to its strip list) or `definition_full` needs restoring if editors still need it. **Verify against intent.**
2. **`media_assets` shows article fields.** A file-library asset currently renders `body`, `hero_heading`, `hero_subheading`, `sections`, `sidebar_cta_enabled`, `primary_cta_variant`, `template_variant`. Removing the dead fields (Section A) fixes most of it; `body` should also be stripped for `media_assets`.
3. ~~**Required-but-stripped (verify):** `ebooks` lists `short_description` as required in its override but also strips it.~~ ✅ Resolved (ebook-trim 2026-06-28): the inline `short_description` override was deleted, so the field is no longer defined — no required-but-hidden field remains. (For the record, the strip filter already removed it from `getAllFields`, so the save action never enforced it.)

---

## Per-collection summary

| Collection | Suppressed sections | Status |
|---|---|---|
| `blog_posts` | card, listing, detail | ✅ Clean (reference) |
| `team_members` | card, listing, detail, blocks, relations, seo, aeo, geo | ✅ Clean (reference) |
| `customer_stories` | card, listing, detail, aeo, geo | ✅ Trimmed — publish carries only the case-study fields; renderer wired to display them |
| `customer_reviews` | card, listing, detail, blocks, relations, seo, aeo, geo | ✅ Clean (embedded-only; blocklisted from `/content`) |
| `glossary_terms` | card, listing, detail, blocks, relations, geo | ⚠️ Mid-trim — see D.1 |
| `media_assets` | card, listing, detail, blocks, relations, seo, aeo, geo | ⚠️ Shows article fields — see D.2 |
| `ebooks` | card, listing, detail, blocks, aeo, geo | ✅ Trimmed — lead-magnet catalog; publish keeps the 8 catalog fields + Authors (relations) + the SEO tab. Public gated landing page (`/guides/[slug]`) planned so the SEO metadata renders. |
| `podcasts` | card, listing, detail, aeo, geo | ✅ Trimmed — publish keeps the 17 episode fields; relations deduped to `relatedPodcastRefs`. `/podcasts` hub + episode renderer (player/show-notes/transcript) wired. |
| `tools`, `webinars` | none | 🟡 Show dead layout fields (Section A) |

> `our_customers` was removed entirely (now 11 collections). This audit is a snapshot — several collections are being actively trimmed; regenerate `field-inventory.md` after the build compiles to refresh exact field lists.

---

## Recommended order of action

1. **Remove the 6 dead layout fields** from `globalContentLayoutFields()` (Section A) — biggest cleanup, zero risk.
2. **Strip `body` for `media_assets`** (Section D.2).
3. **Finish the glossary trim** (Section D.1).
4. ~~**Verify** the ebooks required-but-stripped case (Section D.3).~~ ✅ Done — ebooks trimmed (ebook-trim 2026-06-28).
5. **Scan Firestore** for legacy-alias keys, then prune the `legacyAliases` lists (Section C).
