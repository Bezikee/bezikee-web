import Link from 'next/link'
import { buildMetadata, notFoundMeta } from '../src/seo'
import { getDictionary } from '../src/i18n'
import { SiteChrome } from '../src/components/SiteChrome'

export const metadata = buildMetadata(notFoundMeta('en'), { indexable: false })

// The root not-found renders inside the root layout only, outside the (site) group, so it
// brings the site chrome itself to look like every other public page.
// English only: an unknown URL has no language of its own, /es/ ones included.
export default function NotFound() {
  const t = getDictionary('en').notFound
  return (
    <SiteChrome locale="en">
      <div className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="text-center">
          <h1 className="text-6xl md:text-8xl font-bold text-neon-green mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t.title}</h2>
          <p className="text-sm md:text-base text-zinc-400 mb-6 md:mb-8">{t.text}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300 text-sm md:text-base"
          >
            {t.goHome}
          </Link>
        </div>
      </div>
    </SiteChrome>
  )
}
