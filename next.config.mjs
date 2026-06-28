/**
 * Webflow -> Next legacy redirect map.
 *
 * Two layers:
 *   1) Pattern redirects below — Webflow CMS collection routes that don't 1:1
 *      match Next.js routes. Slugs are preserved across the rewrite.
 *   2) Specific high-traffic URLs from Google Search Console export — generate
 *      via `npm run redirects:import <gsc-pages-export.csv>`, paste the output
 *      into the SPECIFIC_REDIRECTS array below.
 *
 * `permanent: true` emits a 301 (preserves SEO equity).
 * Notes on the destinations:
 *   - /blog/{slug} and /glossary/{slug} are passthroughs because Webflow and
 *     Next.js share the same path pattern — no redirect needed; Next.js handles
 *     these natively. They are NOT listed below for that reason.
 *   - Detail pages for collections that have NO dedicated Next.js route
 *     (customer_stories, customer_reviews, podcasts, webinars, ebooks, tools,
 *     faqs, videos) are routed via the generic /content/<collection>/<slug>
 *     resolver.
 *
 * @returns {Promise<Array<{ source: string, destination: string, permanent: boolean }>>}
 */
async function legacyRedirects() {
  /** @type {Array<{ source: string, destination: string, permanent: boolean }>} */
  const PATTERN_REDIRECTS = [
    // Webflow CMS detail routes -> Next.js generic /content route.
    // Each rule preserves the {slug} via Next.js redirect path parameters.
    { source: '/customer-stories/:slug', destination: '/content/customer_stories/:slug', permanent: true },
    { source: '/customer-story/:slug', destination: '/content/customer_stories/:slug', permanent: true },
    { source: '/case-studies/:slug', destination: '/content/customer_stories/:slug', permanent: true },
    { source: '/case-study/:slug', destination: '/content/customer_stories/:slug', permanent: true },

    { source: '/customer-reviews/:slug', destination: '/content/customer_reviews/:slug', permanent: true },
    { source: '/customer-review/:slug', destination: '/content/customer_reviews/:slug', permanent: true },
    { source: '/reviews/:slug', destination: '/content/customer_reviews/:slug', permanent: true },

    { source: '/podcasts/:slug', destination: '/content/podcasts/:slug', permanent: true },
    { source: '/podcast/:slug', destination: '/content/podcasts/:slug', permanent: true },

    { source: '/webinars/:slug', destination: '/content/webinars/:slug', permanent: true },
    { source: '/webinar/:slug', destination: '/content/webinars/:slug', permanent: true },

    { source: '/ebooks/:slug', destination: '/content/ebooks/:slug', permanent: true },
    { source: '/ebook/:slug', destination: '/content/ebooks/:slug', permanent: true },

    // The bare `/tools/:slug` catch-all that used to send tool URLs to the
    // (blocklisted) /content/tools route is REMOVED — the dedicated
    // /tools/[slug] route now owns tool detail pages, and a catch-all here
    // would hijack every one of them. Redirect only the known legacy slugs.
    { source: '/old-tools/:slug', destination: '/tools', permanent: true },
    { source: '/tools/corporate-tax-registration-deadline-checker-uae', destination: '/tools', permanent: true },
    { source: '/tools/corporate-tax-filing-deadline-checker-in-uae', destination: '/tools', permanent: true },
    { source: '/tools/gratuity-checker-calculator-tool-in-uae', destination: '/tools', permanent: true },
    { source: '/tools/check-financial-health-for-your-business-with-finanshels', destination: '/tools', permanent: true },
    { source: '/tools/cash-flow-scoring-system-for-your-business-with-finanshels', destination: '/tools', permanent: true },
    { source: '/tools/finance-hiring-salary-benchmark', destination: '/tools', permanent: true },
    { source: '/tools/finanshels-tools-powered-by-finanshels', destination: '/tools', permanent: true },

    { source: '/faq-questions/:slug', destination: '/content/faqs/:slug', permanent: true },
    { source: '/faq/:slug', destination: '/content/faqs/:slug', permanent: true },

    { source: '/videos/:slug', destination: '/content/videos/:slug', permanent: true },
    { source: '/video/:slug', destination: '/content/videos/:slug', permanent: true },

    // Team member detail pages don't exist publicly in Next.js — bounce to /about.
    { source: '/team/:slug', destination: '/about', permanent: true },
    { source: '/team-members/:slug', destination: '/about', permanent: true },

    // Webflow listing pages -> Next.js listing pages.
    { source: '/customer-stories', destination: '/customers', permanent: true },
    { source: '/case-studies', destination: '/customers', permanent: true },
  ]

  /** @type {Array<{ source: string, destination: string, permanent: boolean }>} */
  const SPECIFIC_REDIRECTS = [
    // Populate from GSC export via `npm run redirects:import <pages-export.csv>`.
    // Paste the generated entries here for any high-traffic legacy URL that
    // doesn't match a PATTERN_REDIRECTS rule above.
  ]

  return [...PATTERN_REDIRECTS, ...SPECIFIC_REDIRECTS]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Firebase Storage (CMS media uploads).
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
    ],
  },
  experimental: {
    serverActions: {
      /**
       * Default is 1MB — oversized forms / actions would 413.
       * Media uploads use `/api/admin/cms/media/upload`; this protects other Server Actions.
       */
      bodySizeLimit: '32mb',
    },
  },
  async redirects() {
    return legacyRedirects()
  },
}

export default nextConfig
