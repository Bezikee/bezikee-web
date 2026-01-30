import { useEffect, useRef, useState, ReactNode } from 'react'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up'
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - windowHeight / 2

      const multiplier = direction === 'up' ? -1 : 1
      setOffset(distanceFromCenter * speed * 0.1 * multiplier)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed, direction])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Floating decorative elements
export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large blurred circle */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-10"
        style={{
          background: 'radial-gradient(circle, #10B981, transparent)',
          top: '10%',
          right: '-10%',
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      {/* Small circles */}
      <div
        className="absolute w-32 h-32 rounded-full opacity-5"
        style={{
          background: 'radial-gradient(circle, #10B981, transparent)',
          bottom: '20%',
          left: '5%',
          animation: 'float 15s ease-in-out infinite reverse'
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}
