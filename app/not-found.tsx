import Link from 'next/link'
import { buildMetadata, NOT_FOUND_META } from '../src/seo'

export const metadata = buildMetadata(NOT_FOUND_META, { indexable: false })

export default function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-neon-green mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-sm md:text-base text-zinc-400 mb-6 md:mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300 text-sm md:text-base"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
