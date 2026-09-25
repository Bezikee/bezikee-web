import { SiteChrome } from '../../src/components/SiteChrome'

// A route group: the public pages keep their URLs (/about/, /contact/...) and share the
// site chrome, while /admin sits outside the group with a layout of its own.
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>
}
