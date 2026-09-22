import Link from 'next/link'
import { Linkedin, Twitter, Github, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg border-t border-dark-border">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 mb-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-full lg:max-w-[280px]">
          <Link href="/" className="flex items-center gap-2.5 text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
            <img src="/bezikee-logo.svg" alt="" width={32} height={30} className="w-8 h-auto" />
            bezikee
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Building digital products that drive growth for businesses across Europe.
          </p>
          <div className="flex gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Linkedin className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
            <a href="https://github.com/Bezikee" target="_blank" rel="noopener noreferrer" className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Github className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">Services</span>
            <Link href="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Web Development</Link>
            <Link href="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Mobile Apps</Link>
            <Link href="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Custom Software</Link>
            <Link href="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">UI/UX Design</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">Company</span>
            <Link href="/about" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">About Us</Link>
            <Link href="/contact" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Contact</Link>
          </div>
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="text-sm font-semibold text-white">Contact</span>
            <a href="mailto:wearebezikee@gmail.com" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300 flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              wearebezikee@gmail.com
            </a>
            <a href="tel:+34622300440" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300 flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              +34 622 300 440
            </a>
            <span className="text-sm text-zinc-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Madrid, Spain
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-zinc-600 text-center sm:text-left">© {new Date().getFullYear()} Bezikee. All rights reserved.</span>
        <div className="flex gap-6">
          <Link href="/privacy" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
