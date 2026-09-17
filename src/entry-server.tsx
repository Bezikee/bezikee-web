import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { AppContent } from './App.tsx'

export { PAGES, NOT_FOUND_META, SITE_URL, SITE_NAME, canonicalUrl } from './seo'

export function render(url: string): string {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url} basename="/bezikee-web">
        <AppContent />
      </StaticRouter>
    </React.StrictMode>,
  )
}
