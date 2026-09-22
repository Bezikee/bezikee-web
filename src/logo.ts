import { readFileSync } from 'node:fs'
import { join } from 'node:path'

// Satori (next/og) can't fetch a URL while rendering, so anything drawing the mark into an
// image reads it off disk instead. Shared so the icon and the social card can't drift apart.
export function logoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), 'public', 'bezikee-logo.svg'))
  return `data:image/svg+xml;base64,${svg.toString('base64')}`
}
