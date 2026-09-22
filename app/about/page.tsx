import { About } from '../../src/views/About'
import { buildMetadata, PAGES } from '../../src/seo'

export const metadata = buildMetadata(PAGES.find((p) => p.path === '/about')!)

export default function Page() {
  return <About />
}
