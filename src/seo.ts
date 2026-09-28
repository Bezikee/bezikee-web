import type { Metadata } from 'next'
import { LOCALES, getDictionary, localePath, type Locale } from './i18n'

// Drives canonical tags, og:url and sitemap.xml. Must stay the domain the site is
// actually served from — pointing it elsewhere tells crawlers to deindex this one.
export const SITE_URL = 'https://bezikee.com'
export const SITE_NAME = 'Bezikee'

export type PageKey = 'home' | 'services' | 'about' | 'contact'

export interface PageMeta {
  path: string
  title: string
  description: string
}

// Every route listed here is prerendered to static HTML, in every language, and included
// in the sitemap. The paths are the English ones; localePath() gives the others.
export const PAGE_PATHS: Record<PageKey, string> = {
  home: '/',
  services: '/services',
  about: '/about',
  contact: '/contact',
}

export function pageMeta(key: PageKey, locale: Locale): PageMeta {
  return { path: localePath(locale, PAGE_PATHS[key]), ...getDictionary(locale).meta[key] }
}

export function notFoundMeta(locale: Locale): PageMeta {
  return { path: localePath(locale, '/404'), ...getDictionary(locale).meta.notFound }
}

// Strips the trailing slash GitHub Pages adds to directory URLs ("/about/" -> "/about")
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

// Canonical URLs use the trailing-slash form GitHub Pages serves without a redirect
export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`
}

// Tells crawlers each page's translations, so a search from Mexico lists /es/ and one
// from London the English page. x-default is where anyone else lands: English.
export function languageAlternates(key: PageKey): Record<string, string> {
  const alternates: Record<string, string> = {}
  for (const locale of LOCALES) alternates[locale] = canonicalUrl(localePath(locale, PAGE_PATHS[key]))
  alternates['x-default'] = canonicalUrl(PAGE_PATHS[key])
  return alternates
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_GB', es: 'es_ES' }

// Mirrors the head tags scripts/prerender.js used to emit by hand, so the migration to
// Next's Metadata API doesn't silently drop any of them.
export function buildMetadata(
  meta: PageMeta,
  { indexable = true, locale = 'en', page }: { indexable?: boolean; locale?: Locale; page?: PageKey } = {},
): Metadata {
  const url = canonicalUrl(meta.path)
  return {
    title: meta.title,
    description: meta.description,
    ...(indexable
      ? { alternates: { canonical: url, ...(page ? { languages: languageAlternates(page) } : {}) } }
      : { robots: { index: false, follow: true } }),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      locale: OG_LOCALE[locale],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      ...(indexable ? { url } : {}),
    },
    twitter: {
      // summary_large_image, not summary: app/opengraph-image.tsx is 1200x630, which a
      // plain summary card would shrink to a small square thumbnail
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  }
}

// What each page file exports as `metadata`: page `key` in `locale`
export function pageMetadata(key: PageKey, locale: Locale): Metadata {
  return buildMetadata(pageMeta(key, locale), { locale, page: key })
}

// Carried over from scripts/prerender.js, which emitted this only on the home page, then
// widened with the email address the Contact page already publishes. sameAs lists only
// the real profile: the footer's other two links point at platform home pages, not at
// Bezikee accounts, and naming those as the organisation's own profiles would be false.
export function organizationLd(locale: Locale) {
  const home = pageMeta('home', locale)
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: canonicalUrl(home.path),
    description: home.description,
    image: `${SITE_URL}${localePath(locale, '/opengraph-image')}`,
    email: 'wearebezikee@gmail.com',
    areaServed: 'Europe',
    sameAs: ['https://github.com/Bezikee'],
  }
}
