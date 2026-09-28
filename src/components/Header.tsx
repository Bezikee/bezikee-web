'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { localePath, splitLocale, type Dictionary, type Locale } from '../i18n'
import { LanguagePicker } from './LanguagePicker'

export function Header({ locale, t }: { locale: Locale; t: Dictionary['nav'] }) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // The page's path with the language taken off, so '/es/about/' is active for '/about'
  const { path: currentPath } = splitLocale(pathname)
  const isActive = (path: string) => currentPath === path
  const to = (path: string) => localePath(locale, path)

  const navLinks = [
    { path: '/', label: t.home },
    { path: '/services', label: t.services },
    { path: '/about', label: t.about },
    { path: '/contact', label: t.contact },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 md:h-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg/95 backdrop-blur-sm border-b border-dark-border/50">
      <Link href={to('/')} className="flex items-center gap-2 md:gap-2.5 text-xl md:text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
        {/* Explicit width/height so the row doesn't reflow once the SVG loads */}
        <img src="/bezikee-logo.svg" alt="" width={32} height={30} className="w-7 h-auto md:w-8" />
        bezikee
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={to(link.path)}
            className={`transition-colors duration-300 ${isActive(link.path) ? 'text-neon-green' : 'text-zinc-400 hover:text-neon-green'}`}
          >
            {link.label}
          </Link>
        ))}
        <LanguagePicker locale={locale} label={t.language} variant="menu" />
        <Link
          href={to('/contact')}
          className="px-5 py-2.5 xl:px-6 xl:py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover hover:scale-105 transition-all duration-300"
        >
          {t.getStarted}
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-3 -mr-2 text-white hover:text-neon-green transition-colors"
        aria-label={t.toggleMenu}
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
                href={to(link.path)}
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
            <LanguagePicker locale={locale} label={t.language} variant="inline" onPick={() => setIsMenuOpen(false)} />
            <Link
              href={to('/contact')}
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 px-4 py-3 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn text-center"
            >
              {t.getStarted}
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
