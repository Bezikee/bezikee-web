import { ImageResponse } from 'next/og'
import { logoDataUri } from './logo'
import { getDictionary, type Locale } from './i18n'

// Social cards were blank before this: nothing in the tree set og:image. Drawn from code
// in the site's own palette so it needs no design asset and can't drift from the brand.
// app/opengraph-image.tsx and app/es/opengraph-image.tsx each draw it in their language.
export const OG_SIZE = { width: 1200, height: 630 }

const NEON = '#10B981'

export function renderOgImage(locale: Locale) {
  const { description: tagline } = getDictionary(locale).meta.home
  const heading = getDictionary(locale).meta.ogTagline

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#0A0A0A',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Neon glow, echoing the site's separator treatment */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '1200px',
            height: '4px',
            background: `linear-gradient(90deg, transparent, ${NEON}, transparent)`,
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <img src={logoDataUri()} width={84} height={78} alt="" />
          <div style={{ display: 'flex', fontSize: 68, fontWeight: 700, color: '#FFFFFF' }}>
            bezikee
          </div>
        </div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 40, fontWeight: 600, color: NEON }}>
          {heading}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 32,
            fontSize: 26,
            lineHeight: 1.45,
            color: '#A1A1AA',
            maxWidth: 940,
          }}
        >
          {tagline}
        </div>
      </div>
    ),
    OG_SIZE,
  )
}
