import { Home } from '../src/views/Home'
import { buildMetadata, PAGES, SITE_NAME, SITE_URL } from '../src/seo'

const home = PAGES.find((p) => p.path === '/')!

export const metadata = buildMetadata(home)

// Carried over from scripts/prerender.js, which emitted this only on the home page, then
// widened with the contact details the Contact page already publishes. sameAs lists only
// the real profile: the footer's other two links point at platform home pages, not at
// Bezikee accounts, and naming those as the organisation's own profiles would be false.
const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  description: home.description,
  image: `${SITE_URL}/opengraph-image`,
  email: 'hello@bezikee.com',
  telephone: '+34612345678',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Madrid',
    addressCountry: 'ES',
  },
  areaServed: 'Europe',
  sameAs: ['https://github.com/Bezikee'],
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
