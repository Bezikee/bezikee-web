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
  const lastMouseRef = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  const createParticle = useCallback((x: number, y: number, isMouseParticle = false): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = isMouseParticle ? Math.random() * 3 + 1 : Math.random() * 0.5
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: isMouseParticle ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
      baseSize: isMouseParticle ? Math.random() * 4 + 2 : Math.random() * 3 + 1,
      opacity: isMouseParticle ? 1 : Math.random() * 0.5 + 0.2,
      hue: 150 + Math.random() * 30, // Green hues (150-180)
      life: 0,
      maxLife: isMouseParticle ? 60 + Math.random() * 40 : 9999,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize ambient particles
    const particleCount = 60
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(
        Math.random() * canvas.offsetWidth,
        Math.random() * canvas.offsetHeight
      )
    )

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const newX = e.clientX - rect.left
      const newY = e.clientY - rect.top

      // Check if mouse is actually moving
      const dx = newX - lastMouseRef.current.x
      const dy = newY - lastMouseRef.current.y
      const isMoving = Math.abs(dx) > 1 || Math.abs(dy) > 1

      mouseRef.current = { x: newX, y: newY, isMoving }
      lastMouseRef.current = { x: newX, y: newY }

      // Add trail points
      if (isMoving) {
        trailRef.current.push({
          x: newX,
          y: newY,
          age: 0,
          opacity: 1,
        })

        // Spawn particles on mouse movement
        if (Math.random() > 0.5) {
          particlesRef.current.push(createParticle(newX, newY, true))
        }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, isMoving: false }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      timeRef.current += 0.016

      // Clear with fade effect for trails
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)'
      ctx.fillRect(0, 0, width, height)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const trail = trailRef.current

      // Update and draw cursor trail
      for (let i = trail.length - 1; i >= 0; i--) {
        const point = trail[i]
        point.age++
        point.opacity = Math.max(0, 1 - point.age / 30)

        if (point.opacity <= 0) {
          trail.splice(i, 1)
          continue
        }

        // Draw trail glow
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 20 * point.opacity
        )
        gradient.addColorStop(0, `hsla(160, 100%, 50%, ${point.opacity * 0.8})`)
        gradient.addColorStop(0.5, `hsla(160, 100%, 40%, ${point.opacity * 0.3})`)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(point.x, point.y, 20 * point.opacity, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Draw cursor glow
      if (mouse.x > 0) {
        const pulseSize = Math.sin(timeRef.current * 3) * 10 + 40
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, pulseSize
        )
        gradient.addColorStop(0, 'hsla(160, 100%, 60%, 0.4)')
        gradient.addColorStop(0.3, 'hsla(160, 100%, 50%, 0.2)')
        gradient.addColorStop(0.6, 'hsla(160, 100%, 40%, 0.1)')
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
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

        // Calculate fade for spawned particles
        const lifeFade = particle.maxLife < 9999
          ? 1 - (particle.life / particle.maxLife)
          : 1

        // Mouse attraction/repulsion
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200 && distance > 0) {
          const force = (200 - distance) / 200
          const angle = Math.atan2(dy, dx)

          // Particles orbit around cursor instead of just being pushed
          const orbitForce = force * 0.5
          particle.vx += Math.cos(angle + Math.PI / 2) * orbitForce * 0.1
          particle.vy += Math.sin(angle + Math.PI / 2) * orbitForce * 0.1

          // Slight attraction to keep them near
          particle.vx += Math.cos(angle) * force * 0.02
          particle.vy += Math.sin(angle) * force * 0.02

          // Increase size when near cursor
          particle.size = particle.baseSize * (1 + force * 0.5)
        } else {
          particle.size = particle.baseSize
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Damping
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Wrap around edges (only for ambient particles)
        if (particle.maxLife > 9999) {
          if (particle.x < 0) particle.x = width
          if (particle.x > width) particle.x = 0
          if (particle.y < 0) particle.y = height
          if (particle.y > height) particle.y = 0
        }

        // Draw particle with glow
        const glowSize = particle.size * 3
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, glowSize
        )

        const hue = particle.hue + Math.sin(timeRef.current + i) * 10
        gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, ${particle.opacity * lifeFade})`)
        gradient.addColorStop(0.4, `hsla(${hue}, 100%, 50%, ${particle.opacity * 0.5 * lifeFade})`)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Draw core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${hue}, 100%, 80%, ${particle.opacity * lifeFade})`
        ctx.fill()

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const pdx = particle.x - other.x
          const pdy = particle.y - other.y
          const pDistance = Math.sqrt(pdx * pdx + pdy * pdy)

          if (pDistance < 120) {
            const connectionOpacity = (1 - pDistance / 120) * 0.3 * lifeFade

            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)

            const gradient = ctx.createLinearGradient(
              particle.x, particle.y, other.x, other.y
            )
            gradient.addColorStop(0, `hsla(160, 100%, 50%, ${connectionOpacity})`)
            gradient.addColorStop(1, `hsla(160, 100%, 50%, ${connectionOpacity})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Draw connection to cursor if close
        if (distance < 150) {
          const connectionOpacity = (1 - distance / 150) * 0.4

          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouse.x, mouse.y)

          const gradient = ctx.createLinearGradient(
            particle.x, particle.y, mouse.x, mouse.y
          )
          gradient.addColorStop(0, `hsla(160, 100%, 50%, ${connectionOpacity * 0.5})`)
          gradient.addColorStop(1, `hsla(160, 100%, 70%, ${connectionOpacity})`)

          ctx.strokeStyle = gradient
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      // Maintain particle count
      while (particles.length < 60) {
        particles.push(createParticle(
          Math.random() * width,
          Math.random() * height
        ))
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-auto z-0"
      style={{ background: 'transparent' }}
    />
  )
}
