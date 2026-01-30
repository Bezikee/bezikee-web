import { Link, useLocation } from 'react-router-dom'

export function Header() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-20 px-20 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border/50">
      <Link to="/" className="text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
        bezikee
      </Link>
      <nav className="flex items-center gap-10">
        <Link
          to="/"
          className={`transition-colors duration-300 ${isActive('/') ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
        >
          Home
        </Link>
        <Link
          to="/services"
          className={`transition-colors duration-300 ${isActive('/services') ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
        >
          Services
        </Link>
        <Link
          to="/work"
          className={`transition-colors duration-300 ${isActive('/work') ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
        >
          Our Work
        </Link>
        <Link
          to="/about"
          className={`transition-colors duration-300 ${isActive('/about') ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
        >
          About
        </Link>
        <Link
          to="/contact"
          className={`transition-colors duration-300 ${isActive('/contact') ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
        >
          Contact
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
        >
          Get Started
        </Link>
      </nav>
    </header>
  )
}
