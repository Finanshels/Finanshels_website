# CMS field inventory — main editor vs sidebar

> **Auto-generated** from `src/lib/cms/collectionDefinitions.ts` (the single source of truth).
> Regenerate with: `npx tsx scripts/gen-field-inventory.mts > docs/cms/field-inventory.md`
> Do not hand-edit.

**How the editor is laid out** (`src/app/admin/cms/page.tsx`):

- **Main editor (center):** the title + slug, any required/long-form rich-text bodies, then collapsible **Card / Listing / Detail / Page blocks / Relationships** groups.
- **Sidebar (right rail):** a **Publish** tab (status, metadata, card/CTA fields) plus **SEO / AEO / GEO** tabs. Tabs only appear when the collection actually has fields for them.

_11 collections._

## Contents

- [Media](#media--media_assets)
- [Blog Posts](#blog-posts--blog_posts)
- [Glossaries](#glossaries--glossary_terms)
- [Tools](#tools--tools)
- [Customer Reviews](#customer-reviews--customer_reviews)
- [Podcasts](#podcasts--podcasts)
- [FAQs](#faqs--faqs)
- [Customer Stories](#customer-stories--customer_stories)
- [Ebooks](#ebooks--ebooks)
- [Webinars](#webinars--webinars)
- [Team Members](#team-members--team_members)

---

## Media  `media_assets`

**Singular:** Media Asset  ·  **Title field:** `title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** MediaObject

> Reusable image/video/document assets for all collections.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Title | `title` | text | ✅ |
| Asset slug | `slug` | text | ✅ |
| Body | `body` | textarea | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Asset type | `assetType` | select {image, video, document, other} | ✅ |
| Category | `category` | select {Blog covers, Ebook covers, Team photos, Customer logos, Social media, Infographics, Other} | |
| Folder | `folder` | text | |
| Asset URL | `assetUrl` | url | ✅ |
| Alt text | `altText` | text | |
| MIME type | `mimeType` | text | |
| File size (bytes) | `byteSize` | number | |
| Width | `width` | number | |
| Height | `height` | number | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---

## Blog Posts  `blog_posts`

**Singular:** Blog Post  ·  **Title field:** `title`  ·  **Slug field:** `slug`  ·  **Route:** `/blog/[slug]`  ·  **Schema:** BlogPosting

> Long-form articles with authoring and publishing controls.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Title | `title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Excerpt | `excerpt` | textarea | ✅ |
| Body | `body` | textarea | ✅ |

**Page blocks**

| Field | Key | Type | Required |
|---|---|---|---|
| Page blocks | `page_blocks` | blocks | |
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, HowTo, FAQPage} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related glossary terms | `relatedGlossaryRefs` | multi_reference → glossary_terms | |
| Related FAQs | `relatedFaqRefs` | multi_reference → faqs | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Author | `author` | reference → team_members | ✅ |
| Publish date | `publish_date` | datetime | ✅ |
| Featured image alt text | `featured_image_alt` | text | |
| Blog category | `blog_category` | select {accounting-bookkeeping, vat, corporate-tax, audit-assurance, compliance-aml, cfo-cash-flow, ai-tech-finance, startup-sme-finance, business-setup-free-zone, payroll, general} | ✅ |
| Blog industry | `blog_industry` | multi_select {small-business, technology-startups, real-estate, restaurants-fb, healthcare, trading-business, ecommerce, jewellers-precious-metals, vc-funds-investment-firms, professional-services, construction-contracting, general} | |
| Blog tags | `blog_tags` | tags | |
| Featured post | `featured_post` | boolean | |
| Related posts | `related_posts` | multi_reference → blog_posts | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Direct answer (AI summary) | `directAnswer` | textarea | |
| FAQ items JSON | `faqItems` | json | |

**GEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| GEO summary | `geoSummary` | textarea | |
| Source URLs | `sourceUrls` | tags | |
| Content type | `geoContentType` | select {evergreen, news, guide, comparison, analysis} | |
| Last updated date | `lastUpdatedDate` | text | |
| Citations / sources | `citations` | rows | |
| Key statistics | `keyStatistics` | rows | |
| Expert quotes | `expertQuotes` | rows | |

---

## Glossaries  `glossary_terms`

**Singular:** Glossary Term  ·  **Title field:** `term`  ·  **Slug field:** `slug`  ·  **Route:** `/glossary/[slug]`  ·  **Schema:** DefinedTerm

> Definitions, related concepts, and explanatory content.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Term | `term` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Description | `definition_short` | textarea | ✅ |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Category | `term_category` | select {accounting-bookkeeping, vat, corporate-tax, audit-assurance, compliance-aml, cfo-cash-flow, ai-tech-finance, startup-sme-finance, business-setup-free-zone, payroll, general} | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |

**AEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| FAQ items JSON | `faqItems` | json | |

**GEO tab**

_None._

---

## Tools  `tools`

**Singular:** Tool  ·  **Title field:** `tool_name`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** SoftwareApplication

> Interactive tools, calculators, and checkers.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Tool name | `tool_name` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Short description | `short_description` | textarea | ✅ |
| Body | `body` | textarea | |
| Full description | `full_description` | textarea | |

**Card**

| Field | Key | Type | Required |
|---|---|---|---|
| Card description | `card_description` | textarea | |
| Card image | `card_image` | image | |
| Featured | `featured` | boolean | |

**Listing page**

| Field | Key | Type | Required |
|---|---|---|---|
| Listing hero heading | `listing_hero_heading` | text | |
| Listing hero subheading | `listing_hero_subheading` | textarea | |
| Listing hero image | `listing_hero_image` | url | |
| Listing intro HTML | `listing_intro_html` | textarea | |
| Search bar enabled | `listing_search_enabled` | boolean | |
| Search placeholder | `listing_search_placeholder` | text | |
| Filter facets | `listing_filter_facets` | tags | |
| Sort options | `listing_sort_options` | tags | |
| Default sort | `listing_default_sort` | select {newest, oldest, alphabetical, popular, featured, sort_order} | |
| Featured count | `listing_featured_count` | number | |
| Layout | `listing_layout` | select {grid, list, magazine, masonry} | |
| Page size | `listing_page_size` | number | |
| Pagination style | `listing_pagination_style` | select {paged, load_more, infinite} | |
| Sticky CTA enabled | `listing_sticky_cta_enabled` | boolean | |
| Sticky CTA label | `listing_sticky_cta_label` | text | |
| Sticky CTA link | `listing_sticky_cta_link` | url | |

**Detail page**

| Field | Key | Type | Required |
|---|---|---|---|
| Breadcrumbs enabled | `detail_breadcrumbs_enabled` | boolean | |
| Breadcrumbs title override | `detail_breadcrumbs_title` | text | |
| Metadata row enabled | `detail_metadata_row_enabled` | boolean | |
| Social share enabled | `detail_social_share_enabled` | boolean | |
| Social networks | `detail_social_share_networks` | tags | |
| Sticky side CTA enabled | `detail_sticky_side_cta_enabled` | boolean | |
| Sticky side CTA label | `detail_sticky_side_cta_label` | text | |
| Sticky side CTA link | `detail_sticky_side_cta_link` | url | |
| Lead capture enabled | `detail_lead_capture_enabled` | boolean | |
| Lead capture form ID | `detail_lead_capture_form_id` | text | |
| Related content block enabled | `detail_related_content_enabled` | boolean | |
| Related content mode | `detail_related_content_mode` | select {manual, auto, manual+auto} | |
| Related content max items | `detail_related_content_max` | number | |
| Detail template variant | `detail_template_variant` | select {default, compact, feature, story, landing} | |

**Page blocks**

| Field | Key | Type | Required |
|---|---|---|---|
| Page blocks | `page_blocks` | blocks | |
| Schema type (override) | `schema_type_override` | select {, SoftwareApplication, Product, WebPage} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |
| Related glossary terms | `relatedGlossaryRefs` | multi_reference → glossary_terms | |
| Related tools | `relatedToolRefs` | multi_reference → tools | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Icon | `icon` | icon | |
| Updated at | `updated_at` | datetime | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Tool type | `tool_type` | select {calculator, checker, estimator, generator, quiz} | ✅ |
| Hero image | `hero_image` | image | |
| Embed type | `tool_embed_type` | select {custom_component, iframe, script} | ✅ |
| Embed code | `tool_embed_code` | textarea | |
| Tool route key | `tool_route_key` | text | ✅ |
| Primary inputs | `primary_inputs` | json | |
| Output description | `output_description` | textarea | |
| Benefits | `benefits` | json | |
| FAQ items | `faq_items` | multi_reference → faqs | |
| Related services | `related_services` | tags | |
| Gated | `gated` | boolean | |
| Lead capture enabled | `lead_capture_enabled` | boolean | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Direct answer (AI summary) | `directAnswer` | textarea | |
| FAQ items JSON | `faqItems` | json | |
| Direct answer snippet | `answerSnippet` | textarea | |
| HowTo steps JSON | `howToSteps` | json | |
| Speakable content | `speakableContent` | textarea | |

**GEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| GEO summary | `geoSummary` | textarea | |
| Source URLs | `sourceUrls` | tags | |
| Content type | `geoContentType` | select {evergreen, news, guide, comparison, analysis} | |
| Last updated date | `lastUpdatedDate` | text | |
| Citations / sources | `citations` | rows | |
| Key statistics | `keyStatistics` | rows | |
| Expert quotes | `expertQuotes` | rows | |
| Related entities | `relatedEntities` | tags | |

---

## Customer Reviews  `customer_reviews`

**Singular:** Customer Review  ·  **Title field:** `customer_name`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Review

> Testimonials and social proof snippets.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Customer name | `customer_name` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Review text | `review_text` | textarea | ✅ |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Customer designation | `customer_designation` | text | |
| Company | `company` | text | |
| Rating (1-5) | `rating` | number | |
| Video review URL | `video_review_url` | url | |
| Customer photo | `customer_photo` | image | |
| Company logo | `company_logo_override` | image | |
| Services | `service_category` | multi_select {accounting-bookkeeping, vat, corporate-tax, audit-assurance, compliance-aml, cfo-cash-flow, ai-tech-finance, startup-sme-finance, business-setup-free-zone, payroll, general} | |
| Approved for publication | `approved_for_publication` | boolean | ✅ |
| Featured | `featured` | boolean | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---

## Podcasts  `podcasts`

**Singular:** Podcast Episode  ·  **Title field:** `episode_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** PodcastEpisode

> Podcast episodes with streaming links.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Episode title | `episode_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Episode summary | `episode_summary` | textarea | ✅ |

**Page blocks**

| Field | Key | Type | Required |
|---|---|---|---|
| Page blocks | `page_blocks` | blocks | |
| Schema type (override) | `schema_type_override` | select {, PodcastEpisode, VideoObject, Article} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related episodes | `relatedPodcastRefs` | multi_reference → podcasts | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Episode number | `episode_number` | number | |
| Podcast name | `podcast_name` | text | ✅ |
| Audio URL | `audio_url` | url | ✅ |
| Embed code | `embed_code` | textarea | |
| Duration | `duration` | text | |
| Publish date | `publish_date` | datetime | ✅ |
| Hosts | `hosts` | multi_reference → team_members | |
| Guests | `guests` | tags | |
| Show notes | `show_notes` | textarea | |
| Transcript | `transcript` | textarea | |
| Key topics | `key_topics` | tags | |
| Related resources | `related_resources` | multi_reference → blog_posts | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

_None._

**GEO tab**

_None._

---

## FAQs  `faqs`

**Singular:** FAQ  ·  **Title field:** `question`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Question

> Question/answer entries grouped by topic.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Question | `question` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Answer | `answer` | textarea | ✅ |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Sort order | `sort_order` | number | |
| Services | `service_category` | multi_select {accounting-bookkeeping, vat, corporate-tax, audit-assurance, compliance-aml, cfo-cash-flow, ai-tech-finance, startup-sme-finance, business-setup-free-zone, payroll, general} | |
| Featured | `featured` | boolean | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---

## Customer Stories  `customer_stories`

**Singular:** Customer Story  ·  **Title field:** `story_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Article

> Detailed case studies and customer outcomes.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Story title | `story_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Challenge summary | `challenge_summary` | textarea | ✅ |
| Solution summary | `solution_summary` | textarea | ✅ |
| Results summary | `results_summary` | textarea | ✅ |
| Full story body | `full_story_body` | textarea | ✅ |

**Page blocks**

| Field | Key | Type | Required |
|---|---|---|---|
| Page blocks | `page_blocks` | blocks | |
| Schema type (override) | `schema_type_override` | select {, Article, NewsArticle, Review} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Lead author | `leadAuthorRef` | reference → team_members | |
| Related customer stories | `relatedStoryRefs` | multi_reference → customer_stories | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Customer | `customer` | text | ✅ |
| Industry | `industry` | select {small-business, technology-startups, real-estate, restaurants-fb, healthcare, trading-business, ecommerce, jewellers-precious-metals, vc-funds-investment-firms, professional-services, construction-contracting, general} | ✅ |
| Region | `region` | text | |
| Hero image | `hero_image` | image | |
| Metrics highlights | `metrics_highlights` | json | |
| Services used | `services_used` | tags | |
| Testimonial reference | `testimonial_reference` | multi_reference → customer_reviews | |
| Featured | `featured` | boolean | |
| Publish date | `publish_date` | datetime | ✅ |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

_None._

**GEO tab**

_None._

---

## Ebooks  `ebooks`

**Singular:** Ebook  ·  **Title field:** `ebook_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Book

> Downloadable long-form guides and lead magnets.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Ebook title | `ebook_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Full description | `full_description` | textarea | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Authors | `authorRefs` | multi_reference → team_members | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Language | `language` | select {en, ar} | ✅ |
| Cover image | `cover_image` | image | ✅ |
| File upload | `file_upload` | file | ✅ |
| Page count | `page_count` | number | |
| Format | `format` | select {pdf, ebook, guide} | ✅ |
| Topics | `topics` | tags | |
| Gated download | `gated` | boolean | |
| Featured | `featured` | boolean | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

_None._

**GEO tab**

_None._

---

## Webinars  `webinars`

**Singular:** Webinar  ·  **Title field:** `webinar_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Event

> Live and on-demand webinar sessions.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Webinar title | `webinar_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Body | `body` | textarea | |

**Card**

| Field | Key | Type | Required |
|---|---|---|---|
| Card description | `card_description` | textarea | |
| Card image | `card_image` | image | |
| Featured | `featured` | boolean | |
| Sort order | `sort_order` | number | |

**Listing page**

| Field | Key | Type | Required |
|---|---|---|---|
| Listing hero heading | `listing_hero_heading` | text | |
| Listing hero subheading | `listing_hero_subheading` | textarea | |
| Listing hero image | `listing_hero_image` | url | |
| Listing intro HTML | `listing_intro_html` | textarea | |
| Search bar enabled | `listing_search_enabled` | boolean | |
| Search placeholder | `listing_search_placeholder` | text | |
| Filter facets | `listing_filter_facets` | tags | |
| Sort options | `listing_sort_options` | tags | |
| Default sort | `listing_default_sort` | select {newest, oldest, alphabetical, popular, featured, sort_order} | |
| Featured count | `listing_featured_count` | number | |
| Layout | `listing_layout` | select {grid, list, magazine, masonry} | |
| Page size | `listing_page_size` | number | |
| Pagination style | `listing_pagination_style` | select {paged, load_more, infinite} | |
| Sticky CTA enabled | `listing_sticky_cta_enabled` | boolean | |
| Sticky CTA label | `listing_sticky_cta_label` | text | |
| Sticky CTA link | `listing_sticky_cta_link` | url | |

**Detail page**

| Field | Key | Type | Required |
|---|---|---|---|
| Breadcrumbs enabled | `detail_breadcrumbs_enabled` | boolean | |
| Breadcrumbs title override | `detail_breadcrumbs_title` | text | |
| Metadata row enabled | `detail_metadata_row_enabled` | boolean | |
| Social share enabled | `detail_social_share_enabled` | boolean | |
| Social networks | `detail_social_share_networks` | tags | |
| Sticky side CTA enabled | `detail_sticky_side_cta_enabled` | boolean | |
| Sticky side CTA label | `detail_sticky_side_cta_label` | text | |
| Sticky side CTA link | `detail_sticky_side_cta_link` | url | |
| Lead capture enabled | `detail_lead_capture_enabled` | boolean | |
| Lead capture form ID | `detail_lead_capture_form_id` | text | |
| Related content block enabled | `detail_related_content_enabled` | boolean | |
| Related content mode | `detail_related_content_mode` | select {manual, auto, manual+auto} | |
| Related content max items | `detail_related_content_max` | number | |
| Detail template variant | `detail_template_variant` | select {default, compact, feature, story, landing} | |

**Page blocks**

| Field | Key | Type | Required |
|---|---|---|---|
| Page blocks | `page_blocks` | blocks | |
| Schema type (override) | `schema_type_override` | select {, Event, VideoObject, Course} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Speakers | `speakerRefs` | multi_reference → team_members | |
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |
| Related webinars | `relatedWebinarRefs` | multi_reference → webinars | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Updated at | `updated_at` | datetime | |
| Sort order | `sort_order` | number | |
| Tags | `tags` | tags | |
| CTA label | `cta_label` | text | |
| CTA link | `cta_link` | url | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Webinar status | `webinar_status` | select {upcoming, live, completed} | ✅ |
| Banner image | `banner_image` | image | |
| Summary | `summary` | textarea | |
| Description | `description` | textarea | |
| Start datetime | `start_datetime` | datetime | ✅ |
| End datetime | `end_datetime` | datetime | |
| Timezone | `timezone` | text | ✅ |
| Registration URL | `registration_url` | url | |
| Recording URL | `recording_url` | url | |
| Platform | `platform` | select {zoom, meet, teams, other} | |
| Agenda items | `agenda_items` | json | |
| Key topics | `key_topics` | tags | |
| Related resources | `related_resources` | multi_reference → blog_posts | |
| Featured | `featured` | boolean | |

**SEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Focus keyword | `focus_keyword` | text | |
| SEO title | `seo_title` | text | |
| Meta description | `meta_description` | textarea | |
| Meta keywords | `meta_keywords` | tags | |
| Secondary keywords (LSI) | `secondary_keywords` | tags | |
| Canonical URL | `canonical_url` | url | |
| OG title | `og_title` | text | |
| OG description | `og_description` | textarea | |
| OG image | `og_image` | image | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| FAQ schema enabled | `faq_schema_enabled` | boolean | |
| Breadcrumbs title | `breadcrumbs_title` | text | |

**AEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Direct answer (AI summary) | `directAnswer` | textarea | |
| FAQ items JSON | `faqItems` | json | |
| Direct answer snippet | `answerSnippet` | textarea | |
| HowTo steps JSON | `howToSteps` | json | |
| Speakable content | `speakableContent` | textarea | |

**GEO tab**

| Field | Key | Type | Required |
|---|---|---|---|
| GEO summary | `geoSummary` | textarea | |
| Source URLs | `sourceUrls` | tags | |
| Content type | `geoContentType` | select {evergreen, news, guide, comparison, analysis} | |
| Last updated date | `lastUpdatedDate` | text | |
| Citations / sources | `citations` | rows | |
| Key statistics | `keyStatistics` | rows | |
| Expert quotes | `expertQuotes` | rows | |
| Related entities | `relatedEntities` | tags | |

---

## Team Members  `team_members`

**Singular:** Team Member  ·  **Title field:** `full_name`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Person

> People profiles for leadership and team pages.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Full name | `full_name` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Full bio | `full_bio` | textarea | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Sort order | `sort_order` | number | |
| Photo | `photo` | image | |
| Job title | `job_title` | text | ✅ |
| Department | `department` | select {Management, Centre of Excellence, Marketing, Sales, Partnerships, HR, Tech and Product, FinOps, Taxation, Compliance, Legal, Internal Finance} | |
| Short bio | `short_bio` | textarea | |
| Email | `email` | email | |
| Phone | `phone` | text | |
| LinkedIn URL | `linkedin_url` | url | |
| Twitter URL | `twitter_url` | url | |
| Instagram URL | `instagram_url` | url | |
| Website URL | `website_url` | url | |
| Expertise tags | `expertise_tags` | tags | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---
