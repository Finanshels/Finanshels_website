# CMS field inventory — main editor vs sidebar

> **Auto-generated** from `src/lib/cms/collectionDefinitions.ts` (the single source of truth).
> Regenerate with: `npx tsx scripts/gen-field-inventory.mts > docs/cms/field-inventory.md`
> Do not hand-edit.

**How the editor is laid out** (`src/app/admin/cms/page.tsx`):

- **Main editor (center):** the title + slug, any required/long-form rich-text bodies, then collapsible **Card / Listing / Detail / Page blocks / Relationships** groups.
- **Sidebar (right rail):** a **Publish** tab (status, metadata, card/CTA fields) plus **SEO / AEO / GEO** tabs. Tabs only appear when the collection actually has fields for them.

_14 collections._

## Contents

- [Media](#media--media_assets)
- [Blog Posts](#blog-posts--blog_posts)
- [Glossaries](#glossaries--glossary_terms)
- [Our Customers](#our-customers--our_customers)
- [Tools](#tools--tools)
- [Customer Reviews](#customer-reviews--customer_reviews)
- [Podcasts](#podcasts--podcasts)
- [FAQs](#faqs--faqs)
- [Customer Stories](#customer-stories--customer_stories)
- [Ebooks](#ebooks--ebooks)
- [Webinars](#webinars--webinars)
- [Team Members](#team-members--team_members)
- [Videos](#videos--videos)
- [Review Sources](#review-sources--review_sources)

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related glossary terms | `relatedGlossaryRefs` | multi_reference → glossary_terms | |
| Related FAQs | `relatedFaqRefs` | multi_reference → faqs | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Thumbnail image | `thumbnail_image` | image | |
| Icon | `icon` | icon | |
| Author | `author` | reference → team_members | ✅ |
| Publish date | `publish_date` | datetime | ✅ |
| Featured image alt text | `featured_image_alt` | text | |
| Blog category | `blog_category` | select {corporate-tax, vat, transfer-pricing, audit, accounting, bookkeeping, payroll, compliance, advisory, cfo-services, esr-aml-ubo, regulatory-updates, founder-stories, how-to-guides} | ✅ |
| Blog industry | `blog_industry` | select {technology, ecommerce, professional-services, manufacturing, healthcare, real-estate, hospitality, retail, fintech, logistics, general} | |
| Blog tags | `blog_tags` | tags | |
| Target persona | `target_persona` | select {founder, ceo, cfo, finance-manager, accountant, controller, business-owner, agency-owner, none} | |
| TOC enabled | `table_of_contents_enabled` | boolean | |
| Featured post | `featured_post` | boolean | |
| Related posts | `related_posts` | multi_reference → blog_posts | |
| Series parent post | `series_ref` | reference → blog_posts | |
| Lead magnet label | `lead_magnet_label` | text | |
| Lead magnet URL | `lead_magnet_url` | url | |
| Lead magnet form ID | `lead_magnet_form_id` | text | |
| Lead-capture form ID (detail page) | `detail_lead_capture_form_id` | text | |
| Sticky side CTA label | `detail_sticky_side_cta_label` | text | |
| Sticky side CTA link | `detail_sticky_side_cta_link` | url | |

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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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
| Definition short | `definition_short` | textarea | ✅ |
| Definition full | `definition_full` | textarea | ✅ |

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related glossary terms | `relatedTermRefs` | multi_reference → glossary_terms | |
| Related FAQs | `relatedFaqRefs` | multi_reference → faqs | |
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |
| Related tools | `relatedToolRefs` | multi_reference → tools | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Excerpt | `excerpt` | textarea | |
| Short description | `short_description` | textarea | |
| Featured image | `featured_image` | image | |
| Thumbnail image | `thumbnail_image` | image | |
| Icon | `icon` | icon | |
| Author | `author` | reference → team_members | |
| Published at | `published_at` | datetime | |
| Updated at | `updated_at` | datetime | ✅ |
| Sort order | `sort_order` | number | |
| Tags | `tags` | tags | |
| Categories | `categories` | tags | |
| Related content | `related_content` | multi_reference → blog_posts | |
| CTA label | `cta_label` | text | |
| CTA link | `cta_link` | url | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Term category | `term_category` | text | ✅ |
| Alphabet letter | `alphabet_letter` | text | ✅ |
| Synonyms | `synonyms` | tags | |
| Related FAQs | `faq_items` | multi_reference → faqs | |
| Example usage | `example_usage` | textarea | |
| Applicability region | `applicability_region` | tags | |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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

## Our Customers  `our_customers`

**Singular:** Customer Profile  ·  **Title field:** `company_name`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Organization

> Company profiles and logos for trust sections.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Company name | `company_name` | text | ✅ |
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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Customer stories | `storyRefs` | multi_reference → customer_stories | |
| Customer reviews | `reviewRefs` | multi_reference → customer_reviews | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Updated at | `updated_at` | datetime | ✅ |
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
| Logo | `logo` | image | ✅ |
| Cover image | `cover_image` | image | |
| Website URL | `website_url` | url | |
| Industry | `industry` | text | |
| Company size | `company_size` | text | |
| HQ location | `hq_location` | text | |
| Region | `region` | tags | |
| Service used | `service_used` | tags | |
| Relationship type | `relationship_type` | select {customer, partner, featured_customer} | ✅ |
| Summary | `summary` | textarea | |
| Testimonial reference | `testimonial_reference` | reference → customer_reviews | |
| Story reference | `story_reference` | reference → customer_stories | |
| Is featured | `is_featured` | boolean | |

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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

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
| Updated at | `updated_at` | datetime | ✅ |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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

**Singular:** Customer Review  ·  **Title field:** `review_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Review

> Testimonials and social proof snippets.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Review title | `review_title` | text | |
| Slug | `slug` | text | ✅ |
| Body | `body` | textarea | |
| Review text | `review_text` | textarea | ✅ |

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Customer | `customerRef` | reference → our_customers | |
| Related customer stories | `relatedStoryRefs` | multi_reference → customer_stories | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Author | `author` | reference → team_members | |
| Updated at | `updated_at` | datetime | ✅ |
| Sort order | `sort_order` | number | |
| Tags | `tags` | tags | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Customer name | `customer_name` | text | ✅ |
| Customer designation | `customer_designation` | text | |
| Company | `company` | reference → our_customers | |
| Rating (1-5) | `rating` | number | |
| Video review URL | `video_review_url` | url | |
| Customer photo | `customer_photo` | image | |
| Company logo override | `company_logo_override` | image | |
| Service category | `service_category` | tags | |
| Industry | `industry` | tags | |
| Location | `location` | text | |
| Review date | `review_date` | datetime | |
| Approved for publication | `approved_for_publication` | boolean | ✅ |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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

## Podcasts  `podcasts`

**Singular:** Podcast Episode  ·  **Title field:** `episode_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** PodcastEpisode

> Podcast episodes with streaming links.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Episode title | `episode_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Body | `body` | textarea | |
| Episode summary | `episode_summary` | textarea | ✅ |

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Hosts | `hostRefs` | multi_reference → team_members | |
| Guests | `guestRefs` | multi_reference → team_members | |
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |
| Related episodes | `relatedPodcastRefs` | multi_reference → podcasts | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Published at | `published_at` | datetime | |
| Updated at | `updated_at` | datetime | ✅ |
| Sort order | `sort_order` | number | |
| Tags | `tags` | tags | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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

## FAQs  `faqs`

**Singular:** FAQ  ·  **Title field:** `question`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Question

> Question/answer entries grouped by topic.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Question | `question` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Body | `body` | textarea | |
| Answer | `answer` | textarea | ✅ |

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Related FAQs | `relatedFaqRefs` | multi_reference → faqs | |
| Related glossary terms | `relatedGlossaryRefs` | multi_reference → glossary_terms | |
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Updated at | `updated_at` | datetime | ✅ |
| Sort order | `sort_order` | number | |
| Tags | `tags` | tags | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Topic | `topic` | text | |
| Topic slug | `topic_slug` | text | |
| Related service | `related_service` | tags | |
| Related blog posts | `related_blog_posts` | multi_reference → blog_posts | |
| Related tools | `related_tools` | multi_reference → tools | |
| Search keywords | `search_keywords` | tags | |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Customer | `customerRef` | reference → our_customers | |
| Lead author | `leadAuthorRef` | reference → team_members | |
| Related customer reviews | `reviewRefs` | multi_reference → customer_reviews | |
| Related customer stories | `relatedStoryRefs` | multi_reference → customer_stories | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Thumbnail image | `thumbnail_image` | image | |
| Icon | `icon` | icon | |
| Hero heading | `hero_heading` | text | |
| Hero subheading | `hero_subheading` | textarea | |
| Sections (legacy JSON) | `sections` | json | |
| Sidebar CTA enabled | `sidebar_cta_enabled` | boolean | |
| Primary CTA variant | `primary_cta_variant` | select {default, minimal, contrast, soft} | |
| Template variant | `template_variant` | select {default, compact, feature, story, landing} | |
| Customer | `customer` | reference → our_customers | ✅ |
| Industry | `industry` | tags | ✅ |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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

## Ebooks  `ebooks`

**Singular:** Ebook  ·  **Title field:** `ebook_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Book

> Downloadable long-form guides and lead magnets.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Ebook title | `ebook_title` | text | ✅ |
| Slug | `slug` | text | ✅ |
| Body | `body` | textarea | |
| Full description | `full_description` | textarea | |

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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

**Relationships**

| Field | Key | Type | Required |
|---|---|---|---|
| Authors | `authorRefs` | multi_reference → team_members | |
| Related blog posts | `relatedBlogRefs` | multi_reference → blog_posts | |
| Related ebooks | `relatedEbookRefs` | multi_reference → ebooks | |
| Related webinars | `relatedWebinarRefs` | multi_reference → webinars | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Featured image | `featured_image` | image | |
| Updated at | `updated_at` | datetime | ✅ |
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
| Cover image | `cover_image` | image | ✅ |
| File upload | `file_upload` | file | ✅ |
| File size | `file_size` | text | |
| Page count | `page_count` | number | |
| Format | `format` | select {pdf, ebook, guide} | ✅ |
| Topics | `topics` | tags | |
| Gated download | `gated` | boolean | |
| Form embed | `form_embed` | textarea | |
| Thank-you page URL | `thank_you_page_url` | url | |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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
| Schema type (override) | `schema_type_override` | select {, Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |

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
| Updated at | `updated_at` | datetime | ✅ |
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
| Twitter card type | `twitter_card_type` | select {summary_large_image, summary, app, player} | |
| Twitter creator handle | `twitter_creator_handle` | text | |
| Robots meta | `robots_meta` | select {index,follow, noindex,follow, index,nofollow, noindex,nofollow} | |
| Schema type | `schema_type` | select {Article, BlogPosting, NewsArticle, DefinedTerm, FAQPage, HowTo, WebPage, CollectionPage, ItemList, VideoObject, PodcastEpisode, Event, Course, SoftwareApplication, Product, Person, Organization, Review, Book} | |
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
| Short bio | `short_bio` | textarea | ✅ |
| Full bio | `full_bio` | textarea | |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Sort order | `sort_order` | number | |
| Photo | `photo` | image | ✅ |
| Job title | `job_title` | text | ✅ |
| Department | `department` | text | |
| Email | `email` | email | |
| Phone | `phone` | text | |
| LinkedIn URL | `linkedin_url` | url | |
| Twitter URL | `twitter_url` | url | |
| Website URL | `website_url` | url | |
| Location | `location` | text | |
| Expertise tags | `expertise_tags` | tags | |
| Display on team page | `display_on_team_page` | boolean | ✅ |
| Display as author | `display_as_author` | boolean | ✅ |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---

## Videos  `videos`

**Singular:** Video  ·  **Title field:** `video_title`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** VideoObject

> Embedded videos (YouTube, Vimeo, etc.) shown on resource pages.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Title | `video_title` | text | ✅ |
| Slug | `slug` | text | ✅ |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Thumbnail image | `thumbnail_image` | image | |
| Sort order | `sort_order` | number | |
| Video URL | `video_url` | url | ✅ |
| Description | `description` | textarea | |
| Featured | `featured` | boolean | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---

## Review Sources  `review_sources`

**Singular:** Review Source  ·  **Title field:** `source_name`  ·  **Slug field:** `slug`  ·  **Route:** _none (admin-only)_  ·  **Schema:** Organization

> External review platforms (Google, Trustpilot, etc.) referenced by customer reviews.

### 🖊️ Main editor (center column)

**Primary fields**

| Field | Key | Type | Required |
|---|---|---|---|
| Source name | `source_name` | text | ✅ |
| Slug | `slug` | text | ✅ |

### 📋 Sidebar (right rail)

**Publish tab**

| Field | Key | Type | Required |
|---|---|---|---|
| Status | `status` | select {draft, in_review, published} | ✅ |
| Language | `language` | select {en, ar} | ✅ |
| Icon | `icon` | image | |
| Source URL | `source_url` | url | |

**SEO tab**

_None._

**AEO tab**

_None._

**GEO tab**

_None._

---
