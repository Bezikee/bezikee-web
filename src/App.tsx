import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Contact } from './pages/Contact'
import { Services } from './pages/Services'
import { About } from './pages/About'
import { Work } from './pages/Work'
import { NeonParticles } from './components/NeonParticles'
import { CustomCursor } from './components/CustomCursor'
import { ScrollProgress } from './components/ScrollProgress'
import { PageTransition } from './components/PageTransition'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function AppContent() {
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
        <Header />
        <main>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
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
    <div className="pt-20 min-h-screen flex items-center justify-center px-20">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-neon-green mb-4">404</h1>
        <h2 className="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-zinc-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default App
