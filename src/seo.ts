// Drives canonical tags, og:url and sitemap.xml. Override with VITE_SITE_URL in the
// Vercel dashboard when the custom domain is ready — no code change needed.
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://bezikee-web.vercel.app'
export const SITE_NAME = 'Bezikee'

export interface PageMeta {
  path: string
  title: string
  description: string
}

// Every route listed here is prerendered to static HTML and included in the sitemap
export const PAGES: PageMeta[] = [
  {
    path: '/',
    title: 'Bezikee - Software Development Agency',
    description:
      'Bezikee is a software development agency in Madrid building websites, mobile apps and custom software that help businesses across Europe grow.',
  },
  {
    path: '/services',
    title: 'Services & Pricing - Bezikee',
    description:
      'Web development, mobile apps, custom software and UI/UX design. See how we work and choose the package that fits your business.',
  },
  {
    path: '/about',
    title: 'About Us - Bezikee',
    description:
      'Bezikee is a new software development agency helping businesses get well-built websites, apps and custom software. Learn what drives us.',
  },
  {
    path: '/contact',
    title: 'Contact - Bezikee',
    description:
      'Tell us about your project. Get in touch with Bezikee to discuss websites, apps and custom software for your business.',
  },
]

export const NOT_FOUND_META: PageMeta = {
  path: '/404',
  title: 'Page Not Found - Bezikee',
  description: "The page you're looking for doesn't exist or has been moved.",
}

// Strips the trailing slash GitHub Pages adds to directory URLs ("/about/" -> "/about")
export function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function getPageMeta(pathname: string): PageMeta {
  const path = normalizePath(pathname)
  return PAGES.find((page) => page.path === path) ?? NOT_FOUND_META
}

// Canonical URLs use the trailing-slash form GitHub Pages serves without a redirect
export function canonicalUrl(path: string): string {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}/`
}
