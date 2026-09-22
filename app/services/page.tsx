import { Services } from '../../src/views/Services'
import { buildMetadata, PAGES } from '../../src/seo'

export const metadata = buildMetadata(PAGES.find((p) => p.path === '/services')!)

export default function Page() {
  return <Services />
}
