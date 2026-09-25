import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
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
}

// Shared by the public site and the admin panel, so it holds only what both need. The
// site's header, footer and effects are in app/(site)/layout.tsx via SiteChrome.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
