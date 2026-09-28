import { About } from '../../../src/views/About'
import { pageMetadata } from '../../../src/seo'

export const metadata = pageMetadata('about', 'es')

export default function Page() {
  return <About locale="es" />
}
