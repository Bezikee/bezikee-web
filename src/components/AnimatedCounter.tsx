import { useState, useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  label: string
  decimals?: number
}

export function AnimatedCounter({
  end,
  duration = 2000,
  suffix = '',
  prefix = '',
  label,
  decimals = 0
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutExpo = 1 - Math.pow(2, -10 * progress)
      const currentCount = easeOutExpo * end

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, end, duration])

  const displayValue = decimals > 0 ? count.toFixed(decimals) : Math.floor(count)

  return (
    <div
      ref={ref}
      className="group p-8 bg-dark-card border border-dark-border rounded-2xl shadow-neon hover:shadow-neon-lg hover:border-neon-green/50 transition-all duration-500 text-center relative overflow-hidden"
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-5xl font-bold text-neon-green mb-2 tabular-nums group-hover:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)] transition-all duration-500">
          {prefix}
          {displayValue}
          {suffix}
        </div>
        <div className="text-zinc-400 font-medium">{label}</div>
      </div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-neon-green via-emerald-400 to-teal-400 rounded-2xl animate-spin-slow opacity-20"></div>
      </div>
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 px-20 bg-dark-section relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)]"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold text-neon-green tracking-widest">BY THE NUMBERS</span>
          <h2 className="text-4xl font-bold text-white mt-4">Results That Speak Volumes</h2>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            We don't just build websites—we build success stories. Here's the proof.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <AnimatedCounter
            end={50}
            suffix="+"
            label="Projects Delivered"
            duration={2000}
          />
          <AnimatedCounter
            end={98}
            suffix="%"
            label="Client Satisfaction"
            duration={2200}
          />
          <AnimatedCounter
            end={12}
            label="Countries Served"
            duration={1800}
          />
          <AnimatedCounter
            end={2.5}
            suffix="M+"
            prefix="€"
            label="Client Revenue Generated"
            duration={2500}
            decimals={1}
          />
        </div>
      </div>
    </section>
  )
}
