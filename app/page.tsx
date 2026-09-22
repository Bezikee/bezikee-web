import { Home } from '../src/views/Home'
import { buildMetadata, PAGES, SITE_NAME, SITE_URL } from '../src/seo'

const home = PAGES.find((p) => p.path === '/')!

export const metadata = buildMetadata(home)

// Carried over from scripts/prerender.js, which emitted this only on the home page
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: home.description,
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Home />
    </>
  )
}
