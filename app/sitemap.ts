import type { MetadataRoute } from 'next'
import { PAGE_PATHS, canonicalUrl, languageAlternates, type PageKey } from '../src/seo'
import { LOCALES, localePath } from '../src/i18n'

// Replaces the sitemap scripts/prerender.js wrote by hand; same URLs, same trailing slashes,
// now with each page's Spanish copy listed too and every entry naming its translations.
// No lastModified: it would be the build date, which would tell crawlers every page changed
// on every deploy. An absent lastmod is better than one that cries wolf.
export default function sitemap(): MetadataRoute.Sitemap {
  return LOCALES.flatMap((locale) =>
    (Object.keys(PAGE_PATHS) as PageKey[]).map((key) => ({
      url: canonicalUrl(localePath(locale, PAGE_PATHS[key])),
      alternates: { languages: languageAlternates(key) },
    })),
  )
}
