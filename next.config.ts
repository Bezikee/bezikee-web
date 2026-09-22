import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // The live site serves /about/ and friends with a trailing slash, and seo.ts emits
  // canonical URLs in that form. Keep it so the migration doesn't redirect indexed URLs.
  trailingSlash: true,
}

export default nextConfig
