// The site's languages. English lives at the existing URLs (/about/...) so nothing already
// indexed moves; Spanish mirrors every page under /es/.
export const LOCALES = ['en', 'es'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'en'

// Each language named in itself, as the language picker lists them
export const LOCALE_NAMES: Record<Locale, string> = { en: 'English', es: 'Español' }

// Remembers the visitor's language, whether the proxy picked it or they chose it with the
// switcher. While it is set the proxy never runs for public pages (see its matcher).
export const LOCALE_COOKIE = 'bezikee-lang'
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

// Where Spanish is the main language, by ISO 3166-1 code as Vercel reports it in
// x-vercel-ip-country. The US is left out: a large Spanish-speaking population, but most
// visitors from there read English.
export const SPANISH_SPEAKING_COUNTRIES = new Set([
  'ES', 'MX', 'CO', 'AR', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO',
  'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'PR', 'GQ',
])

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

// '/contact' -> '/es/contact' for Spanish, unchanged for English. Takes and returns paths
// without the trailing slash; next.config's trailingSlash adds it on navigation.
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

// Splits '/es/contact/' into its language and the path the page has in every language.
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  const match = /^\/([a-z]{2})(\/.*)?$/.exec(trimmed)
  if (match && isLocale(match[1]) && match[1] !== DEFAULT_LOCALE) {
    return { locale: match[1], path: match[2] || '/' }
  }
  return { locale: DEFAULT_LOCALE, path: trimmed || '/' }
}

// The language to show someone arriving without a remembered choice. Location decides;
// the browser's language is only consulted when there is no location to go on, as in
// local development where no x-vercel-ip-country header is set.
export function detectLocale(country: string | null, acceptLanguage: string | null): Locale {
  if (country) return SPANISH_SPEAKING_COUNTRIES.has(country.toUpperCase()) ? 'es' : 'en'
  const primary = acceptLanguage?.split(',')[0]?.trim().toLowerCase() ?? ''
  return primary === 'es' || primary.startsWith('es-') ? 'es' : 'en'
}
