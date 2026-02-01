import { Link } from 'react-router-dom'
import { Linkedin, Twitter, Github, Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-12 md:py-16 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg border-t border-dark-border">
      <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-8 mb-12">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 max-w-full lg:max-w-[280px]">
          <Link to="/" className="text-2xl font-bold text-white hover:text-neon-green transition-colors duration-300">
            bezikee
          </Link>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Building digital products that drive growth for businesses across Europe.
          </p>
          <div className="flex gap-4">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Linkedin className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Twitter className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
            <a href="https://github.com/Bezikee" target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-lg bg-dark-card border border-dark-border hover:border-neon-green hover:shadow-neon transition-all duration-300">
              <Github className="w-5 h-5 text-zinc-500 hover:text-neon-green transition-colors duration-300" />
            </a>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-20">
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">Services</span>
            <Link to="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Web Development</Link>
            <Link to="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Mobile Apps</Link>
            <Link to="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Custom Software</Link>
            <Link to="/services" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">UI/UX Design</Link>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-sm font-semibold text-white">Company</span>
            <Link to="/about" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">About Us</Link>
            <Link to="/work" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Our Work</Link>
            <Link to="/contact" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Careers</Link>
            <Link to="/about" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300">Blog</Link>
          </div>
          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
            <span className="text-sm font-semibold text-white">Contact</span>
            <a href="mailto:hello@bezikee.com" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300 flex items-center gap-2">
              <Mail className="w-4 h-4 flex-shrink-0" />
              hello@bezikee.com
            </a>
            <a href="tel:+34612345678" className="text-sm text-zinc-500 hover:text-neon-green transition-colors duration-300 flex items-center gap-2">
              <Phone className="w-4 h-4 flex-shrink-0" />
              +34 612 345 678
            </a>
            <span className="text-sm text-zinc-500 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              Madrid, Spain
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-dark-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-zinc-600 text-center sm:text-left">© 2025 Bezikee. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
