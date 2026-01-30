import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  baseSize: number
  opacity: number
  hue: number
  life: number
  maxLife: number
  targetX?: number
  targetY?: number
}

interface TrailPoint {
  x: number
  y: number
  age: number
  opacity: number
}

export function NeonParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const trailRef = useRef<TrailPoint[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000, isMoving: false })
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 })
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  const createParticle = useCallback((x: number, y: number, isMouseParticle = false): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = isMouseParticle ? Math.random() * 2 + 0.5 : Math.random() * 0.3
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: isMouseParticle ? Math.random() * 5 + 3 : Math.random() * 3 + 1,
      baseSize: isMouseParticle ? Math.random() * 5 + 3 : Math.random() * 3 + 1,
      opacity: isMouseParticle ? 1 : Math.random() * 0.6 + 0.2,
      hue: 150 + Math.random() * 30,
      life: 0,
      maxLife: isMouseParticle ? 80 + Math.random() * 60 : 9999,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize ambient particles
    const particleCount = 50
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      )
    )

    // Global mouse tracking - works even when hovering over other elements
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const newX = e.clientX
      const newY = e.clientY

      const dx = newX - lastMouseRef.current.x
      const dy = newY - lastMouseRef.current.y
      const timeDiff = now - lastMouseRef.current.time
      const speed = Math.sqrt(dx * dx + dy * dy) / Math.max(timeDiff, 1)

      mouseRef.current = { x: newX, y: newY, isMoving: speed > 0.1 }

      // Add trail points based on movement
      if (speed > 0.1) {
        trailRef.current.push({
          x: newX,
          y: newY,
          age: 0,
          opacity: Math.min(speed * 0.5, 1),
        })

        // Spawn particles based on speed
        if (Math.random() < Math.min(speed * 0.3, 0.8)) {
          particlesRef.current.push(createParticle(newX, newY, true))
        }
      }

      lastMouseRef.current = { x: newX, y: newY, time: now }
    }

    // Listen on window for global mouse tracking
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      timeRef.current += 0.016

      // Clear with fade effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.12)'
      ctx.fillRect(0, 0, width, height)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const trail = trailRef.current

      // Draw and update cursor trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i]
        point.age++
        point.opacity = Math.max(0, 1 - point.age / 25)

        if (point.opacity <= 0) {
          trail.splice(i, 1)
          continue
        }

        // Trail glow
        const trailGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 25 * point.opacity
        )
        trailGradient.addColorStop(0, `hsla(160, 100%, 55%, ${point.opacity * 0.9})`)
        trailGradient.addColorStop(0.4, `hsla(160, 100%, 45%, ${point.opacity * 0.4})`)
        trailGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(point.x, point.y, 25 * point.opacity, 0, Math.PI * 2)
        ctx.fillStyle = trailGradient
        ctx.fill()
      }

      // Draw main cursor glow
      if (mouse.x > 0 && mouse.y > 0) {
        const pulseSize = Math.sin(timeRef.current * 4) * 15 + 50
        const cursorGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, pulseSize
        )
        cursorGradient.addColorStop(0, 'hsla(160, 100%, 65%, 0.5)')
        cursorGradient.addColorStop(0.3, 'hsla(160, 100%, 55%, 0.25)')
        cursorGradient.addColorStop(0.6, 'hsla(160, 100%, 45%, 0.1)')
        cursorGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = cursorGradient
        ctx.fill()

        // Inner bright core
        const coreGradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 8
        )
        coreGradient.addColorStop(0, 'hsla(160, 100%, 80%, 0.8)')
        coreGradient.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = coreGradient
        ctx.fill()
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i]
        particle.life++

        // Remove dead particles
        if (particle.life > particle.maxLife) {
          particles.splice(i, 1)
          continue
        }

        const lifeFade = particle.maxLife < 9999
          ? Math.pow(1 - (particle.life / particle.maxLife), 0.5)
          : 1

        // Strong cursor attraction - particles FOLLOW the cursor
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0 && mouse.x > 0) {
          const maxAttractDistance = 300

          if (distance < maxAttractDistance) {
            // Attraction force - stronger when closer
            const force = Math.pow((maxAttractDistance - distance) / maxAttractDistance, 1.5)
            const attractionStrength = 0.15 * force

            // Move toward cursor
            particle.vx += (dx / distance) * attractionStrength
            particle.vy += (dy / distance) * attractionStrength

            // Add slight orbit effect
            const orbitStrength = 0.03 * force
            particle.vx += (dy / distance) * orbitStrength
            particle.vy += (-dx / distance) * orbitStrength

            // Grow when near cursor
            particle.size = particle.baseSize * (1 + force * 1.5)
            particle.opacity = Math.min(1, particle.opacity + force * 0.02)
          } else {
            particle.size = particle.baseSize
          }
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping - less damping for more flowing movement
        particle.vx *= 0.96
        particle.vy *= 0.96

        // Add slight random movement
        particle.vx += (Math.random() - 0.5) * 0.1
        particle.vy += (Math.random() - 0.5) * 0.1

        // Wrap around edges for ambient particles
        if (particle.maxLife > 9999) {
          if (particle.x < -50) particle.x = width + 50
          if (particle.x > width + 50) particle.x = -50
          if (particle.y < -50) particle.y = height + 50
          if (particle.y > height + 50) particle.y = -50
        }

        // Draw particle glow
        const glowSize = particle.size * 4
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        )

        const hue = particle.hue + Math.sin(timeRef.current * 2 + i * 0.5) * 15
        particleGradient.addColorStop(0, `hsla(${hue}, 100%, 65%, ${particle.opacity * lifeFade})`)
        particleGradient.addColorStop(0.3, `hsla(${hue}, 100%, 55%, ${particle.opacity * 0.5 * lifeFade})`)
        particleGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = particleGradient
        ctx.fill()

        // Bright core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 100%, 85%, ${particle.opacity * lifeFade})`
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const pdx = particle.x - other.x
          const pdy = particle.y - other.y
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy)

          if (pDistance < 100) {
            const lineOpacity = (1 - pDistance / 100) * 0.4 * lifeFade

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `hsla(160, 100%, 55%, ${lineOpacity})`
            ctx.lineWidth = 1.5
            ctx.stroke()
          }
        }

        // Draw connection to cursor
        if (distance < 200 && mouse.x > 0) {
          const lineOpacity = (1 - distance / 200) * 0.6 * lifeFade

          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouse.x, mouse.y)

          const lineGradient = ctx.createLinearGradient(
            particle.x, particle.y, mouse.x, mouse.y
          )
          lineGradient.addColorStop(0, `hsla(160, 100%, 55%, ${lineOpacity * 0.5})`)
          lineGradient.addColorStop(1, `hsla(160, 100%, 70%, ${lineOpacity})`)

          ctx.strokeStyle = lineGradient
          ctx.lineWidth = 2
          ctx.stroke()
        }
      }

      // Maintain particle count
      while (particles.length < 50) {
        particles.push(createParticle(
          Math.random() * width,
          Math.random() * height
        ))
      }

      // Limit max particles
      if (particles.length > 120) {
        particles.splice(50, particles.length - 120)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ background: 'transparent', zIndex: 0 }}
    />
  )
}
