import {
  CMS_COLLECTION_DEFINITION_MAP,
  getAllFields,
  type CmsCollectionDefinition,
  type CmsCollectionKey,
  type CmsFieldDefinition,
} from './collectionDefinitions'

export type CmsCreateTemplate = {
  id: string
  label: string
  description: string
  values: Record<string, unknown>
}

export type CmsCreateProfile = {
  collection: CmsCollectionKey
  heading: string
  tagline?: string
  fields: string[]
  templates?: CmsCreateTemplate[]
}

const PROFILES: Record<CmsCollectionKey, CmsCreateProfile> = {
  blog_posts: {
    collection: 'blog_posts',
    heading: 'New blog post',
    tagline:
      'Title, author, and category are enough to start a draft. The body and SEO come later.',
    fields: ['title', 'excerpt', 'author', 'blog_category', 'publish_date'],
    templates: [
      { id: 'blank', label: 'Blank', description: 'Start from scratch.', values: {} },
      {
        id: 'how_to',
        label: 'How-to article',
        description: 'Step-by-step tutorial format.',
        values: { excerpt: 'A practical step-by-step guide.' },
      },
      {
        id: 'industry_update',
        label: 'Industry update',
        description: 'News, changes, and analysis.',
        values: { excerpt: 'What changed and what it means.' },
      },
    ],
  },
  podcasts: {
    collection: 'podcasts',
    heading: 'New podcast episode',
    fields: ['episode_title', 'episode_number', 'audio_url', 'hosts', 'publish_date'],
  },
  customer_reviews: {
    collection: 'customer_reviews',
    heading: 'New customer review',
    tagline: 'Capture the quote and who said it. Photos and detail come later.',
    fields: [
      'customer_name',
      'rating',
      'review_text',
      'approved_for_publication',
    ],
  },
  customer_stories: {
    collection: 'customer_stories',
    heading: 'New customer story',
    tagline: 'Pick the customer and frame the outcome. Build the case study on the full editor.',
    fields: ['story_title', 'customer', 'industry', 'challenge_summary', 'publish_date'],
    templates: [
      { id: 'blank', label: 'Blank', description: 'Start from scratch.', values: {} },
      {
        id: 'case_study',
        label: 'Case study',
        description: 'Challenge → solution → results.',
        values: {
          challenge_summary:
            'Describe the situation the customer was in before working with us.',
        },
      },
      {
        id: 'migration_story',
        label: 'Migration story',
        description: 'Customer moved from another provider.',
        values: {
          challenge_summary:
            'Customer was on a competing platform and needed to migrate.',
        },
      },
    ],
  },
  our_customers: {
    collection: 'our_customers',
    heading: 'New customer',
    fields: ['company_name', 'logo', 'industry', 'relationship_type'],
  },
  tools: {
    collection: 'tools',
    heading: 'New tool',
    fields: ['tool_name', 'tool_type', 'short_description', 'tool_embed_type', 'tool_route_key'],
  },
  ebooks: {
    collection: 'ebooks',
    heading: 'New ebook',
    fields: ['ebook_title', 'cover_image', 'short_description', 'file_upload', 'format'],
  },
  webinars: {
    collection: 'webinars',
    heading: 'New webinar',
    tagline:
      'Title, schedule, and registration link — the rest can be filled in once published.',
    fields: ['webinar_title', 'webinar_status', 'start_datetime', 'timezone', 'registration_url'],
  },
  glossary_terms: {
    collection: 'glossary_terms',
    heading: 'New glossary term',
    fields: ['term', 'definition_short', 'definition_full', 'term_category', 'alphabet_letter'],
  },
  faqs: {
    collection: 'faqs',
    heading: 'New FAQ',
    tagline: 'Ask one question, give one answer. Group by topic later.',
    fields: ['question', 'answer', 'topic'],
  },
  team_members: {
    collection: 'team_members',
    heading: 'New team member',
    fields: ['full_name', 'job_title', 'photo', 'short_bio'],
  },
  media_assets: {
    collection: 'media_assets',
    heading: 'New media asset',
    fields: ['title', 'assetType', 'assetUrl', 'altText'],
  },
  videos: {
    collection: 'videos',
    heading: 'New video',
    fields: ['video_title', 'video_url', 'description', 'thumbnail_image'],
  },
  review_sources: {
    collection: 'review_sources',
    heading: 'New review source',
    fields: ['source_name', 'icon', 'source_url'],
  },
}

export function getCreateProfile(collection: CmsCollectionKey): CmsCreateProfile {
  return PROFILES[collection]
}

export function getCreateProfileFields(
  profile: CmsCreateProfile,
  definition: CmsCollectionDefinition
): CmsFieldDefinition[] {
  const all = getAllFields(definition)
  const byName = new Map(all.map((f) => [f.name, f]))
  const resolved: CmsFieldDefinition[] = []
  for (const name of profile.fields) {
    const field = byName.get(name)
    if (!field) {
      throw new Error(
        `createProfiles: field "${name}" on collection "${profile.collection}" does not exist in collection definition`
      )
    }
    resolved.push(field)
  }
  return resolved
}

export function validateAllProfiles(): string[] {
  const problems: string[] = []
  for (const key of Object.keys(PROFILES) as CmsCollectionKey[]) {
    const profile = PROFILES[key]
    const definition = CMS_COLLECTION_DEFINITION_MAP[key]
    if (!definition) {
      problems.push(`Profile "${key}" has no matching collection definition`)
      continue
    }
    if (profile.collection !== key) {
      problems.push(`Profile "${key}" has mismatched collection field "${profile.collection}"`)
    }
    const names = new Set(getAllFields(definition).map((f) => f.name))
    for (const fieldName of profile.fields) {
      if (!names.has(fieldName)) {
        problems.push(`Profile "${key}" references unknown field "${fieldName}"`)
      }
    }
    if (profile.templates) {
      for (const template of profile.templates) {
        for (const valueKey of Object.keys(template.values)) {
          if (!names.has(valueKey)) {
            problems.push(
              `Profile "${key}" template "${template.id}" sets unknown field "${valueKey}"`
            )
          }
        }
      }
    }
  }
  return problems
}

export const CMS_CREATE_PROFILES = PROFILES
