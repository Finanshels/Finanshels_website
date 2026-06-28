# CMS field guide — marketing team

What to fill in `/admin/cms`, per content type. This lists the **fields that matter for marketing**. For the exhaustive, always-current field list per collection, see the auto-generated [field-inventory.md](./field-inventory.md).

Priority key: ✅ **Essential** (always fill) · 🟡 **Useful** (fill when relevant) · 🔵 **Advanced** (internal/specialist) · ❌ **Ignore** (leftover, don't bother).

---

## How the editor works

- **Center column** = the headline, URL slug, and the main writing area (body / definitions / summaries).
- **Right sidebar** = a **Publish** tab (everything else) plus **SEO / AEO / GEO** tabs.
- **Saving & publishing:** use the **Save** and **Publish** buttons in the **top header**. Save keeps it a draft; Publish makes it live. There is no "status" dropdown — the buttons are the control. Look for the **Saved · cache refreshed** pill to confirm.
- **Slug** auto-fills from the title only when you click **+ New**; after that it stays put until you edit it.
- **Images** can be uploaded inline (drag/drop or pick) — no need to host them elsewhere first.

> The **SEO / AEO / GEO** tabs and the **Card / Listing / Detail / Blocks / Relations** groups are set once by an SEO lead or developer and rarely touched per item. Marketing can collapse/ignore them unless told otherwise.

---

## 1. Blog Posts

| Field | Priority |
|---|---|
| Title, Slug, Excerpt, Body | ✅ |
| Author, Publish date, Blog category, Language | ✅ |
| Featured image | ✅ (drives the hero + social share) |
| Featured image alt text | 🟡 (fill whenever you set a featured image — accessibility + SEO) |
| Blog industry, Blog tags | 🟡 (power the /blog filters) |
| Featured post | 🟡 (pin/highlight on the blog index) |
| Related posts | 🟡 (manual picks shown at the bottom) |

In-article CTAs come from the **CTA page-block** (Blocks tab), not a publish field.

---

## 2. Glossary Terms

| Field | Priority |
|---|---|
| Term, Slug, Description, Language | ✅ |
| Category | 🟡 (dropdown — same buckets as blog categories; powers the glossary filter) |
| FAQ items (AEO tab) | 🟡 (adds FAQ rich-results to the page) |
| SEO title, Meta description (SEO tab) | 🟡 (override the auto-generated meta on key terms) |

Every glossary page ends with a standard "contact Finanshels" CTA — there's no per-term CTA field. Status is the header Save/Publish, not a dropdown.

---

## 3. Tools (calculators / checkers)

| Field | Priority |
|---|---|
| Tool name, Slug, Short description | ✅ |
| Tool type, Embed type, Tool route key | ✅ (developer usually sets the embed fields) |
| Language | ✅ |
| Icon, Hero image, Full description | 🟡 |
| Related services, Gated, Lead capture enabled | 🟡 |

---

## 4. Customer Reviews

Used as **embedded testimonials** across the site — no standalone page.

| Field | Priority |
|---|---|
| Customer name, Review text, Slug | ✅ |
| Approved for publication, Language | ✅ (gates whether it can appear) |
| Services | ✅ (multi-select — drives service-wise testimonials; same buckets as blog) |
| Customer designation, Company, Rating | 🟡 |
| Customer photo, Company logo, Video review URL, Featured | 🟡 |

---

## 5. Podcasts

| Field | Priority |
|---|---|
| Episode title, Slug, Episode summary | ✅ |
| Podcast name, Audio URL, Publish date, Language | ✅ |
| Episode number, Hosts, Show notes, Key topics | 🟡 |
| Featured image, Featured | 🟡 |

---

## 6. FAQs

Reused across the site — the same FAQ can power the **/faq** page and a service page's FAQ section (via the FAQ accordion block set to a service).

| Field | Priority |
|---|---|
| Question, Answer, Slug, Language | ✅ |
| Services | ✅ (multi-select — pick the service(s) this answers, or General; drives /faq filtering + the service-filtered FAQ block) |
| Featured | 🟡 |

---

## 7. Customer Stories (case studies)

| Field | Priority |
|---|---|
| Story title, Slug | ✅ |
| Challenge / Solution / Results summary | ✅ |
| Full story body, Customer, Industry, Publish date, Language | ✅ |
| Hero image, Metrics highlights, Services used | 🟡 |
| Featured | 🟡 |

---

## 8. Ebooks (lead magnets)

| Field | Priority |
|---|---|
| Ebook title, Slug, Cover image, File upload, Format, Language | ✅ |
| Full description, Page count, Topics | 🟡 |
| Gated download, Authors, Featured | 🟡 |

Admin-only — surfaced through download blocks, not a public page.

---

## 9. Webinars

| Field | Priority |
|---|---|
| Webinar title, Slug, Webinar status | ✅ |
| Start datetime, Timezone, Language | ✅ |
| Banner image, Summary, Registration URL, Recording URL | 🟡 |
| Platform, Speakers, Featured | 🟡 |

---

## 10. Team Members

| Field | Priority |
|---|---|
| Full name, Slug, Job title | ✅ |
| Photo | ✅ (team page + blog author avatar) |
| Department, Short bio, Full bio | 🟡 |
| LinkedIn URL, Expertise tags, Sort order | 🟡 |
| Email, Phone | 🔵 (internal only — never shown publicly) |

Admin-only. There is no language/status field — status is the header Save/Publish.

---

## 11. Media Assets (file library)

| Field | Priority |
|---|---|
| Title, Asset slug, Asset type, Asset URL | ✅ |
| Alt text | ✅ (accessibility + SEO) |
| Category, Folder | 🟡 (helps search the library) |
| MIME type, File size, Width, Height | ❌ (auto-filled on upload) |
| Hero heading, Hero subheading, Body, Sections, CTA fields, Template variant | ❌ (leftover layout fields — ignore; slated for removal) |

---

## Fields to ignore everywhere

These appear in some editors but nothing on the site reads them — leave blank, they're being cleaned up:

- **Hero heading / Hero subheading / Sidebar CTA enabled / Primary CTA variant / Template variant** — leftover marketing-layout fields.
- **Sections (legacy JSON)** — an old hand-JSON field; superseded by the Blocks tab.

See [hidden-fields-audit.md](./hidden-fields-audit.md) for the full remove/keep picture.
