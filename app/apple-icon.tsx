import { ImageResponse } from 'next/og'
import { logoDataUri } from '../src/logo'

// Generated rather than committed as a PNG, so it always matches public/bezikee-logo.svg.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // iOS composites touch icons onto white, which would strand the mark on a bright
          // square; the site's own background keeps it looking deliberate on a home screen.
          background: '#0A0A0A',
        }}
      >
        <img src={logoDataUri()} width={124} height={116} alt="" />
      </div>
    ),
    size,
  )
}
