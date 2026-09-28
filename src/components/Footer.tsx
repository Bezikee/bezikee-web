import Link from 'next/link'
import { Linkedin, Mail } from 'lucide-react'
import { localePath, type Dictionary, type Locale } from '../i18n'

export function Footer({ locale, t }: { locale: Locale; t: Dictionary['footer'] }) {
  const to = (path: string) => localePath(locale, path)

  return (
    <footer className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg border-t border-dark-border">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 mb-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-full lg:max-w-[280px]">
          <Link href={to('/')} className="flex items-center gap-2.5 text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
            <img src="/bezikee-logo.svg" alt="" width={32} height={30} className="w-8 h-auto" />
            bezikee
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            {t.tagline}
          </p>
          <div className="flex gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Linkedin className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">{t.services}</span>
            <Link href={to('/services')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.webDevelopment}</Link>
            <Link href={to('/services')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.mobileApps}</Link>
            <Link href={to('/services')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.customSoftware}</Link>
            <Link href={to('/services')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.uiux}</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">{t.company}</span>
            <Link href={to('/about')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.aboutUs}</Link>
            <Link href={to('/contact')} className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">{t.contact}</Link>
          </div>
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="text-sm font-semibold text-white">{t.contactHeading}</span>
            <a href="mailto:wearebezikee@gmail.com" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300 flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              wearebezikee@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-zinc-600 text-center sm:text-left">© {new Date().getFullYear()} Bezikee. {t.rights}</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{t.privacy}</Link>
          <Link href="/terms" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">{t.terms}</Link>
        </div>
      </div>
    </footer>
  )
}
