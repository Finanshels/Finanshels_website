# CMS Field Guide for Marketing Team

This document lists every field in every content type, explains what it does and how to fill it in, and marks each as **Important**, **Advanced**, or **Skip** so we can decide what to hide from the editor UI.

**Legend**
- ✅ **Important** — marketing team must fill this in
- ⚙️ **Advanced** — occasionally useful, leave collapsed or accessible via an "Advanced" toggle
- ❌ **Skip** — safe to hide entirely; either auto-set by the system or a dev/SEO-engineer concern

---

## Shared Sections (appear on every content type)

### Card section
Controls how this item looks on listing pages (e.g. blog index, related content grids). If left blank, the site falls back to the main title / excerpt / featured image automatically.

| Field | What it does | Importance |
|-------|-------------|------------|
| Card title | Overrides the main title on cards only | ⚙️ Advanced |
| Card description | Overrides the excerpt on cards only | ⚙️ Advanced |
| Card image | Overrides the featured image on cards only | ⚙️ Advanced |
| Card icon | Small icon shown on the card (Lucide name or image URL) | ❌ Skip |
| Card label / chip | Badge text like "New", "Popular", "Updated" | ⚙️ Advanced |
| Card CTA label | Override the "Read article" button text on the card | ❌ Skip |
| Card CTA link | Override where the card CTA goes (defaults to detail page) | ❌ Skip |
| Featured | Pin this item to the top of listing pages | ✅ Important |
| Sort order | Manual number to control ordering (lower = higher) | ⚙️ Advanced |

---

### Listing section
Controls how the **index page** for this collection works (e.g. `/blog`, `/ebooks`). These are set once per collection and are dev/design settings — marketing rarely needs to touch them.

| Field | What it does | Importance |
|-------|-------------|------------|
| Listing hero heading | H1 shown on the listing index page | ⚙️ Advanced |
| Listing hero subheading | Sub-text under the index page heading | ⚙️ Advanced |
| Listing hero image | Header image for the index page | ⚙️ Advanced |
| Listing intro HTML | HTML paragraph below the hero on the index page | ⚙️ Advanced |
| Search bar enabled | Toggle to show/hide the search bar on the index | ❌ Skip |
| Search placeholder | Placeholder text inside the search bar | ❌ Skip |
| Filter facets | Which filters appear (category, tag, region…) | ❌ Skip |
| Sort options | Which sort options the visitor can choose | ❌ Skip |
| Default sort | Which sort is selected by default | ❌ Skip |
| Featured count | How many featured items show at the top | ❌ Skip |
| Layout | Grid, list, magazine, or masonry layout | ❌ Skip |
| Page size | How many items load per page | ❌ Skip |
| Pagination style | Paged, load more, or infinite scroll | ❌ Skip |
| Sticky CTA enabled | Toggle a sticky footer CTA on the index | ⚙️ Advanced |
| Sticky CTA label | Label for that sticky CTA | ⚙️ Advanced |
| Sticky CTA link | URL for that sticky CTA | ⚙️ Advanced |

---

### Detail section
Controls chrome on every **detail page** (breadcrumbs, share row, related content block). Mostly set once and forgotten.

| Field | What it does | Importance |
|-------|-------------|------------|
| Breadcrumbs enabled | Show/hide the breadcrumb trail | ❌ Skip |
| Breadcrumbs title override | Custom label for this page in the breadcrumb | ❌ Skip |
| Metadata row enabled | Show/hide the "Author · Date · Read time" row | ❌ Skip |
| Social share enabled | Show/hide share buttons | ❌ Skip |
| Social networks | Which share buttons appear (twitter, linkedin…) | ❌ Skip |
| Sticky side CTA enabled | Sticky sidebar CTA on the detail page | ⚙️ Advanced |
| Sticky side CTA label | Label for that CTA | ⚙️ Advanced |
| Sticky side CTA link | URL for that CTA | ⚙️ Advanced |
| Lead capture enabled | Show an inline email capture form | ⚙️ Advanced |
| Lead capture form ID | Which form to embed | ⚙️ Advanced |
| Related content block enabled | Show a "You might also like" block | ❌ Skip |
| Related content mode | Manual, auto, or both | ❌ Skip |
| Related content max items | How many related items to show | ❌ Skip |
| Detail template variant | Page layout: default, compact, feature, story, landing | ⚙️ Advanced |

---

### Blocks section
Visual page-builder. Add sections like Hero, CTA, FAQ accordion, Stats, etc. on top of the main body.

| Field | What it does | Importance |
|-------|-------------|------------|
| Page blocks | Drag-and-drop page sections | ✅ Important |
| Schema type (override) | Overrides the JSON-LD type for this specific page | ❌ Skip |

---

### SEO section
Controls search engine visibility. Marketing / SEO team fills this in.

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Focus keyword | The single primary keyword this page targets | One phrase, e.g. `payroll software UAE` | ✅ Important |
| SEO title | The `<title>` tag shown in Google results | 50-60 chars, include focus keyword | ✅ Important |
| SEO description | The meta description shown in Google snippets | 150-160 chars, readable sentence | ✅ Important |
| SEO keywords | Additional keywords (Google ignores meta keywords) | Leave blank — no effect | ❌ Skip |
| Secondary keywords (LSI) | Related long-tail phrases to weave into content | Helpful for content planning, not required | ⚙️ Advanced |
| Open Graph title | Title shown when shared on LinkedIn/Facebook | Same as SEO title unless you want a different social hook | ✅ Important |
| Open Graph description | Description shown in social link previews | 1-2 sentence social teaser | ✅ Important |
| Open Graph image URL | Image shown in social link previews | 1200×630 px image URL | ✅ Important |
| Twitter card type | Layout of the Twitter card (always `summary_large_image`) | Leave default | ❌ Skip |
| Twitter creator handle | `@handle` attributed on Twitter cards | Set once at site level | ❌ Skip |
| Robots meta | Tells Google whether to index this page | Default: `index,follow`. Change only to `noindex` for drafts/thank-you pages | ⚙️ Advanced |
| Canonical URL | Tells Google the "true" URL to avoid duplicates | Leave blank unless this page is a duplicate of another URL | ⚙️ Advanced |
| Schema type | JSON-LD structured data type | Set by the template automatically | ❌ Skip |
| Indexable | Whether Google should crawl this page | Default: on. Turn off for internal/temp pages | ⚙️ Advanced |
| Noindex | Duplicate of Robots meta — use Robots meta instead | ❌ Skip |
| FAQ schema enabled | Adds FAQ rich result markup | Turn on if this page has a visible FAQ section | ⚙️ Advanced |
| Breadcrumbs title | Short page name in the breadcrumb schema | ❌ Skip |

---

### AEO section (Answer Engine Optimization)
Signals specifically for AI search results and voice search. Fill these in on high-traffic informational pages.

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Hero heading | H1 on the detail page (overrides card title) | Clear, keyword-rich headline | ⚙️ Advanced |
| Hero subheading | Sub-text under the H1 | Supporting sentence | ⚙️ Advanced |
| Body | Legacy full-page body content | Use **Page Blocks** instead | ❌ Skip |
| Sections (legacy JSON) | Old page-builder format | Do not use — use Page Blocks | ❌ Skip |
| Sidebar CTA enabled | Toggle the sidebar CTA | ⚙️ Advanced |
| Primary CTA variant | Visual style of the main CTA button | ⚙️ Advanced |
| Template variant | Duplicate of Detail section setting | ❌ Skip |
| Direct answer (AI summary) | 2-3 sentence answer an AI can quote directly | Write a plain-language summary answering the page's main question | ⚙️ Advanced |
| FAQ items JSON | Structured Q&A for AI/voice results | JSON array, use the FAQ block instead if possible | ⚙️ Advanced |
| Direct answer snippet | Same as Direct answer — fill one or the other | ❌ Skip (duplicate) |
| HowTo steps JSON | Step-by-step instructions for "how to" pages | Only for instructional content | ⚙️ Advanced |
| Speakable content | Text optimized for voice assistants | Short paragraph read aloud by Google/Alexa | ⚙️ Advanced |

---

### GEO section (Generative Engine Optimization)
Signals for ChatGPT, Perplexity, and AI-generated search summaries. Advanced SEO work.

| Field | What it does | Importance |
|-------|-------------|------------|
| GEO summary | Factual 1-paragraph summary for AI citation | ⚙️ Advanced |
| Source URLs | External references that back up your claims | ⚙️ Advanced |
| Content type | evergreen / news / guide / comparison / analysis | ⚙️ Advanced |
| Last updated date | YYYY-MM-DD of last meaningful edit | ⚙️ Advanced |
| Citations / sources JSON | Structured list of sources with title + URL | ⚙️ Advanced |
| Key statistics JSON | Key data points (stat + source) | ⚙️ Advanced |
| Expert quotes JSON | Quotes from named experts | ⚙️ Advanced |
| Related entities | People, companies, topics related to this page | ❌ Skip |

---

## Blog Posts

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Title | The main post headline (also the H1) | Clear, keyword-rich title | ✅ Important |
| Slug | The URL path: `/blog/your-slug` | Auto-generated from title on creation; edit if needed | ✅ Important |
| Status | draft → published | Set to "published" when ready to go live | ✅ Important |
| Excerpt | 1-2 sentence preview shown on the blog card | Write as a hook — what will the reader learn? | ✅ Important |
| Body | The full article content (rich text editor) | Write the full article here | ✅ Important |
| Author | Which team member wrote this | Pick from the dropdown | ✅ Important |
| Publish date | When this post goes live | Set the date/time; future date = scheduled | ✅ Important |
| Reading time | Estimated minutes to read | Leave blank — auto-calculated from word count | ❌ Skip |
| Blog category | The broad topic bucket (e.g. "Accounting", "Payroll") | Pick or type the category name | ✅ Important |
| Blog tags | Specific topic tags for filtering | Comma-separated, e.g. `vat, uae, 2025` | ✅ Important |
| TOC enabled | Show a Table of Contents sidebar | Turn on for posts longer than ~1500 words | ⚙️ Advanced |
| Featured post | Pin this post to the top of the blog listing | Turn on for hero/highlight posts | ✅ Important |
| Related posts | Manual links to 2-3 related articles | Pick posts on the same topic | ✅ Important |
| Featured image | The main image shown in the card and at the top of the post | 1200×630 px image URL | ✅ Important |
| Language | en or ar | Pick the language this post is written in | ✅ Important |
| Lead magnet CTA | A JSON-configured content offer at the bottom of the post | `{"label":"Download guide","href":"/ebooks/..."}` | ⚙️ Advanced |
| Thumbnail image | Smaller version of featured image for tight card layouts | Leave blank — falls back to featured image | ❌ Skip |
| Icon | Icon shown on the card (rare for blogs) | Leave blank | ❌ Skip |
| CTA label / CTA link | Override the default "Read more" CTA | Leave blank for standard posts | ❌ Skip |
| Sort order | Manual ordering override | Leave blank | ❌ Skip |

---

## Glossary Terms

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Term | The word or phrase being defined | e.g. `Corporate Tax` | ✅ Important |
| Slug | URL: `/glossary/corporate-tax` | Auto-generated | ✅ Important |
| Status | draft / published | ✅ Important |
| Definition short | One-sentence definition for cards and snippets | Plain language, 15-25 words | ✅ Important |
| Definition full | Full explanation with examples (rich text) | 200-500 words, include examples | ✅ Important |
| Term category | Accounting, Tax, Payroll, Finance, etc. | ✅ Important |
| Alphabet letter | First letter of the term (for A-Z index) | e.g. `C` for Corporate Tax | ✅ Important |
| Synonyms | Other names for this term | e.g. `corporate income tax, CIT` | ✅ Important |
| Related terms | Links to other glossary entries | Pick 2-5 related terms | ✅ Important |
| Related FAQs | Link to FAQ questions that relate to this term | ⚙️ Advanced |
| Example usage | A sentence showing the term used in context | Optional but helpful | ⚙️ Advanced |
| Applicability region | Which regions this definition applies to (e.g. `UAE`, `KSA`) | ✅ Important |
| Featured | Show on the glossary homepage | Turn on for high-traffic terms | ✅ Important |
| Featured image | Image for the glossary card | ⚙️ Advanced |
| Icon | Icon on the card | ❌ Skip |

---

## Videos

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Title | Video title | ✅ Important |
| Slug | URL: `/videos/your-slug` | ✅ Important |
| Status | draft / published | ✅ Important |
| Video platform | YouTube / Vimeo / Wistia / Self-hosted | Pick the platform | ✅ Important |
| Video URL | The public URL of the video | Paste the YouTube/Vimeo link | ✅ Important |
| Embed code | Raw `<iframe>` code (use if URL doesn't auto-embed) | Paste from the platform's "Share → Embed" | ⚙️ Advanced |
| Thumbnail image | Preview image for the video card | 1280×720 px recommended | ✅ Important |
| Duration | Length of the video (e.g. `12:30`) | ✅ Important |
| Video category | e.g. "Tutorial", "Webinar Replay", "Demo" | ✅ Important |
| Speaker | Team member who appears in the video | Pick from the dropdown | ✅ Important |
| Summary | 2-3 paragraph summary of the video | ✅ Important |
| Transcript | Full text transcript | Paste from YouTube auto-captions or rev.com | ⚙️ Advanced |
| Key takeaways | Bullet-point list of main lessons | `["Takeaway one", "Takeaway two"]` | ✅ Important |
| Related resources | Related blog posts | ⚙️ Advanced |
| CTA link | Button URL on the video detail page | ⚙️ Advanced |
| Featured image | Same as Thumbnail for card purposes | ❌ Skip (use Thumbnail image) |
| Language | en / ar | ✅ Important |

---

## Our Customers

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Company name | Official company name | ✅ Important |
| Slug | URL: `/customers/acme-corp` | ✅ Important |
| Status | draft / published | ✅ Important |
| Logo | Company logo image URL | PNG/SVG with transparent background | ✅ Important |
| Cover image | Full-width image for the profile page | ⚙️ Advanced |
| Website URL | Company's website | ✅ Important |
| Industry | e.g. `Real Estate`, `Retail`, `Healthcare` | ✅ Important |
| Company size | e.g. `50-200 employees` | ✅ Important |
| HQ location | City/country | ✅ Important |
| Region | Broad region tags: `UAE`, `GCC`, `MENA` | ✅ Important |
| Service used | Which Finanshels services they use | ✅ Important |
| Relationship type | customer / partner / featured_customer | ✅ Important |
| Summary | 1-2 paragraph company description | ✅ Important |
| Testimonial reference | Link to their customer review | ⚙️ Advanced |
| Story reference | Link to their case study | ⚙️ Advanced |
| Is featured | Show on homepage / trust section | ✅ Important |

---

## Tools

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Tool name | Display name | ✅ Important |
| Slug | URL: `/tools/vat-calculator` | ✅ Important |
| Status | draft / published | ✅ Important |
| Tool type | calculator / checker / estimator / generator / quiz | ✅ Important |
| Short description | 1-2 sentence teaser for the card | ✅ Important |
| Full description | Longer explanation for the tool detail page | ✅ Important |
| Icon | Lucide icon or image URL for the tool card | ⚙️ Advanced |
| Hero image | Image at the top of the tool page | ⚙️ Advanced |
| Embed type | How the tool is embedded: custom_component, iframe, script | ❌ Skip (developer sets this) |
| Embed code | The iframe/script to embed the tool | ❌ Skip (developer sets this) |
| Tool route key | Internal key that maps to the React component | ❌ Skip (developer sets this) |
| Primary inputs | JSON describing the tool's input fields | ❌ Skip (developer sets this) |
| Output description | What the tool outputs / calculates | ✅ Important |
| Benefits | Bullet-point list of benefits | `["Benefit one", "Benefit two"]` | ✅ Important |
| FAQ items | Link to relevant FAQ questions | ⚙️ Advanced |
| Related services | Tags for which Finanshels services this relates to | ⚙️ Advanced |
| Gated | Require sign-in to use | ⚙️ Advanced |
| Lead capture enabled | Show a lead capture form | ⚙️ Advanced |

---

## Review Sources

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Source name | e.g. `Google`, `Clutch`, `G2` | ✅ Important |
| Slug | URL slug | ✅ Important |
| Status | draft / published | ✅ Important |
| Source logo | Platform logo image | ✅ Important |
| Source URL | Link to the Finanshels profile on that platform | ✅ Important |
| Source type | google / clutch / trustpilot / g2 / facebook / manual | ✅ Important |
| Average rating | e.g. `4.8` | ✅ Important |
| Review count | Total number of reviews | ✅ Important |
| Rating scale | Max rating (usually 5) | ⚙️ Advanced |
| Display label | Label shown in the UI, e.g. `4.8 / 5 on Google` | ⚙️ Advanced |
| Is featured | Show in the social proof section | ✅ Important |
| Last synced at | When was the rating last updated | ❌ Skip (system-managed) |

---

## Customer Reviews

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Review title | Optional headline for the review | ⚙️ Advanced |
| Slug | URL: `/reviews/acme-review` | ✅ Important |
| Status | draft / published | ✅ Important |
| Customer name | Reviewer's full name | ✅ Important |
| Customer designation | Job title, e.g. `CFO at Acme Corp` | ✅ Important |
| Company | Link to their customer profile | ✅ Important |
| Review source | Which platform this came from | ✅ Important |
| Rating (1-5) | Star rating | ✅ Important |
| Review text | The actual review quote | ✅ Important |
| Video review URL | Link to a video testimonial | ⚙️ Advanced |
| Customer photo | Reviewer headshot | ✅ Important |
| Company logo override | Override logo (if different from the linked customer profile) | ⚙️ Advanced |
| Service category | Which service this review covers | ✅ Important |
| Industry | Reviewer's industry | ✅ Important |
| Location | City/country of the reviewer | ⚙️ Advanced |
| Review date | When this review was written | ✅ Important |
| Approved for publication | Must be ticked before the review goes live | ✅ Important |
| Featured | Show in hero testimonial slots | ✅ Important |

---

## Podcasts

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Episode title | Title of this episode | ✅ Important |
| Slug | URL: `/podcasts/episode-12-vat-101` | ✅ Important |
| Status | draft / published | ✅ Important |
| Episode number | e.g. `12` | ✅ Important |
| Podcast name | Name of the show | ✅ Important |
| Audio URL | Link to the audio file or Spotify/Apple Podcasts episode | ✅ Important |
| Embed code | Player `<iframe>` (from Spotify, Buzzsprout, etc.) | ✅ Important |
| Thumbnail image | Episode cover art | ✅ Important |
| Duration | e.g. `38:45` | ✅ Important |
| Publish date | When this episode was released | ✅ Important |
| Hosts | Team members who host this episode | ✅ Important |
| Guests | Guest names (free text, comma-separated) | ✅ Important |
| Episode summary | 2-3 paragraph summary | ✅ Important |
| Show notes | Full show notes with links and timestamps | ⚙️ Advanced |
| Transcript | Full text transcript | ⚙️ Advanced |
| Key topics | Tags for the episode topics | ✅ Important |
| Related resources | Related blog posts | ⚙️ Advanced |
| Language | en / ar | ✅ Important |

---

## FAQ Questions

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Question | The question exactly as a visitor would ask it | Write in first or third person natural language | ✅ Important |
| Slug | URL: `/faq/tax/is-vat-mandatory-in-uae` | ✅ Important |
| Status | draft / published | ✅ Important |
| Answer | The full answer (rich text) | Clear, concise answer — 50-200 words | ✅ Important |
| FAQ topic | Which topic group this belongs to | ✅ Important |
| Related service | Tags for the service this Q relates to | ✅ Important |
| Related blog posts | Links to blog posts that expand on this answer | ⚙️ Advanced |
| Related tools | Link to a relevant calculator or tool | ⚙️ Advanced |
| Search keywords | Keywords someone would type to find this Q | ⚙️ Advanced |
| Featured | Highlight this question on the FAQ hub | ✅ Important |
| Sort order | Manual order within a topic | ⚙️ Advanced |

---

## FAQ Topics

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Topic name | e.g. `VAT`, `Corporate Tax`, `Payroll` | ✅ Important |
| Slug | URL: `/faq/vat` | ✅ Important |
| Status | draft / published | ✅ Important |
| Topic description | 1-2 sentences explaining what this topic covers | ✅ Important |
| Icon | Lucide icon for the topic card | ⚙️ Advanced |
| Sort order | Manual order of topics on the FAQ hub | ⚙️ Advanced |
| Featured | Show on the FAQ homepage | ✅ Important |
| Related services | Which Finanshels services this topic relates to | ⚙️ Advanced |

---

## Customer Stories (Case Studies)

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Story title | Headline for the case study | e.g. `How Acme Corp cut month-end close from 10 days to 2` | ✅ Important |
| Slug | URL: `/stories/acme-corp` | ✅ Important |
| Status | draft / published / archived | ✅ Important |
| Customer | Link to the customer profile | ✅ Important |
| Industry | Tags for the company's industry | ✅ Important |
| Region | e.g. `UAE`, `Saudi Arabia` | ✅ Important |
| Hero image | Feature image for the story | ✅ Important |
| Challenge summary | 1-2 paragraphs: what problem did they have? | ✅ Important |
| Solution summary | 1-2 paragraphs: how did Finanshels solve it? | ✅ Important |
| Results summary | 1-2 paragraphs: what was the outcome? | ✅ Important |
| Metrics highlights | Key numbers, e.g. `[{"label":"Time saved","value":"80%"}]` | ✅ Important |
| Full story body | The complete long-form case study (rich text) | ✅ Important |
| Services used | Which services were delivered | ✅ Important |
| Testimonial reference | Link to their customer review quote | ⚙️ Advanced |
| Featured | Show on the homepage or stories hub | ✅ Important |
| Publish date | When this story was published | ✅ Important |
| Language | en / ar | ✅ Important |

---

## Ebooks

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Ebook title | Display title | ✅ Important |
| Slug | URL: `/ebooks/uae-vat-guide-2025` | ✅ Important |
| Status | draft / published | ✅ Important |
| Cover image | The ebook cover image shown on cards | ✅ Important |
| Short description | 2-3 sentence teaser for the listing card | ✅ Important |
| Full description | Longer description for the download page | ✅ Important |
| File upload | URL of the PDF/ebook file | Paste the CDN or Drive URL | ✅ Important |
| File size | e.g. `2.4 MB` | ⚙️ Advanced |
| Page count | Number of pages | ⚙️ Advanced |
| Format | pdf / ebook / guide | ✅ Important |
| Topics | Topic tags | ✅ Important |
| Author | Team member who wrote it | ✅ Important |
| Gated download | Require email to download | ✅ Important |
| Form embed | Embed code for the gated download form | ⚙️ Advanced |
| Thank-you page URL | Where to redirect after form submission | ⚙️ Advanced |
| Related content | Related blog posts | ⚙️ Advanced |
| Featured | Show in featured ebooks | ✅ Important |
| Language | en / ar | ✅ Important |

---

## Webinars

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Webinar title | Display title | ✅ Important |
| Slug | URL: `/webinars/uae-tax-reforms-2025` | ✅ Important |
| Status | draft / scheduled / published / archived | ✅ Important |
| Webinar status | upcoming / live / completed | ✅ Important |
| Banner image | Full-width image for the webinar page | ✅ Important |
| Summary | 1-2 sentence card teaser | ✅ Important |
| Description | Full paragraph description for the event page | ✅ Important |
| Start datetime | Date and time the webinar starts | ✅ Important |
| End datetime | When it ends | ✅ Important |
| Timezone | e.g. `Asia/Dubai` | ✅ Important |
| Registration URL | Link to the sign-up form (Zoom, Eventbrite, etc.) | ✅ Important |
| Recording URL | Link to the replay (fill after the event) | ✅ Important |
| Platform | zoom / meet / teams / other | ✅ Important |
| Speakers | Team members presenting | ✅ Important |
| Agenda items | List of topics / time slots | ⚙️ Advanced |
| Key topics | Topic tags | ✅ Important |
| Related resources | Related blog posts | ⚙️ Advanced |
| Featured | Show on the homepage or webinars hub | ✅ Important |
| Language | en / ar | ✅ Important |

---

## Team Members

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Full name | Person's full name | ✅ Important |
| Slug | URL: `/team/meet-patel` | ✅ Important |
| Status | draft / published | ✅ Important |
| Photo | Headshot — square, professional | ✅ Important |
| Job title | e.g. `Head of Finance` | ✅ Important |
| Department | e.g. `Product`, `Sales`, `Finance` | ⚙️ Advanced |
| Short bio | 2-3 sentence bio for author bylines and cards | ✅ Important |
| Full bio | Longer bio for the team/profile page | ⚙️ Advanced |
| Email | Work email | ⚙️ Advanced (not displayed publicly by default) |
| Phone | Work phone | ❌ Skip (not displayed publicly) |
| LinkedIn URL | LinkedIn profile | ✅ Important |
| Twitter URL | Twitter/X profile | ⚙️ Advanced |
| Website URL | Personal website | ❌ Skip |
| Location | City/country | ⚙️ Advanced |
| Expertise tags | Topics this person is an expert in | ⚙️ Advanced |
| Display on team page | Show this person on /team | ✅ Important |
| Display as author | Show as a selectable author for blog posts | ✅ Important |
| Sort order | Order on the team page | ⚙️ Advanced |

---

## Media Assets (Library)

| Field | What it does | How to fill in | Importance |
|-------|-------------|----------------|------------|
| Title | Descriptive file name | ✅ Important |
| Asset slug | Unique identifier | ✅ Important |
| Status | draft / published | ✅ Important |
| Asset type | image / video / document / other | ✅ Important |
| Category | e.g. `Blog covers`, `Brand logos` | ✅ Important |
| Folder | e.g. `blog/covers` for organisation | ⚙️ Advanced |
| Asset URL | The CDN URL of the file | ✅ Important |
| Alt text | Accessibility description of the image | ✅ Important |
| MIME type | e.g. `image/webp` | ❌ Skip (auto-detected) |
| File size (bytes) | File size in bytes | ❌ Skip (auto-set on upload) |
| Width | Image width in px | ❌ Skip (auto-set on upload) |
| Height | Image height in px | ❌ Skip (auto-set on upload) |

---

## Summary: Fields to Hide from Marketing UI

These field groups can be removed or collapsed into an "Advanced" accordion to reduce noise:

### Hide entirely (❌ Skip)
- All of **Listing section** (developer/design settings set once)
- All of **Detail section** (developer settings set once)
- `reading_time`, `sort_order`, `icon`, `thumbnail_image`, `cta_label`, `cta_link` on blog posts
- `schema_type_override` in Blocks section
- `seo_keywords`, `twitter_card_type`, `twitter_creator_handle`, `noindex`, `breadcrumbs_title` in SEO
- `Body` and `Sections (legacy JSON)` in AEO (replaced by Page Blocks)
- `Template variant` duplicate in AEO
- `related_entities` in GEO
- `MIME type`, `File size`, `Width`, `Height` in Media Assets
- `Phone`, `Website URL` in Team Members

### Move to "Advanced" accordion (⚙️ Advanced)
- Card section overrides (card_title, card_description, card_image, card_label)
- Sticky CTA and Lead capture fields in Detail section
- `canonical_url`, `robots_meta`, `indexable`, `faq_schema_enabled` in SEO
- All of AEO section
- All of GEO section
- Technical fields in Tools (embed_type, embed_code, tool_route_key, primary_inputs)
