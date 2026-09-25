import { NextResponse, type NextRequest } from 'next/server'

import {
  SESSION_COOKIE,
  accessPassword,
  passwordMatches,
  verifySessionToken,
} from '@admin/lib/auth'
import { absoluteUrl } from '@admin/lib/http'
import { demoHost, isDemoId } from '@admin/lib/demo/url'

/**
 * Two jobs, both about keeping things apart.
 *
 * 1. demo.bezikee.com serves generated demo sites and nothing else. `/<uuid>`
 *    is rewritten to the internal route that reads the page from the database;
 *    every other path on that host is a 404, so the marketing site and the
 *    admin panel can't be reached through it.
 *
 * 2. /admin and /api/admin sit behind the shared password. Everything else on
 *    bezikee.com passes straight through — and mostly never gets here, because
 *    the matcher below only sends admin and demo traffic to this function.
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

  return NextResponse.next()
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
    // Only what needs a decision. The public pages never invoke this function,
    // which keeps them as fast and cheap as they were before the admin existed.
    '/admin/:path*',
    '/api/admin/:path*',
    '/demo-site/:path*',
    // Any path on a demo.* host. The exact host is checked above against
    // DEMO_BASE_URL; this only has to be broad enough to catch it.
    { source: '/:path*', has: [{ type: 'host', value: 'demo\\..*' }] },
  ],
}
