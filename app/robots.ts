import type { MetadataRoute } from 'next'
import { SITE_URL } from '../src/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    // The admin panel is behind a password and marks itself noindex; this keeps
    // well-behaved crawlers from knocking on it at all.
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
