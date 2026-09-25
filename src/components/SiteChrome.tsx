import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from './Header'
import { Footer } from './Footer'
import { NeonParticles } from './NeonParticles'
import { CustomCursor } from './CustomCursor'
import { ScrollProgress } from './ScrollProgress'
import { PageTransition } from './PageTransition'

// Everything the public site wraps its pages in. Lives outside the root layout so the admin
// panel, which shares that layout, gets none of it: no header, cursor or particles, and no
// analytics counting internal page views.
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-screen bg-dark-bg font-inter relative">
        <CustomCursor />
        <ScrollProgress />
        <NeonParticles />

        <div className="relative z-10">
          <Header />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </div>
      </div>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
