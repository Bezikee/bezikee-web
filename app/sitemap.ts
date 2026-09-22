import type { MetadataRoute } from 'next'
import { PAGES, canonicalUrl } from '../src/seo'

// Replaces the sitemap scripts/prerender.js wrote by hand; same URLs, same trailing slashes
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return PAGES.map((page) => ({ url: canonicalUrl(page.path), lastModified }))
}
