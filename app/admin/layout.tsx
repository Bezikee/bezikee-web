import type { Metadata } from 'next'

import { Nav } from '@admin/components/nav'
import { accessPassword } from '@admin/lib/auth'
import './admin.css'

export const metadata: Metadata = {
  title: 'Admin · Bezikee',
  // Behind a password anyway, but there is no reason for a crawler that finds the login
  // page to list it.
  robots: { index: false, follow: false },
}

// Every admin page reads the database or the session; none of it can be prerendered.
export const dynamic = 'force-dynamic'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-theme min-h-screen font-inter antialiased">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Nav showSignOut={accessPassword() !== null} />
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
