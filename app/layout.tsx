import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Header } from '../src/components/Header'
import { Footer } from '../src/components/Footer'
import { NeonParticles } from '../src/components/NeonParticles'
import { CustomCursor } from '../src/components/CustomCursor'
import { ScrollProgress } from '../src/components/ScrollProgress'
import { PageTransition } from '../src/components/PageTransition'
import { SITE_NAME, SITE_URL } from '../src/seo'
import './globals.css'

// Self-hosted by Next, replacing the Google Fonts <link> the Vite index.html carried:
// same family and weights, but no render-blocking request to a third-party origin.
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} - Software Development Agency`, template: `%s` },
  icons: { icon: '/vite.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
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
      </body>
    </html>
  )
}
