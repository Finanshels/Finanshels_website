/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      /**
       * Default is 1MB — oversized forms / actions would 413.
       * Media uploads use `/api/admin/cms/media/upload`; this protects other Server Actions.
       */
      bodySizeLimit: '32mb',
    },
  },
}

export default nextConfig
