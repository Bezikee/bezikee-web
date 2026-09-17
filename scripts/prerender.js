// Renders every route to static HTML after `vite build`, so crawlers that don't run
// JavaScript (AI bots, link previews) get full page content, and GitHub Pages serves
// each route as a real file with a 200 status instead of the 404 fallback.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = '/bezikee-web'
const distDir = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render, PAGES, NOT_FOUND_META, SITE_URL, SITE_NAME, canonicalUrl } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8')

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function headTags(meta, { indexable }) {
  const tags = []
  if (indexable) {
    const url = canonicalUrl(meta.path)
    tags.push(
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
    )
  } else {
    tags.push('<meta name="robots" content="noindex" />')
  }
  tags.push(
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
  )
  if (meta.path === '/') {
    const organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      description: meta.description,
    }
    tags.push(`<script type="application/ld+json">${JSON.stringify(organization)}</script>`)
  }
  return tags.join('\n    ')
}

function buildPage(url, meta, options) {
  const appHtml = render(`${BASE}${url}`)
  if (!appHtml.includes('<main')) {
    throw new Error(`Rendering ${url} produced no page content`)
  }

  // Function replacers so "$" sequences in the content aren't treated as replacement patterns
  const html = template
    .replace(/<title>.*?<\/title>/, () => `<title>${escapeHtml(meta.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      () => `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    )
    .replace('<!--app-head-->', () => headTags(meta, options))
    .replace('<!--app-html-->', () => appHtml)

  if (html.includes('<!--app-html-->') || html.includes('<!--app-head-->')) {
    throw new Error(`Placeholders were not replaced for ${url}`)
  }
  return html
}

for (const page of PAGES) {
  const file = page.path === '/' ? 'index.html' : path.join(page.path.slice(1), 'index.html')
  const outFile = path.join(distDir, file)
  fs.mkdirSync(path.dirname(outFile), { recursive: true })
  fs.writeFileSync(outFile, buildPage(page.path, page, { indexable: true }))
  console.log(`prerendered ${page.path} -> ${path.relative(root, outFile)}`)
}

// GitHub Pages serves 404.html (with a 404 status) for unknown URLs
fs.writeFileSync(
  path.join(distDir, '404.html'),
  buildPage(NOT_FOUND_META.path, NOT_FOUND_META, { indexable: false }),
)
console.log('prerendered 404 -> dist/404.html')

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.map((page) => `  <url><loc>${canonicalUrl(page.path)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap)
console.log('wrote dist/sitemap.xml')

fs.rmSync(ssrDir, { recursive: true, force: true })
