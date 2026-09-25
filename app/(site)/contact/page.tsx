import { Contact } from '../../../src/views/Contact'
import { buildMetadata, PAGES } from '../../../src/seo'

export const metadata = buildMetadata(PAGES.find((p) => p.path === '/contact')!)

export default function Page() {
  return <Contact />
}
