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

export function NeonParticles() {
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
      size: fromMouse ? Math.random() * 2 + 1 : Math.random() * 1.5 + 0.5,
      opacity: fromMouse ? 0.8 : Math.random() * 0.3 + 0.1,
      life: 0,
      maxLife: fromMouse ? 100 + Math.random() * 50 : 99999,
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
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

    // Initialize particles - fewer for cleaner look
    particlesRef.current = Array.from({ length: 35 }, () =>
      createParticle(
        Math.random() * window.innerWidth,
        Math.random() * window.innerHeight
      )
    )

    let lastSpawnTime = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current = { x: e.clientX, y: e.clientY }

      // Spawn particles occasionally on movement
      const now = Date.now()
      if (now - lastSpawnTime > 80 && particlesRef.current.length < 60) {
        particlesRef.current.push(createParticle(e.clientX, e.clientY, true))
        lastSpawnTime = now
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      const width = window.innerWidth
      const height = window.innerHeight
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
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)')
        gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.05)')
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
        if (p.maxLife > 99999) {
          if (p.x < -20) p.x = width + 20
          if (p.x > width + 20) p.x = -20
          if (p.y < -20) p.y = height + 20
          if (p.y > height + 20) p.y = -20
        }

        // Draw particle with soft glow
        const glowSize = p.size * 8
        const particleGradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, glowSize
        )

        const alpha = p.opacity * fade
        particleGradient.addColorStop(0, `rgba(16, 185, 129, ${alpha * 0.8})`)
        particleGradient.addColorStop(0.2, `rgba(16, 185, 129, ${alpha * 0.3})`)
        particleGradient.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.1})`)
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
      while (particles.length < 35) {
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
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [createParticle])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
