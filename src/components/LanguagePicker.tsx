'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Check, ChevronDown, Languages } from 'lucide-react'
import {
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_NAMES,
  localePath,
  splitLocale,
  type Locale,
} from '../i18n'

// The trailing-slash form the site serves, so a full page load doesn't cost a redirect
const withSlash = (path: string) => (path.endsWith('/') ? path : `${path}/`)

// Remembered before navigating, so the proxy sees an explicit choice and doesn't send a
// visitor from Spain straight back to the Spanish page they just left
function rememberChoice(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`
}

interface LanguagePickerProps {
  locale: Locale
  label: string
  // 'menu' drops a list down from the header; 'inline' lays the options side by side,
  // for the mobile menu where a dropdown inside a dropdown would be fiddly
  variant: 'menu' | 'inline'
  onPick?: () => void
}

// Shows the language the page is in and lets you pick another. The options are plain <a>
// links, not <Link>: each language has its own layout, and a full load is what brings its
// <html lang> along. It also means nothing is prefetched past the proxy before the cookie
// is set.
export function LanguagePicker({ locale, label, variant, onPick }: LanguagePickerProps) {
  const { path } = splitLocale(usePathname())
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [isOpen])

  const option = (target: Locale, className: string) => {
    const current = target === locale
    return (
      <a
        key={target}
        href={withSlash(localePath(target, path))}
        hrefLang={target}
        lang={target}
        aria-current={current ? 'true' : undefined}
        onClick={(e) => {
          if (current) {
            e.preventDefault()
          } else {
            rememberChoice(target)
          }
          setIsOpen(false)
          onPick?.()
        }}
        className={className}
      >
        {LOCALE_NAMES[target]}
        {current && variant === 'menu' && <Check className="w-4 h-4 text-neon-green" />}
      </a>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 px-4 py-3" role="group" aria-label={label}>
        <Languages className="w-4 h-4 text-zinc-500 flex-shrink-0" aria-hidden="true" />
        <div className="flex gap-1 p-1 rounded-lg bg-dark-card border border-dark-border">
          {LOCALES.map((target) =>
            option(
              target,
              `px-3 py-1.5 rounded-md text-sm transition-colors duration-300 ${
                target === locale ? 'bg-neon-green/15 text-neon-green' : 'text-zinc-400 hover:text-neon-green'
              }`,
            ),
          )}
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${label}: ${LOCALE_NAMES[locale]}`}
        className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-neon-green transition-colors duration-300"
      >
        <Languages className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        {locale.toUpperCase()}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 min-w-[160px] p-1.5 rounded-lg bg-dark-card border border-dark-border shadow-neon">
          {LOCALES.map((target) =>
            option(
              target,
              `flex items-center justify-between gap-4 px-3 py-2 rounded-md text-sm transition-colors duration-300 ${
                target === locale ? 'text-white' : 'text-zinc-400 hover:text-neon-green hover:bg-dark-bg'
              }`,
            ),
          )}
        </div>
      )}
    </div>
  )
}
