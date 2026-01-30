import { useEffect, useState, useRef } from 'react'

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

export function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true)
          hasAnimated.current = true
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) {
      setDisplayText(text.replace(/[^\s]/g, ' '))
      return
    }

    let iteration = 0
    const totalIterations = text.length * 3

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(
          text
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '

              const revealIndex = iteration / 3
              if (index < revealIndex) {
                return text[index]
              }

              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )

        iteration++

        if (iteration >= totalIterations) {
          clearInterval(interval)
          setDisplayText(text)
        }
      }, speed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [isVisible, text, delay, speed])

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText}
    </span>
  )
}
