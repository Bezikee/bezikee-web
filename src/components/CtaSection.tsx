import { ReactNode, useRef } from 'react'
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

// Closing call-to-action: a dark glass panel with a neon gradient border instead of a solid green band
export function CtaSection({ title, description, primary, secondary }: CtaSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Move the glow with the cursor via CSS variables, so hovering doesn't re-render the section
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const panel = panelRef.current
    if (!panel) return
    const rect = panel.getBoundingClientRect()
    panel.style.setProperty('--glow-x', `${e.clientX - rect.left}px`)
    panel.style.setProperty('--glow-y', `${e.clientY - rect.top}px`)
  }

  // Clearing the variables lets the glow drift back to its resting spot at the top centre
  const handleMouseLeave = () => {
    panelRef.current?.style.removeProperty('--glow-x')
    panelRef.current?.style.removeProperty('--glow-y')
  }

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
            {/* Soft glow: rests behind the heading and follows the cursor on hover */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[420px] md:w-[640px] h-64 bg-neon-green/20 rounded-full blur-3xl pointer-events-none transition-[left,top] duration-500 ease-out motion-reduce:transition-none"
              style={{ left: 'var(--glow-x, 50%)', top: 'var(--glow-y, 32px)' }}
            />

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
