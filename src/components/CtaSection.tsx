import { ReactNode, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FadeIn } from './ScrollAnimations'
import { MagneticButton } from './MagneticButton'

interface CtaAction {
  label: string
  to: string
}

interface CtaSectionProps {
  title: ReactNode
  description: string
  primary: CtaAction
  secondary?: CtaAction
}

// Distance of the glow's resting centre from the top of the panel, in px
const GLOW_REST_TOP = 32

// Closing call-to-action: a dark glass panel with a neon gradient border instead of a solid green band
export function CtaSection({ title, description, primary, secondary }: CtaSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  // Offsets from the resting spot (top centre). The trail lags behind the main cloud,
  // so the glow stretches out while moving and gathers back together when it stops.
  const glowOffset = useRef({ x: 0, y: 0 })
  const trailOffset = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const frame = useRef<number | null>(null)
  const lastTime = useRef(0)

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current)
  }, [])

  // Ease toward the target every frame and move the layers with GPU transforms, so they glide smoothly
  const tick = (time: number) => {
    const elapsed = lastTime.current ? Math.min(time - lastTime.current, 64) : 16.7
    lastTime.current = time
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const layers = [
      // Share of the remaining distance kept per 60fps frame: the main cloud covers ~10%, the trail ~5%
      { el: glowRef.current, offset: glowOffset.current, keep: 0.9 },
      { el: trailRef.current, offset: trailOffset.current, keep: 0.95 },
    ]
    let moving = false
    for (const { el, offset, keep } of layers) {
      const ease = reduceMotion ? 1 : 1 - Math.pow(keep, elapsed / 16.7)
      offset.x += (target.current.x - offset.x) * ease
      offset.y += (target.current.y - offset.y) * ease
      if (el) {
        // Plain pixels (half the layer's size re-centres it), matching the initial translate(-50%, -50%)
        el.style.transform = `translate3d(${offset.x - el.offsetWidth / 2}px, ${offset.y - el.offsetHeight / 2}px, 0)`
      }
      if (Math.abs(target.current.x - offset.x) > 0.1 || Math.abs(target.current.y - offset.y) > 0.1) moving = true
    }

    if (moving) {
      frame.current = requestAnimationFrame(tick)
    } else {
      frame.current = null
      lastTime.current = 0
    }
  }

  const moveGlowTo = (x: number, y: number) => {
    target.current = { x, y }
    if (frame.current === null) frame.current = requestAnimationFrame(tick)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    moveGlowTo(e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - GLOW_REST_TOP)
  }

  // Drift back to the resting spot behind the heading
  const handleMouseLeave = () => moveGlowTo(0, 0)

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 lg:px-20">
      <FadeIn animation="zoom-in">
        <div className="relative max-w-4xl mx-auto rounded-2xl md:rounded-3xl p-px bg-gradient-to-br from-neon-green/60 via-dark-border to-teal-400/40 shadow-neon">
          <div
            ref={panelRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-[#0c0f0e] px-6 py-12 md:px-16 md:py-16"
          >
            {/* Faint grid texture fading out from the centre */}
            <div
              className="absolute inset-0 opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(16,185,129,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.35) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            {/* Cloud glow: rests behind the heading and follows the cursor on hover. Soft drifting
                blobs under a wispy noise mask give it texture; see .cta-cloud in index.css. */}
            <div
              ref={trailRef}
              className="absolute left-1/2 w-[460px] md:w-[620px] h-[320px] pointer-events-none will-change-transform"
              style={{ top: GLOW_REST_TOP, transform: 'translate3d(-50%, -50%, 0)' }}
            >
              <div className="cta-cloud">
                <div className="cta-cloud__blob cta-cloud__blob--trail" />
              </div>
            </div>
            <div
              ref={glowRef}
              className="absolute left-1/2 w-[560px] md:w-[760px] h-[380px] pointer-events-none will-change-transform"
              style={{ top: GLOW_REST_TOP, transform: 'translate3d(-50%, -50%, 0)' }}
            >
              <div className="cta-cloud">
                <div className="cta-cloud__blob cta-cloud__blob--a" />
                <div className="cta-cloud__blob cta-cloud__blob--b" />
                <div className="cta-cloud__blob cta-cloud__blob--c" />
              </div>
            </div>

            <div className="relative flex flex-col items-center gap-4 md:gap-6 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{title}</h2>
              <p className="max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed">{description}</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2 md:mt-4 w-full sm:w-auto">
                <MagneticButton as="div" strength={0.1}>
                  <Link
                    to={primary.to}
                    className="group px-6 md:px-8 py-3 md:py-4 bg-neon-green text-white font-semibold rounded-lg shadow-neon-btn hover:shadow-neon-btn-hover transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {primary.label}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </MagneticButton>
                {secondary && (
                  <MagneticButton as="div" strength={0.15}>
                    <Link
                      to={secondary.to}
                      className="px-6 md:px-8 py-3 md:py-4 border border-dark-border text-white font-medium rounded-lg hover:border-neon-green hover:shadow-neon transition-all duration-300 flex items-center justify-center"
                    >
                      {secondary.label}
                    </Link>
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  )
}
