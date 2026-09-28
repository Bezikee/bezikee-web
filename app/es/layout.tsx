import { SiteChrome } from '../../src/components/SiteChrome'

// The Spanish site: every public page again, under /es/. Outside the (site) group so it
// doesn't inherit the English chrome.
//
// The root layout is shared with English and the admin panel and renders <html lang="en">;
// a nested layout can't change that attribute, so this script corrects it before the page
// paints. The root <html> carries suppressHydrationWarning so React accepts the difference.
export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: "document.documentElement.lang='es'" }} />
      <SiteChrome locale="es">{children}</SiteChrome>
    </>
  )
}
