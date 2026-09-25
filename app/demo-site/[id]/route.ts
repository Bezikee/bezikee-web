import { NextResponse } from 'next/server'

import { findDemoHtml } from '@admin/lib/demo/store'

/**
 * Serves one generated demo site. Public by design: the UUID in the link is the
 * access control (see src/admin/lib/demo/url.ts).
 *
 * Reached only through demo.bezikee.com/<uuid>, which proxy.ts rewrites here.
 * On bezikee.com itself the proxy answers 404 for this path, so model-written
 * HTML never runs on the origin that holds the admin session.
 */
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, ctx: RouteContext<'/demo-site/[id]'>) {
  const { id } = await ctx.params

  const html = await findDemoHtml(id.toLowerCase())
  if (!html) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' },
    })
  }

  return new NextResponse(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // A rebuild keeps the URL, so a cached copy would show the old page. These
      // are viewed a handful of times; freshness wins.
      'cache-control': 'no-store',
      // The page is model-written. It draws everything inline and needs no
      // network, no script and no framing, so it gets none of them.
      'content-security-policy':
        "default-src 'none'; img-src data:; style-src 'unsafe-inline'; font-src data:; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
      'x-content-type-options': 'nosniff',
      // Shared by link, never meant to be found: keep it out of search results,
      // and keep the secret URL out of the Referer when someone taps the Maps link.
      'x-robots-tag': 'noindex, nofollow',
      'referrer-policy': 'no-referrer',
    },
  })
}
