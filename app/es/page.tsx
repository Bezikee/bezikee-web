import { Home } from '../../src/views/Home'
import { organizationLd, pageMetadata } from '../../src/seo'

export const metadata = pageMetadata('home', 'es')

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd('es')) }}
      />
      <Home locale="es" />
    </>
  )
}
