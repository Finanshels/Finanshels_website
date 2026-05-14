// FIX-033: incoming/reverse reference declarations extracted from
// collectionDefinitions.ts. Powers the "where this is used" panel on every
// CMS document.
import type { CmsCollectionKey } from '../collectionDefinitions'

/**
 * Reverse-reference declarations. For each "target" collection we list which
 * source-collection fields reference items in it. Used to power the
 * "where this is used" panel on every CMS document.
 */
export type IncomingReferenceSpec = {
  source: CmsCollectionKey
  field: string
  label: string
  multi: boolean
}

export const CMS_INCOMING_REFERENCES: Record<CmsCollectionKey, IncomingReferenceSpec[]> = {
  team_members: [
    { source: 'blog_posts', field: 'author', label: 'Authored blog posts', multi: false },
    { source: 'videos', field: 'speakerRefs', label: 'Featured in videos', multi: true },
    { source: 'podcasts', field: 'hostRefs', label: 'Hosted podcasts', multi: true },
    { source: 'webinars', field: 'speakerRefs', label: 'Hosted webinars', multi: true },
    { source: 'ebooks', field: 'authorRefs', label: 'Authored ebooks', multi: true },
    { source: 'customer_stories', field: 'leadAuthorRef', label: 'Owned stories', multi: false },
  ],
  our_customers: [
    { source: 'customer_reviews', field: 'customerRef', label: 'Reviews from this customer', multi: false },
    { source: 'customer_stories', field: 'customerRef', label: 'Stories from this customer', multi: false },
  ],
  customer_reviews: [
    { source: 'customer_stories', field: 'reviewRefs', label: 'Stories that cite this review', multi: true },
    { source: 'review_sources', field: 'reviewRefs', label: 'Source-listed reviews', multi: true },
  ],
  faq_topics: [
    { source: 'faq_questions', field: 'topicRef', label: 'Questions in this topic', multi: false },
  ],
  faq_questions: [
    { source: 'glossary_terms', field: 'relatedFaqRefs', label: 'Glossaries citing this question', multi: true },
    { source: 'blog_posts', field: 'relatedFaqRefs', label: 'Blogs citing this question', multi: true },
  ],
  glossary_terms: [
    { source: 'blog_posts', field: 'relatedGlossaryRefs', label: 'Blogs citing this term', multi: true },
    { source: 'glossary_terms', field: 'relatedTermRefs', label: 'Glossaries citing this term', multi: true },
  ],
  blog_posts: [
    { source: 'blog_posts', field: 'relatedPostRefs', label: 'Blogs citing this post', multi: true },
    { source: 'glossary_terms', field: 'relatedBlogRefs', label: 'Glossaries citing this post', multi: true },
    { source: 'ebooks', field: 'relatedBlogRefs', label: 'Ebooks citing this post', multi: true },
    { source: 'webinars', field: 'relatedBlogRefs', label: 'Webinars citing this post', multi: true },
  ],
  videos: [
    { source: 'blog_posts', field: 'relatedVideoRefs', label: 'Blogs embedding this video', multi: true },
    { source: 'webinars', field: 'recordingRef', label: 'Webinar recordings', multi: false },
  ],
  podcasts: [
    { source: 'blog_posts', field: 'relatedPodcastRefs', label: 'Blogs citing this podcast', multi: true },
  ],
  ebooks: [
    { source: 'blog_posts', field: 'relatedEbookRefs', label: 'Blogs citing this ebook', multi: true },
  ],
  webinars: [
    { source: 'blog_posts', field: 'relatedWebinarRefs', label: 'Blogs citing this webinar', multi: true },
  ],
  customer_stories: [],
  tools: [
    { source: 'blog_posts', field: 'relatedToolRefs', label: 'Blogs embedding this tool', multi: true },
    { source: 'glossary_terms', field: 'relatedToolRefs', label: 'Glossaries embedding this tool', multi: true },
  ],
  review_sources: [
    { source: 'customer_reviews', field: 'sourceRef', label: 'Reviews from this source', multi: false },
  ],
  media_assets: [
    { source: 'blog_posts', field: 'heroImageAssetRef', label: 'Hero image of blog posts', multi: false },
  ],
}
