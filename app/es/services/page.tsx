import { Services } from '../../../src/views/Services'
import { pageMetadata } from '../../../src/seo'

export const metadata = pageMetadata('services', 'es')

export default function Page() {
  return <Services locale="es" />
}
