/**
 * Webflow -> Next legacy redirect map.
 * Populate via `npm run redirects:import` once GSC export lands.
 * Use `permanent: true` for 301s (preserves SEO equity).
 *
 * @returns {Promise<Array<{ source: string, destination: string, permanent: boolean }>>}
 */
async function legacyRedirects() {
  return [
    // Populate via `npm run redirects:import` once GSC export is available.
  ]
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
