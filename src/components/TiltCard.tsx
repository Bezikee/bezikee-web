'use client'

import { useRef, useState, ReactNode, useCallback } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltAmount?: number
  glareOpacity?: number
  scale?: number
}

export function TiltCard({
  children,
  className = '',
  tiltAmount = 10,
  glareOpacity = 0.2,
  scale = 1.02
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const touchTimeoutRef = useRef<number | null>(null)

  const calculateTilt = useCallback((clientX: number, clientY: number) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -tiltAmount
    const rotateY = ((x - centerX) / centerX) * tiltAmount

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`)
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    })
  }, [tiltAmount, scale])

  const handleMouseMove = (e: React.MouseEvent) => {
    calculateTilt(e.clientX, e.clientY)
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setTransform('')
  }

  // Touch handlers for mobile bouncy effect
  const handleTouchStart = (e: React.TouchEvent) => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current)
    }

    const touch = e.touches[0]
    setIsTouching(true)
    calculateTilt(touch.clientX, touch.clientY)
  }

  const handleTouchEnd = () => {
    // Keep the tilt briefly, then bounce back
    touchTimeoutRef.current = window.setTimeout(() => {
      setIsTouching(false)
      setTransform('')
    }, 150)
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-xl md:rounded-2xl ${className}`}
      style={{
        transform: transform,
        transition: (isHovering || isTouching) ? 'transform 0.1s ease-out' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}

      {/* Glare effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl md:rounded-2xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(16, 185, 129, ${(isHovering || isTouching) ? glareOpacity : 0}), transparent 50%)`,
          opacity: (isHovering || isTouching) ? 1 : 0
        }}
      />
    </div>
  )
}
