import { NextResponse, type NextRequest } from 'next/server'

import {
  SESSION_COOKIE,
  accessPassword,
  passwordMatches,
  verifySessionToken,
} from '@admin/lib/auth'
import { absoluteUrl } from '@admin/lib/http'
import { demoHost, isDemoId } from '@admin/lib/demo/url'
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  detectLocale,
  localePath,
  splitLocale,
  type Locale,
} from './src/i18n/config'
import { PAGE_PATHS } from './src/seo'

/**
 * Three jobs.
 *
 * 1. demo.bezikee.com serves generated demo sites and nothing else. `/<uuid>`
 *    is rewritten to the internal route that reads the page from the database;
 *    every other path on that host is a 404, so the marketing site and the
 *    admin panel can't be reached through it.
 *
 * 2. /admin and /api/admin sit behind the shared password.
 *
 * 3. A first visit to an English page picks the visitor's language: someone in a
 *    Spanish-speaking country is sent to the /es/ copy, anyone else stays put.
 *    Either way the choice goes in a cookie, and while that cookie is set the
 *    matcher skips public pages entirely, so this runs once per visitor rather
 *    than on every page view.
 *
 * Runs on the Node.js runtime (the Next 16 default for proxy), so
 * `ADMIN_PASSWORD` is read at request time rather than frozen into the build.
 */
export async function proxy(request: NextRequest) {
  // `host` first: it is the domain the request was actually made to, where a
  // forwarded header is only as trustworthy as whoever set it.
  const host = (request.headers.get('host') ?? request.headers.get('x-forwarded-host') ?? '')
    .split(',')[0]
    .trim()
    .toLowerCase()
  const { pathname } = request.nextUrl

  if (host === demoHost()) return routeDemo(request, pathname)

  // The route that renders a demo is internal. Reachable on the main domain it
  // would put model-written HTML on bezikee.com, the origin that holds the
  // admin session cookie — the whole reason demos get their own subdomain.
  if (pathname.startsWith('/demo-site')) return notFound()

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    return gateAdmin(request, pathname)
  }

  return routeLocale(request, pathname)
}

const PUBLIC_PAGES = new Set(Object.values(PAGE_PATHS))

// Crawlers index each language at its own URL, linked by hreflang; redirecting them by
// where their datacentre happens to be would hide one version or the other.
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|embedly|preview/i

function routeLocale(request: NextRequest, pathname: string) {
  const { locale, path } = splitLocale(pathname)
  // Only English page loads are candidates. /es/ is never matched, so following a link to
  // the Spanish site always lands there, wherever you are.
  if (locale !== 'en' || !PUBLIC_PAGES.has(path)) return NextResponse.next()
  // Client-side navigations and prefetches aren't page loads: redirecting those would swap
  // the language under someone already reading the site. Next strips its own rsc markers
  // before the proxy sees them, so go by the browser's fetch metadata: page loads are
  // "document", fetch() calls "empty".
  if (request.method !== 'GET') return NextResponse.next()
  const dest = request.headers.get('sec-fetch-dest')
  if (dest && dest !== 'document') return NextResponse.next()
  if (BOT.test(request.headers.get('user-agent') ?? '')) return NextResponse.next()

  const detected = detectLocale(
    request.headers.get('x-vercel-ip-country'),
    request.headers.get('accept-language'),
  )

  if (detected === 'en') return remember(NextResponse.next(), 'en')

  const target = new URL(request.url)
  const localized = localePath(detected, path)
  target.pathname = localized.endsWith('/') ? localized : `${localized}/`
  const response = NextResponse.redirect(target, 307)
  // Depends on who is asking, so no shared cache may keep it
  response.headers.set('cache-control', 'private, no-store')
  response.headers.set('vary', 'x-vercel-ip-country, accept-language, cookie')
  return remember(response, detected)
}

function remember(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  })
  return response
}

function routeDemo(request: NextRequest, pathname: string) {
  // trailingSlash is on, so by the time a request gets here /<uuid> has already
  // been redirected to /<uuid>/.
  const match = /^\/([^/]+)\/?$/.exec(pathname)
  const id = match?.[1]?.toLowerCase()

  if (id && isDemoId(id)) {
    return NextResponse.rewrite(new URL(`/demo-site/${id}/`, request.url))
  }

  // The bare host is somebody curious; send them to the company rather than a 404.
  if (pathname === '/') return NextResponse.redirect('https://bezikee.com/', 302)

  return notFound()
}

async function gateAdmin(request: NextRequest, pathname: string) {
  const secret = accessPassword()
  const isApi = pathname.startsWith('/api/')

  if (!secret) {
    // Development convenience: `npm run dev` shouldn't demand a login.
    if (process.env.NODE_ENV !== 'production') return NextResponse.next()

    // Production without a password would mean an open lead database on a
    // public URL. Fail closed, and say why — a blank 403 would send you hunting
    // through logs. Vercel previews run as production too, so they are covered.
    return new NextResponse(
      'ADMIN_PASSWORD is not set on this deployment, so the admin panel is refusing to serve. Set it in the Vercel project environment variables and redeploy.',
      { status: 503, headers: { 'content-type': 'text/plain; charset=utf-8' } },
    )
  }

  // The login page and the handler its form posts to must stay reachable.
  // Signing out is allowed without a valid session: an expired cookie would
  // otherwise turn the Sign out button into a 401, and clearing a cookie
  // reveals nothing.
  const path = pathname.replace(/\/+$/, '')
  if (path === '/admin/login' || path === '/api/admin/login' || path === '/api/admin/logout') {
    return NextResponse.next()
  }

  // Header auth, for scripts. Checked before the cookie because a script has no
  // cookie jar to fall back on.
  const headerKey = request.headers.get('x-api-key')
  if (headerKey && passwordMatches(headerKey)) return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (await verifySessionToken(token, secret)) return NextResponse.next()

  // An API call gets a status code it can act on. Redirecting fetch() to an
  // HTML login page would surface as a JSON parse error somewhere unrelated.
  if (isApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Come back to where you were headed once you're in.
  const query = new URLSearchParams()
  if (path !== '/admin') query.set('next', `${pathname}${request.nextUrl.search}`)
  const login = query.size > 0 ? `/admin/login/?${query}` : '/admin/login/'
  return NextResponse.redirect(absoluteUrl(request, login))
}

function notFound() {
  return new NextResponse('Not found', {
    status: 404,
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

export const config = {
  matcher: [
    // Only what needs a decision. The public pages invoke this function only until the
    // visitor's language is settled, which keeps them as fast and cheap as they were
    // before the admin existed.
    '/admin/:path*',
    '/api/admin/:path*',
    '/demo-site/:path*',
    // Any path on a demo.* host. The exact host is checked above against
    // DEMO_BASE_URL; this only has to be broad enough to catch it.
    { source: '/:path*', has: [{ type: 'host', value: 'demo\\..*' }] },
    // Public pages without a remembered language (the cookie is LOCALE_COOKIE; the matcher
    // must be a literal, so the name is repeated here). Excludes the Spanish site, APIs,
    // Next's own files and anything with an extension; routeLocale narrows it to pages.
    {
      source: '/((?!es(?:/|$)|api/|_next/|admin|demo-site|.*\\.).*)',
      missing: [{ type: 'cookie', key: 'bezikee-lang' }],
    },
  ],
}
