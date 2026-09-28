import { SITE_NAME } from '../../src/seo'
import { OG_SIZE, renderOgImage } from '../../src/og'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = `${SITE_NAME} - Agencia de desarrollo de software`

export default async function Image() {
  return renderOgImage('es')
}
