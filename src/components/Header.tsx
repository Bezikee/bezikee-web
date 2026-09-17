import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { normalizePath } from '../seo'

export function Header() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => normalizePath(location.pathname) === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border/50">
      <Link to="/" className="text-xl md:text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
        bezikee
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`transition-colors duration-300 ${isActive(link.path) ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
          >
            {link.label}
          </Link>
        ))}
        <Link
          to="/contact"
          className="px-5 py-2.5 xl:px-6 xl:py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
        >
          Get Started
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-3 -mr-2 text-white hover:text-neon-green transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 md:top-20 left-0 right-0 z-50 bg-dark-bg border-b border-dark-border shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-zinc-400 hover:text-neon-green hover:bg-dark-card'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 px-4 py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn text-center"
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
