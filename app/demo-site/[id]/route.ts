import { NextResponse } from 'next/server'

import { DEMO_PAGE_HEADERS } from '@admin/lib/demo/headers'
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

  return new NextResponse(html, { headers: DEMO_PAGE_HEADERS })
}
