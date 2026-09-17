import { useEffect, useRef } from 'react'

const standards = ['Performance', 'Security', 'Responsive', 'SEO-ready', 'Accessibility', 'Scalability', 'Clean code', 'Support']

// Node ring radius as a fraction of the wheel size
const ORBIT_RADIUS = 0.4
const SATELLITES_PER_NODE = 5
// Gap between a particle and its label, clear of the satellites
const LABEL_OFFSET = 32
// Furthest a satellite can be pulled from its resting spot, in px: it never detaches beyond this
const MAX_STRETCH = 38
// Tether spring: base stiffness, how much stiffer it gets as it stretches, and damping
const SPRING_STIFFNESS = 30
const SPRING_STIFFENING = 6
const SPRING_DAMPING = 5
// Cursor attraction reach and strength
const CURSOR_REACH = 130
const CURSOR_PULL = 2400
// Wheel rotation speed in rad/s (one turn every ~30s), slowing almost to a stop on hover
const ROTATION_SPEED = 0.21
const HOVER_ROTATION_SPEED = 0.02

// Small lights travelling along the rings: ring inset, lap duration, direction and starting angle
const ringTravellers = [
  { inset: 'inset-0', duration: 26, reverse: false, start: 40 },
  { inset: 'inset-0', duration: 26, reverse: false, start: 220 },
  { inset: 'inset-8 md:inset-12', duration: 18, reverse: true, start: 130 },
  { inset: 'inset-16 md:inset-24', duration: 12, reverse: false, start: 300 },
]

interface Satellite {
  angle: number
  radius: number
  speed: number
  size: number
  x: number
  y: number
  vx: number
  vy: number
}

interface OrbitNode {
  baseAngle: number
  x: number
  y: number
  satellites: Satellite[]
}

// Deterministic pseudo-random in [0, 1) so prerendered and hydrated markup match
function seededRandom(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function StandardsOrbit() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!container || !canvas || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let size = 0
    let rotation = 0
    let rotationSpeed = ROTATION_SPEED
    let cursor: { x: number; y: number } | null = null
    let frame: number | undefined
    let lastTime = 0
    let initialised = false

    const nodes: OrbitNode[] = standards.map((_, i) => ({
      baseAngle: (i / standards.length) * Math.PI * 2,
      x: 0,
      y: 0,
      satellites: Array.from({ length: SATELLITES_PER_NODE }, (_, j) => ({
        angle: (j / SATELLITES_PER_NODE) * Math.PI * 2 + seededRandom(i * 7 + j, 1),
        radius: 11 + seededRandom(i * 7 + j, 2) * 9,
        speed: (0.4 + seededRandom(i * 7 + j, 3) * 0.6) * (seededRandom(i * 7 + j, 4) > 0.5 ? 1 : -1),
        size: 0.9 + seededRandom(i * 7 + j, 5) * 0.9,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      })),
    }))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      size = container.clientWidth
      canvas.width = size * dpr
      canvas.height = size * dpr
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const step = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 1 / 30) : 1 / 60
      lastTime = time
      const center = size / 2
      const orbitRadius = size * ORBIT_RADIUS

      // Rotation eases toward its target speed so hovering slows the wheel smoothly
      const targetSpeed = reduceMotion ? 0 : cursor ? HOVER_ROTATION_SPEED : ROTATION_SPEED
      rotationSpeed += (targetSpeed - rotationSpeed) * Math.min(1, dt * 3)
      rotation += rotationSpeed * dt

      ctx.clearRect(0, 0, size, size)

      // Faint links between neighbouring particles (last frame's positions), under everything else
      if (initialised) {
        ctx.beginPath()
        nodes.forEach((node, i) => {
          if (i === 0) ctx.moveTo(node.x, node.y)
          else ctx.lineTo(node.x, node.y)
        })
        ctx.closePath()
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      nodes.forEach((node, i) => {
        const anchorX = center + Math.cos(node.baseAngle + rotation) * orbitRadius
        const anchorY = center + Math.sin(node.baseAngle + rotation) * orbitRadius

        // The big particle leans slightly toward a nearby cursor
        let targetX = anchorX
        let targetY = anchorY
        let nodeHovered = false
        if (cursor) {
          const dx = cursor.x - anchorX
          const dy = cursor.y - anchorY
          const dist = Math.hypot(dx, dy)
          if (dist < 150 && dist > 0) {
            const lean = Math.pow(1 - dist / 150, 2) * 8
            targetX += (dx / dist) * lean
            targetY += (dy / dist) * lean
          }
          nodeHovered = dist < 40
        }
        if (!initialised) {
          node.x = targetX
          node.y = targetY
        } else {
          node.x += (targetX - node.x) * Math.min(1, dt * 10)
          node.y += (targetY - node.y) * Math.min(1, dt * 10)
        }

        node.satellites.forEach((sat) => {
          if (!reduceMotion) sat.angle += sat.speed * dt
          const restX = node.x + Math.cos(sat.angle) * sat.radius
          const restY = node.y + Math.sin(sat.angle) * sat.radius
          if (!initialised) {
            sat.x = restX
            sat.y = restY
          }

          // Spring back toward the resting spot, stiffening as the tether stretches
          const offsetX = sat.x - restX
          const offsetY = sat.y - restY
          const stretchRatio = Math.min(Math.hypot(offsetX, offsetY) / MAX_STRETCH, 1)
          const stiffness = SPRING_STIFFNESS * (1 + stretchRatio * stretchRatio * SPRING_STIFFENING)
          let ax = -stiffness * offsetX - SPRING_DAMPING * sat.vx
          let ay = -stiffness * offsetY - SPRING_DAMPING * sat.vy

          if (cursor) {
            const dx = cursor.x - sat.x
            const dy = cursor.y - sat.y
            const dist = Math.hypot(dx, dy)
            if (dist < CURSOR_REACH && dist > 1) {
              const pull = CURSOR_PULL * Math.pow(1 - dist / CURSOR_REACH, 2)
              ax += (dx / dist) * pull
              ay += (dy / dist) * pull
            }
          }

          sat.vx += ax * dt
          sat.vy += ay * dt
          sat.x += sat.vx * dt
          sat.y += sat.vy * dt

          // Hard limit: never let a satellite break away, and cancel its outward velocity at the limit
          const newOffsetX = sat.x - restX
          const newOffsetY = sat.y - restY
          const stretch = Math.hypot(newOffsetX, newOffsetY)
          if (stretch > MAX_STRETCH) {
            const nx = newOffsetX / stretch
            const ny = newOffsetY / stretch
            sat.x = restX + nx * MAX_STRETCH
            sat.y = restY + ny * MAX_STRETCH
            const outward = sat.vx * nx + sat.vy * ny
            if (outward > 0) {
              sat.vx -= outward * nx
              sat.vy -= outward * ny
            }
          }

          // Tether: brighter and thinner the harder it's pulled
          const tension = Math.min(Math.hypot(sat.x - restX, sat.y - restY) / MAX_STRETCH, 1)
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(sat.x, sat.y)
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.14 + tension * 0.5})`
          ctx.lineWidth = 0.8 - tension * 0.35
          ctx.stroke()

          // Satellite particle
          const glow = ctx.createRadialGradient(sat.x, sat.y, 0, sat.x, sat.y, sat.size * 5)
          glow.addColorStop(0, `rgba(16, 185, 129, ${0.45 + tension * 0.3})`)
          glow.addColorStop(1, 'rgba(16, 185, 129, 0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(sat.x, sat.y, sat.size * 5, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = `rgba(190, 255, 225, ${0.75 + tension * 0.25})`
          ctx.beginPath()
          ctx.arc(sat.x, sat.y, sat.size, 0, Math.PI * 2)
          ctx.fill()
        })

        // Big particle: soft halo and bright core
        const haloRadius = nodeHovered ? 32 : 24
        const halo = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, haloRadius)
        halo.addColorStop(0, `rgba(16, 185, 129, ${nodeHovered ? 0.55 : 0.4})`)
        halo.addColorStop(0.4, 'rgba(16, 185, 129, 0.12)')
        halo.addColorStop(1, 'rgba(16, 185, 129, 0)')
        ctx.fillStyle = halo
        ctx.beginPath()
        ctx.arc(node.x, node.y, haloRadius, 0, Math.PI * 2)
        ctx.fill()

        const coreRadius = nodeHovered ? 7 : 5.5
        const core = ctx.createRadialGradient(node.x - coreRadius * 0.3, node.y - coreRadius * 0.3, 0, node.x, node.y, coreRadius)
        core.addColorStop(0, '#ffffff')
        core.addColorStop(1, 'rgba(110, 231, 183, 1)')
        ctx.fillStyle = core
        ctx.beginPath()
        ctx.arc(node.x, node.y, coreRadius, 0, Math.PI * 2)
        ctx.fill()

        const label = labelRefs.current[i]
        if (label) {
          // Labels are prerendered with percentage positions; on the first frame they switch to following the node in px
          if (!initialised) {
            label.style.left = '0'
            label.style.top = '0'
          }
          label.style.transform = `translate3d(${node.x}px, ${node.y + LABEL_OFFSET}px, 0) translateX(-50%)`
          label.style.color = nodeHovered ? '#ffffff' : ''
        }
      })

      initialised = true
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      if (frame === undefined) frame = requestAnimationFrame(step)
    }
    const stop = () => {
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      lastTime = 0
    }

    // Only animate while the wheel is on screen
    const visibilityObserver = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibilityObserver.observe(container)

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const handlePointerLeave = () => {
      cursor = null
    }
    container.addEventListener('pointermove', handlePointerMove)
    container.addEventListener('pointerleave', handlePointerLeave)
    container.addEventListener('pointercancel', handlePointerLeave)

    return () => {
      stop()
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      container.removeEventListener('pointermove', handlePointerMove)
      container.removeEventListener('pointerleave', handlePointerLeave)
      container.removeEventListener('pointercancel', handlePointerLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] touch-pan-y"
    >
      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-dark-border/50 animate-pulse-slow"></div>

      {/* Middle orbit ring */}
      <div className="absolute inset-8 md:inset-12 rounded-full border border-dark-border/30"></div>

      {/* Inner orbit ring */}
      <div className="absolute inset-16 md:inset-24 rounded-full border border-neon-green/20"></div>

      {/* Lights travelling along the rings */}
      {ringTravellers.map((traveller, i) => (
        <div
          key={i}
          className={`absolute ${traveller.inset} pointer-events-none`}
          style={{ transform: `rotate(${traveller.start}deg)` }}
        >
          <div
            className="absolute inset-0 motion-reduce:[animation:none]"
            style={{ animation: `spin ${traveller.duration}s linear infinite${traveller.reverse ? ' reverse' : ''}` }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-200 shadow-[0_0_6px_2px_rgba(16,185,129,0.7)]" />
          </div>
        </div>
      ))}

      {/* Particles, satellites and tethers */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* Center element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-600/20 border border-neon-green/50 flex items-center justify-center shadow-neon-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="text-neon-green font-bold text-sm md:text-base lg:text-lg">bezikee</div>
            <div className="text-zinc-500 text-[10px] md:text-xs mt-0.5 md:mt-1">every project</div>
          </div>
        </div>
      </div>

      {/* Labels follow their particle (positioned by the animation loop once it starts) */}
      {standards.map((standard, i) => {
        const angle = (i / standards.length) * Math.PI * 2
        return (
          <span
            key={standard}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="absolute pointer-events-none whitespace-nowrap font-mono text-[9px] md:text-[11px] lg:text-xs text-zinc-500 transition-colors duration-300"
            style={{
              left: `${50 + Math.cos(angle) * ORBIT_RADIUS * 100}%`,
              top: `calc(${50 + Math.sin(angle) * ORBIT_RADIUS * 100}% + ${LABEL_OFFSET}px)`,
              transform: 'translateX(-50%)',
            }}
          >
            {standard}
          </span>
        )
      })}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export function StandardsSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-semibold text-neon-green tracking-widest">OUR APPROACH</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-4 md:mb-6">
              Any Stack. Same Standards.
            </h2>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-6 md:mb-8">
              We're not tied to one framework or platform. We choose the technologies that fit your
              project, your team and your budget, and hold every build to the same standards.
            </p>

            <div className="space-y-3 md:space-y-4">
              {[
                { label: 'Right fit', text: 'Tools chosen for your goals, not our habits' },
                { label: 'Fast', text: 'Quick to load and smooth to use on any device' },
                { label: 'Secure', text: 'Best practices built in from the first commit' },
                { label: 'Maintainable', text: 'Clean, documented code any developer can pick up' },
              ].map((item) => (
                <div key={item.label} className="flex items-start md:items-center gap-3 md:gap-4">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2 md:mt-0 flex-shrink-0"></div>
                  <span className="text-white font-medium w-24 md:w-28 flex-shrink-0 text-sm md:text-base">{item.label}</span>
                  <span className="text-zinc-500 text-sm md:text-base">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <StandardsOrbit />
          </div>
        </div>
      </div>
    </section>
  )
}
