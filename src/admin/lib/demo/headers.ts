/**
 * Response headers for a published demo page.
 *
 * Shared by the public route (app/demo-site/[id]) and the local preview the
 * site agent reviews (src/admin/lib/generate/preview.ts), so what the agent sees
 * in its screenshots is exactly what an owner sees on demo.bezikee.com: the
 * same blocked scripts, the same blocked network.
 */
export const DEMO_PAGE_HEADERS: Record<string, string> = {
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
}
