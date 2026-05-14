# CMS Field Guide — Marketing Team Reference

This document covers every content type, every field in each tab, what it does, and whether marketing needs to touch it. Use the **Priority** column to decide what to hide or remove from the editor.

**Priority key:**
- ✅ **Essential** — required or commonly filled on every piece of content
- 🟡 **Useful** — fills in optional but visible details (images, tags, CTAs)
- 🔵 **Advanced** — SEO/technical work; a specialist can own these
- ❌ **Hide** — developer-only, auto-managed, or legacy noise

---

## Sections overview (tabs in the editor)

| Tab | What it controls | Who should use it |
|-----|-----------------|-------------------|
| **Publish** | Core content: title, body, dates, author, status | Marketing (daily) |
| **Card** | How the item looks in listing grids (title/image overrides) | Marketing (occasionally) |
| **SEO** | Meta title, description, OG image, robots | SEO specialist |
| **AEO** | Answer-engine / AI search snippets (FAQ JSON, HowTo steps) | SEO specialist |
| **GEO** | Generative search signals: citations, expert quotes, stats JSON | SEO specialist |
| **Listing** | Index-page layout, filters, pagination, sticky CTA | Developer / once per collection |
| **Detail** | Breadcrumbs, related content, social share toggles | Developer / once per collection |
| **Blocks** | Page-builder sections (Hero, Stats, FAQ, CTA, etc.) | Developer / landing-page builder |
| **Relations** | Cross-links to other collections (auto-populated) | Read-only for marketing |

**Recommendation:** Listing, Detail, Blocks, Relations, AEO, and GEO can be **collapsed or hidden** for the marketing team view — they are set once by a developer or SEO lead and rarely touched per-article.

---

## 1. Blog Posts

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Title | Headline of the article shown on page and in search | ✅ Essential |
| Slug | URL path after `/blog/` — auto-fills from title on new posts | ✅ Essential |
| Status | `draft` while writing, `published` to go live | ✅ Essential |
| Excerpt | 1–2 sentence summary used in listing cards and SEO snippet | ✅ Essential |
| Body | Full article content (rich text editor) | ✅ Essential |
| Author | Dropdown to team member who wrote it | ✅ Essential |
| Publish date | Date/time the article goes live | ✅ Essential |
| Blog category | Primary topic bucket (e.g. "Accounting", "Compliance") | ✅ Essential |
| Featured image | Hero image at the top of the article and on social share | ✅ Essential |
| Language | `en` or `ar` — which language version this is | ✅ Essential |
| Blog tags | Comma-separated topic tags for filtering | 🟡 Useful |
| Featured post | Tick to pin/highlight this post on the blog homepage | 🟡 Useful |
| CTA label | Button text for the in-article call-to-action | 🟡 Useful |
| CTA link | URL for the in-article call-to-action button | 🟡 Useful |
| Related posts | Manually pick 2–3 articles to show at the bottom | 🟡 Useful |
| TOC enabled | Show a table-of-contents sidebar (tick/untick) | 🟡 Useful |
| Reading time | Estimated read time in minutes (can leave blank — auto-calculated) | 🟡 Useful |
| Thumbnail image | Smaller image for compact card views (falls back to featured image) | 🟡 Useful |
| Lead magnet CTA | JSON blob for a gated-content download prompt mid-article | ❌ Hide (developer) |
| Icon | Lucide icon name — rarely used on blog posts | ❌ Hide |
| Sort order | Manual number for custom ordering — not used on blog | ❌ Hide |

---

## 2. Glossary Terms

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/glossary/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Term | The word or phrase being defined (e.g. "Accounts Payable") | ✅ Essential |
| Definition short | 1–2 sentence plain-language definition for cards and snippets | ✅ Essential |
| Definition full | Full explanation (rich text) shown on the term page | ✅ Essential |
| Term category | Topic group (e.g. "Tax", "Payroll") | ✅ Essential |
| Alphabet letter | Single letter (A–Z) for alphabetical index navigation | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Synonyms | Other names for the same term (improves search) | 🟡 Useful |
| Related terms | Link to other glossary terms for "See also" section | 🟡 Useful |
| Related FAQs | Link FAQ questions that relate to this term | 🟡 Useful |
| Example usage | A sentence showing the term used in context | 🟡 Useful |
| Applicability region | e.g. "UAE", "Saudi Arabia" — where this term applies | 🟡 Useful |
| Featured | Tick to show on the glossary homepage highlights | 🟡 Useful |
| Featured image | Image for the term detail page header | 🟡 Useful |
| Icon | Lucide icon — rarely used | ❌ Hide |
| Sort order | Manual ordering number | ❌ Hide |

---

## 3. Videos

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/videos/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Title | Video title displayed on the page | ✅ Essential |
| Video platform | YouTube / Vimeo / Wistia / self-hosted | ✅ Essential |
| Video URL | Full link to the video | ✅ Essential |
| Thumbnail image | Preview image shown before play and in listing cards | ✅ Essential |
| Video category | Topic group (e.g. "Tutorial", "Webinar Replay") | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Duration | e.g. "12:34" — shown on the card | 🟡 Useful |
| Summary | Short description shown below the video | 🟡 Useful |
| Speaker | Team member who appears in the video | 🟡 Useful |
| Key takeaways | Bullet list of points (JSON array of strings) | 🟡 Useful |
| CTA link | Button link shown under the video | 🟡 Useful |
| Related resources | Blog posts to suggest alongside the video | 🟡 Useful |
| Excerpt | Short summary for cards | 🟡 Useful |
| Embed code | Paste custom embed HTML — use only if Video URL alone doesn't work | 🔵 Advanced |
| Transcript | Full transcript text (long, SEO value) | 🔵 Advanced |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 4. Our Customers

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/customers/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Company name | The customer's company name | ✅ Essential |
| Logo | Company logo image (used on trust sections site-wide) | ✅ Essential |
| Relationship type | `customer`, `partner`, or `featured_customer` | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Industry | e.g. "Retail", "Technology" — for filtering | 🟡 Useful |
| Company size | e.g. "50–200 employees" | 🟡 Useful |
| HQ location | City/country | 🟡 Useful |
| Region | Tags like "UAE", "KSA" for regional filtering | 🟡 Useful |
| Service used | Which Finanshels services they use | 🟡 Useful |
| Summary | A short paragraph about the customer relationship | 🟡 Useful |
| Cover image | Large background image for the customer profile page | 🟡 Useful |
| Is featured | Tick to highlight in logo walls | 🟡 Useful |
| Testimonial reference | Link to their customer review record | 🟡 Useful |
| Story reference | Link to their customer story record | 🟡 Useful |
| Website URL | Their company website | 🟡 Useful |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 5. Tools

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/tools/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Tool name | Display name of the tool | ✅ Essential |
| Tool type | calculator / checker / estimator / generator / quiz | ✅ Essential |
| Short description | 1–2 sentences shown on listing cards | ✅ Essential |
| Tool embed type | How it's embedded (custom component / iframe / script) | ✅ Essential (set by dev) |
| Tool route key | Internal code key identifying the tool component | ✅ Essential (set by dev) |
| Language | en / ar | ✅ Essential |
| Hero image | Image for the tool page header | 🟡 Useful |
| Icon | Icon for the card | 🟡 Useful |
| Full description | Longer explanation on the tool detail page | 🟡 Useful |
| Output description | What result the tool produces | 🟡 Useful |
| Benefits | List of bullet points (JSON array) | 🟡 Useful |
| Related services | Tags for Finanshels services this tool relates to | 🟡 Useful |
| Gated | Tick if users must submit a form to use the tool | 🟡 Useful |
| Lead capture enabled | Tick to show a lead form on the tool page | 🟡 Useful |
| FAQ items | Link FAQ questions shown on the tool page | 🟡 Useful |
| Tool embed code | Raw HTML/JS embed — for developer use | ❌ Hide (developer) |
| Primary inputs | JSON config describing the tool's input fields | ❌ Hide (developer) |
| Sort order | Manual ordering | ❌ Hide |

---

## 6. Customer Reviews

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/reviews/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Customer name | Full name of the reviewer | ✅ Essential |
| Review text | The actual quote/testimonial | ✅ Essential |
| Approved for publication | Must be ticked before the review can go live | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Customer designation | Job title (e.g. "CFO at Acme") | 🟡 Useful |
| Company | Link to the Our Customers record | 🟡 Useful |
| Review source | Where the review came from (Google, Clutch, etc.) | 🟡 Useful |
| Rating | Score out of 5 | 🟡 Useful |
| Review date | When the review was written | 🟡 Useful |
| Customer photo | Headshot for the testimonial card | 🟡 Useful |
| Review title | Optional headline above the quote | 🟡 Useful |
| Featured | Tick to show on homepage / testimonial sections | 🟡 Useful |
| Service category | Which service the review is about | 🟡 Useful |
| Industry | Reviewer's industry for filtering | 🟡 Useful |
| Location | Reviewer's country/city | 🟡 Useful |
| Company logo override | Use a different logo than what's on the customer record | 🟡 Useful |
| Video review URL | Link to a video version of this review | 🟡 Useful |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 7. Review Sources

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/reviews/sources/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Source name | e.g. "Google", "Clutch" | ✅ Essential |
| Source URL | Link to the platform's profile page | ✅ Essential |
| Source type | google / clutch / trustpilot / g2 / facebook / manual | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Average rating | Overall rating score from the platform | 🟡 Useful |
| Review count | Total number of reviews on the platform | 🟡 Useful |
| Rating scale | Max score (usually 5) | 🟡 Useful |
| Display label | Override label shown in the UI (e.g. "4.9 on Google") | 🟡 Useful |
| Is featured | Show this source prominently | 🟡 Useful |
| Source logo | Platform logo image | 🟡 Useful |
| Last synced at | When reviews were last imported — auto-managed | ❌ Hide (auto) |

---

## 8. Podcasts

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/podcasts/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Episode title | Title of this episode | ✅ Essential |
| Podcast name | Name of the show (e.g. "Finanshels Finance Podcast") | ✅ Essential |
| Audio URL | Direct link to the audio file or episode page | ✅ Essential |
| Episode summary | Short description for cards and SEO | ✅ Essential |
| Publish date | When the episode was released | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Episode number | e.g. "42" — shown on the card | 🟡 Useful |
| Thumbnail image | Cover art for the episode | 🟡 Useful |
| Duration | e.g. "38 min" | 🟡 Useful |
| Hosts | Team member links for hosts | 🟡 Useful |
| Guests | Guest names as free-text tags | 🟡 Useful |
| Key topics | Tags for what the episode covers | 🟡 Useful |
| Show notes | Longer description with links — shown on detail page | 🟡 Useful |
| Related resources | Blog posts to link from the episode page | 🟡 Useful |
| Embed code | Raw HTML embed from Spotify/Buzzsprout — set by developer | 🔵 Advanced |
| Transcript | Full text of the episode (long, SEO value) | 🔵 Advanced |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 9. FAQ Questions

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/faq/[topic]/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Question | The full question text | ✅ Essential |
| Answer | The full answer (rich text) | ✅ Essential |
| FAQ topic | Which topic group this belongs to | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Related service | Which Finanshels service this Q&A relates to | 🟡 Useful |
| Featured | Tick to show on FAQ homepage highlights | 🟡 Useful |
| Sort order | Order within the topic group | 🟡 Useful |
| Related blog posts | Blog articles that answer this question in more depth | 🟡 Useful |
| Related tools | Tools relevant to this question | 🟡 Useful |
| Search keywords | Tags to help internal search surface this question | 🔵 Advanced |
| Icon | Rarely used | ❌ Hide |

---

## 10. FAQ Topics

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/faq/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Topic name | Display name of the topic group | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Topic description | Short explanation shown at the top of the topic page | 🟡 Useful |
| Icon | Lucide icon shown next to the topic name | 🟡 Useful |
| Sort order | Order on the main FAQ index | 🟡 Useful |
| Featured | Tick to highlight on the FAQ homepage | 🟡 Useful |
| Related services | Tags linking to Finanshels services | 🟡 Useful |

---

## 11. Customer Stories

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/stories/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Story title | Headline of the case study | ✅ Essential |
| Customer | Link to the Our Customers record | ✅ Essential |
| Industry | e.g. "Retail" — for filtering | ✅ Essential |
| Challenge summary | Short paragraph on the problem the customer had | ✅ Essential |
| Solution summary | Short paragraph on how Finanshels helped | ✅ Essential |
| Results summary | Short paragraph on the outcome | ✅ Essential |
| Full story body | Complete case study (rich text) | ✅ Essential |
| Publish date | When this story goes live | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Hero image | Large image at the top of the story page | 🟡 Useful |
| Region | e.g. "UAE" | 🟡 Useful |
| Services used | Tags for which services feature in the story | 🟡 Useful |
| Metrics highlights | Key numbers like "60% time saved" — JSON array | 🟡 Useful |
| Testimonial reference | Link to a customer review to pull a quote | 🟡 Useful |
| Featured | Tick to highlight on the stories index | 🟡 Useful |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 12. Ebooks

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/ebooks/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Ebook title | Display name | ✅ Essential |
| Cover image | The ebook cover shown on cards and the detail page | ✅ Essential |
| Short description | 1–2 sentences for listing cards | ✅ Essential |
| File upload | The actual PDF/ebook file URL | ✅ Essential |
| Format | pdf / ebook / guide | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Gated download | Tick if users must fill a form to download | ✅ Essential |
| Full description | Longer sell copy on the ebook detail page | 🟡 Useful |
| Topics | Tags for what the ebook covers | 🟡 Useful |
| Author | Team member who wrote it | 🟡 Useful |
| Featured | Tick to highlight on the ebooks index | 🟡 Useful |
| Related content | Blog posts to link from the ebook page | 🟡 Useful |
| Page count | e.g. "24 pages" — shown on the card | 🟡 Useful |
| File size | e.g. "2.4 MB" — shown before download | 🟡 Useful |
| Thank-you page URL | Where to redirect after form submission | 🔵 Advanced |
| Form embed | Raw HTML for an external form (HubSpot, etc.) — developer territory | ❌ Hide (developer) |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 13. Webinars

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/webinars/` | ✅ Essential |
| Status | draft / scheduled / published / archived | ✅ Essential |
| Webinar status | upcoming / live / completed — controls the page layout | ✅ Essential |
| Webinar title | Display name | ✅ Essential |
| Start datetime | Date and time the event starts | ✅ Essential |
| Timezone | e.g. "Asia/Dubai" | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Registration URL | Link to the sign-up page (Zoom, etc.) | ✅ Essential |
| Speakers | Team members presenting | ✅ Essential |
| Summary | Short description for cards | ✅ Essential |
| Banner image | Visual shown on the listing card and detail header | 🟡 Useful |
| Description | Full details shown on the webinar page | 🟡 Useful |
| End datetime | When the event finishes | 🟡 Useful |
| Recording URL | Link to the replay after the event | 🟡 Useful |
| Platform | zoom / meet / teams / other | 🟡 Useful |
| Key topics | Tags for what will be covered | 🟡 Useful |
| Featured | Tick to highlight on the webinars index | 🟡 Useful |
| Related resources | Blog posts to show alongside the webinar | 🟡 Useful |
| Agenda items | JSON array of session agenda points | 🔵 Advanced |
| Icon | Rarely used | ❌ Hide |
| Sort order | Manual ordering | ❌ Hide |

---

## 14. Team Members

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Slug | URL after `/team/` | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Full name | Person's full name | ✅ Essential |
| Photo | Headshot used on team page and as blog author avatar | ✅ Essential |
| Job title | e.g. "Head of Finance" | ✅ Essential |
| Short bio | 2–3 sentences for cards and author bylines | ✅ Essential |
| Display on team page | Tick if this person should appear on /team | ✅ Essential |
| Display as author | Tick if they can be selected as a blog/ebook author | ✅ Essential |
| Language | en / ar | ✅ Essential |
| Department | e.g. "Marketing", "Engineering" | 🟡 Useful |
| Full bio | Longer biography for the profile page | 🟡 Useful |
| LinkedIn URL | Their LinkedIn profile | 🟡 Useful |
| Expertise tags | Topics they're known for (shown on blog posts) | 🟡 Useful |
| Sort order | Order on the team page | 🟡 Useful |
| Twitter URL | Their Twitter/X profile | 🟡 Useful |
| Location | City/country | 🟡 Useful |
| Email | Internal use only — not shown publicly | 🔵 Advanced |
| Phone | Internal use only — not shown publicly | 🔵 Advanced |
| Website URL | Personal website | 🟡 Useful |

---

## 15. Media Assets

### Publish tab

| Field | What it means | Priority |
|-------|--------------|---------|
| Title | A human-readable name for the file | ✅ Essential |
| Asset slug | Unique identifier used in references | ✅ Essential |
| Status | draft / published | ✅ Essential |
| Asset type | image / video / document / other | ✅ Essential |
| Asset URL | The actual file URL (CDN link) | ✅ Essential |
| Alt text | Accessibility description for screen readers and SEO | ✅ Essential |
| Category | e.g. "Brand", "Blog covers" — helps search in the library | 🟡 Useful |
| Folder | e.g. "blog/covers" — logical grouping | 🟡 Useful |
| MIME type | e.g. "image/webp" — auto-filled on upload | ❌ Hide (auto) |
| File size (bytes) | Auto-filled on upload | ❌ Hide (auto) |
| Width / Height | Auto-filled on upload | ❌ Hide (auto) |

---

## Shared sections (same on every content type)

### Card tab — controls listing card appearance

| Field | What it means | Priority |
|-------|--------------|---------|
| Card title | Override the title shown on listing cards (leave blank to use main title) | 🟡 Useful |
| Card description | Override the excerpt shown on listing cards | 🟡 Useful |
| Card image | Override the thumbnail image on listing cards | 🟡 Useful |
| Card icon | Icon shown on the card (Lucide name or image URL) | 🟡 Useful |
| Card label / chip | Small badge like "New", "Popular", "Updated" | 🟡 Useful |
| Card CTA label | Button text on the card (e.g. "Read article") | 🟡 Useful |
| Card CTA link | Override the link on the card | 🟡 Useful |
| Featured | Pin this item to the top of the listing | 🟡 Useful |
| Sort order | Manual position in the listing | 🟡 Useful |

### SEO tab — search and social sharing

| Field | What it means | Priority |
|-------|--------------|---------|
| SEO title | Page title in Google results (60 chars max) | 🔵 Advanced |
| SEO description | Snippet shown under the title in Google (155–160 chars) | 🔵 Advanced |
| Focus keyword | The single keyword this page targets | 🔵 Advanced |
| OG image URL | Image shown when sharing on social media | 🔵 Advanced |
| OG title | Headline shown on social share cards | 🔵 Advanced |
| OG description | Description on social share cards | 🔵 Advanced |
| Canonical URL | Tells Google the "master" URL if duplicates exist | 🔵 Advanced |
| Indexable / Noindex | Whether Google should index this page | 🔵 Advanced |
| Schema type | Structured data type (Article, FAQ, etc.) | 🔵 Advanced |
| Secondary keywords | Long-tail variants for the focus keyword | 🔵 Advanced |
| SEO keywords | Comma-list for meta keywords (low SEO value today) | ❌ Hide |
| Twitter card type | How the card looks on Twitter/X | ❌ Hide |
| Twitter creator handle | @handle attribution on Twitter cards | ❌ Hide |
| Robots meta | Fine-grained crawl instructions — very rarely needed | ❌ Hide |
| Breadcrumbs title | Override breadcrumb label — leave blank | ❌ Hide |
| FAQ schema enabled | Auto-adds FAQ rich result — set by SEO lead | ❌ Hide |

### AEO tab — answer engine optimization (AI search)

> This whole tab is for SEO specialists building structured snippets for AI answers. Marketing team can ignore it entirely.

| Field | What it means | Priority |
|-------|--------------|---------|
| Direct answer | Short paragraph for AI to quote verbatim | 🔵 Advanced |
| FAQ items JSON | Q&A pairs in JSON for Google's FAQ rich result | 🔵 Advanced |
| HowTo steps JSON | Step-by-step JSON for Google's HowTo rich result | 🔵 Advanced |
| Speakable content | Text optimized for voice assistants | 🔵 Advanced |
| Hero heading / subheading | Layout overrides for the detail page hero — set once | ❌ Hide |
| Body (legacy) | Old body field — use Publish > Body instead | ❌ Hide |
| Sections (legacy JSON) | Old page builder — replaced by Blocks | ❌ Hide |
| Sidebar CTA enabled | Toggle for sidebar ad — developer setting | ❌ Hide |
| Primary CTA variant | Visual style of CTA button — developer setting | ❌ Hide |
| Template variant | Page template (default/compact/feature) — developer setting | ❌ Hide |

### GEO tab — generative search signals

> This whole tab is for SEO specialists. Marketing can ignore it.

| Field | What it means | Priority |
|-------|--------------|---------|
| GEO summary | Factual summary for AI search systems | 🔵 Advanced |
| Source URLs | Links to research sources cited in the content | 🔵 Advanced |
| Content type | evergreen / news / guide / comparison / analysis | 🔵 Advanced |
| Last updated date | Manual freshness signal | 🔵 Advanced |
| Citations JSON | Structured source citations | 🔵 Advanced |
| Key statistics JSON | Quotable numbers from the content | 🔵 Advanced |
| Expert quotes JSON | Attributed expert quotes | 🔵 Advanced |
| Related entities | People / companies / concepts the content mentions | 🔵 Advanced |

### Listing, Detail, Relations, Blocks tabs

> These are **developer-configured tabs**. They control index-page layout, per-page chrome, cross-collection links, and page-builder sections. Marketing should not need to edit these for regular content creation.

---

## Summary: what to hide for marketing team

Hide or collapse these **entire tabs** by default:

- AEO
- GEO
- Listing
- Detail
- Blocks
- Relations

Hide these **individual fields** across all Publish tabs:

- `sort_order` (unless the collection actively uses manual ordering)
- `icon` (on blog posts, glossary, podcasts — not meaningful)
- `embed_code` / `tool_embed_code` / `form_embed` (raw HTML — developer only)
- `primary_inputs` (JSON — developer only)
- `lead_magnet_cta` (JSON — developer only)
- Media asset auto-fields: `mimeType`, `byteSize`, `width`, `height`
- `last_synced_at` (auto-managed)
- SEO tab: `seoKeywords`, `twitterCardType`, `twitterCreatorHandle`, `robotsMeta`, `breadcrumbsTitle`, `faqSchemaEnabled`
- AEO tab fields: `body` (legacy), `sections` (legacy), `sidebarCtaEnabled`, `primaryCtaVariant`, `templateVariant`
