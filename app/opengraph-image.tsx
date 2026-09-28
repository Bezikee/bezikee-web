import { SITE_NAME } from '../src/seo'
import { OG_SIZE, renderOgImage } from '../src/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = `${SITE_NAME} - Software Development Agency`

export default async function Image() {
  return renderOgImage('en')
}
