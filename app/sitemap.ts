import type { MetadataRoute } from 'next'
import { PAGES, canonicalUrl } from '../src/seo'

// Replaces the sitemap scripts/prerender.js wrote by hand; same URLs, same trailing slashes.
// No lastModified: it would be the build date, which would tell crawlers every page changed
// on every deploy. An absent lastmod is better than one that cries wolf.
export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((page) => ({ url: canonicalUrl(page.path) }))
}
