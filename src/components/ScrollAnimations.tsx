import { useEffect, useRef, useState, ReactNode } from 'react'

type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'blur-in'

interface FadeInProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
  className?: string
}

export function FadeIn({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.2,
  className = ''
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  const getInitialStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      opacity: 0,
      transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms`,
    }

    switch (animation) {
      case 'fade-up':
        return { ...base, transform: 'translateY(40px)' }
      case 'fade-down':
        return { ...base, transform: 'translateY(-40px)' }
      case 'fade-left':
        return { ...base, transform: 'translateX(40px)' }
      case 'fade-right':
        return { ...base, transform: 'translateX(-40px)' }
      case 'zoom-in':
        return { ...base, transform: 'scale(0.9)' }
      case 'blur-in':
        return { ...base, filter: 'blur(10px)' }
      default:
        return base
    }
  }

  const getVisibleStyles = (): React.CSSProperties => ({
    opacity: 1,
    transform: 'translateY(0) translateX(0) scale(1)',
    filter: 'blur(0)',
  })

  return (
    <div
      ref={ref}
      className={className}
      style={isVisible ? getVisibleStyles() : getInitialStyles()}
    >
      {children}
    </div>
  )
}

// Staggered animation for list items
interface StaggeredListProps {
  children: ReactNode[]
  animation?: AnimationType
  staggerDelay?: number
  duration?: number
  className?: string
  itemClassName?: string
}

export function StaggeredList({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  className = '',
  itemClassName = ''
}: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          duration={duration}
          className={itemClassName}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  )
}

// Parallax scroll effect
interface ParallaxProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect()
        const scrolled = window.innerHeight - rect.top
        setOffset(scrolled * speed * 0.1)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

// Animated gradient text
interface GradientTextProps {
  children: string
  className?: string
}

export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r from-neon-green via-emerald-400 to-teal-400 animate-gradient-x ${className}`}
    >
      {children}
    </span>
  )
}

// Text reveal animation (letter by letter)
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <span ref={ref} className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: `${delay + index * 30}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}
