import { useEffect, useRef, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  life: number
  maxLife: number
}

interface NeonParticlesProps {
  // Fill the parent element and react only to the cursor inside it, instead of covering the viewport
  contained?: boolean
}

export function NeonParticles({ contained = false }: NeonParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const targetMouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  const createParticle = useCallback((x: number, y: number, fromMouse = false): Particle => {
    const angle = Math.random() * Math.PI * 2
    const speed = fromMouse ? Math.random() * 1 + 0.3 : Math.random() * 0.2
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: fromMouse ? Math.random() * 2.5 + 1.5 : Math.random() * 2 + 1,
      opacity: fromMouse ? 0.9 : Math.random() * 0.4 + 0.15,
      life: 0,
      maxLife: fromMouse ? 100 + Math.random() * 50 : 99999,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const container = contained ? canvas.parentElement : null
    const size = () => container
      ? { width: container.clientWidth, height: container.clientHeight }
      : { width: window.innerWidth, height: window.innerHeight }

    // Check if on mobile for performance optimization
    const isMobile = window.innerWidth < 768
    const particleCount = contained ? (isMobile ? 10 : 18) : (isMobile ? 20 : 35)
    const maxParticles = contained ? (isMobile ? 18 : 32) : (isMobile ? 35 : 60)

    const resizeCanvas = () => {
      // Cap DPR for mobile performance
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
      const { width, height } = size()
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    const resizeObserver = container ? new ResizeObserver(resizeCanvas) : null
    if (container) resizeObserver?.observe(container)

    // Initialize particles - fewer on mobile for performance
    const initial = size()
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(
        Math.random() * initial.width,
        Math.random() * initial.height
      )
    )

    let lastSpawnTime = 0
    const eventTarget: HTMLElement | Window = container ?? window

    const handleMouseMove = (e: Event) => {
      const { clientX, clientY } = e as MouseEvent
      const rect = container?.getBoundingClientRect()
      const x = rect ? clientX - rect.left : clientX
      const y = rect ? clientY - rect.top : clientY
      // Entering a container: start at the cursor instead of sweeping in from off-canvas
      if (mouseRef.current.x < 0) mouseRef.current = { x, y }
      targetMouseRef.current = { x, y }

      // Spawn particles occasionally on movement
      const now = Date.now()
      if (now - lastSpawnTime > 80 && particlesRef.current.length < maxParticles) {
        particlesRef.current.push(createParticle(x, y, true))
        lastSpawnTime = now
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
      targetMouseRef.current = { x: -1000, y: -1000 }
    }

    eventTarget.addEventListener('mousemove', handleMouseMove)
    if (container) container.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      const { width, height } = size()
      timeRef.current += 0.01

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Smooth mouse following
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.15
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.15

      const mouse = mouseRef.current
      const particles = particlesRef.current

      // Draw subtle cursor glow
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, 80
        )
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)')
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)')
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++

        // Remove dead particles
        if (p.life > p.maxLife) {
          particles.splice(i, 1)
          continue
        }

        // Fade calculation
        const fadeIn = Math.min(p.life / 20, 1)
        const fadeOut = p.maxLife < 99999 ? Math.pow(1 - p.life / p.maxLife, 0.5) : 1
        const fade = fadeIn * fadeOut

        // Cursor attraction with smooth easing
        if (mouse.x > 0) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 250 && dist > 0) {
            const force = Math.pow((250 - dist) / 250, 2) * 0.08
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // Update position with smooth physics
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98
        p.vy *= 0.98

        // Gentle drift
        p.vx += Math.sin(timeRef.current + i) * 0.003
        p.vy += Math.cos(timeRef.current + i * 0.5) * 0.003

        // Wrap edges
        if (p.maxLife >= 99999) {
          if (p.x < -20) p.x = width + 20
          if (p.x > width + 20) p.x = -20
          if (p.y < -20) p.y = height + 20
          if (p.y > height + 20) p.y = -20
        }

        // Draw particle with soft glow
        const glowSize = p.size * 10
        const particleGradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowSize
        )

        const alpha = p.opacity * fade
        particleGradient.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.9})`)
        particleGradient.addColorStop(0.2, `rgba(16, 185, 129, ${alpha * 0.4})`)
        particleGradient.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.15})`)
        particleGradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2)
        ctx.fillStyle = particleGradient
        ctx.fill()

        // Draw core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 255, 220, ${alpha})`
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            const fade2 = p2.maxLife < 99999 ? Math.pow(1 - p2.life / p2.maxLife, 0.5) : 1
            const lineAlpha = (1 - dist / 120) * 0.15 * fade * fade2

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Draw connection to cursor
        if (mouse.x > 0) {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.2 * fade

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouse.x, mouse.y)
            ctx.strokeStyle = `rgba(16, 185, 129, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Maintain base particle count
      while (particles.length < particleCount) {
        particles.push(createParticle(
          Math.random() * width,
          Math.random() * height
        ))
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // A contained field only animates while it's on screen
    const stop = () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      animationRef.current = undefined
    }
    const visibilityObserver = container
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting && !animationRef.current) animate()
          else if (!entry.isIntersecting) stop()
        })
      : null
    if (container) visibilityObserver?.observe(container)
    else animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      eventTarget.removeEventListener('mousemove', handleMouseMove)
      container?.removeEventListener('mouseleave', handleMouseLeave)
      resizeObserver?.disconnect()
      visibilityObserver?.disconnect()
      stop()
    }
  }, [createParticle, contained])

  return (
    <canvas
      ref={canvasRef}
      className={`${contained ? 'absolute' : 'fixed'} inset-0 pointer-events-none`}
      style={contained ? undefined : { zIndex: 1 }}
    />
  )
}
