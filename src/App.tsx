import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Contact } from './pages/Contact'
import { Services } from './pages/Services'
import { About } from './pages/About'
import { NeonParticles } from './components/NeonParticles'
import { CustomCursor } from './components/CustomCursor'
import { ScrollProgress } from './components/ScrollProgress'
import { PageTransition } from './components/PageTransition'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageMeta } from './seo'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Keep the title and description in sync on client-side navigation
// (prerendered HTML already has the right values for the first load)
function DocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = getPageMeta(pathname)
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [pathname])

  return null
}

export function AppContent() {
  return (
    <div className="min-h-screen bg-dark-bg font-inter relative">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* Global Neon Particle Background */}
      <NeonParticles />

      {/* Main Content */}
      <div className="relative z-10">
        <ScrollToTop />
        <DocumentMeta />
        <Header />
        <main>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              {/* Catch all for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </main>
        <Footer />
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter basename="/bezikee-web">
      <AppContent />
    </BrowserRouter>
  )
}

function NotFound() {
  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-20">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-neon-green mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-sm md:text-base text-zinc-400 mb-6 md:mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300 text-sm md:text-base"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

export default App
