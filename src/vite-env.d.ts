/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Canonical origin for this deploy, no trailing slash. Set in the Vercel
  // dashboard when the custom domain lands; falls back to the .vercel.app URL.
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
