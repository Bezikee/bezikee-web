import { useState } from 'react'

const technologies = [
  { name: 'React', color: '#61DAFB', angle: 0 },
  { name: 'TypeScript', color: '#3178C6', angle: 45 },
  { name: 'Node.js', color: '#339933', angle: 90 },
  { name: 'Next.js', color: '#FFFFFF', angle: 135 },
  { name: 'Tailwind', color: '#06B6D4', angle: 180 },
  { name: 'PostgreSQL', color: '#4169E1', angle: 225 },
  { name: 'AWS', color: '#FF9900', angle: 270 },
  { name: 'Docker', color: '#2496ED', angle: 315 },
]

// Node positions as a percentage of the container, on a circle of radius 40%
const ORBIT_RADIUS = 40
const nodes = technologies.map((tech) => {
  const angleRad = (tech.angle * Math.PI) / 180
  return { ...tech, x: 50 + Math.cos(angleRad) * ORBIT_RADIUS, y: 50 + Math.sin(angleRad) * ORBIT_RADIUS }
})

// Small lights travelling along the rings: ring inset, lap duration, direction and starting angle
const ringTravellers = [
  { inset: 'inset-0', duration: 26, reverse: false, start: 40 },
  { inset: 'inset-0', duration: 26, reverse: false, start: 220 },
  { inset: 'inset-8 md:inset-12', duration: 18, reverse: true, start: 130 },
  { inset: 'inset-16 md:inset-24', duration: 12, reverse: false, start: 300 },
]

// Deterministic pseudo-random in [0, 1) so prerendered and hydrated markup match
function seededRandom(index: number, salt: number) {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function TechOrbit() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const playState = isPaused ? 'paused' : 'running'

  return (
    <div
      className="relative w-[250px] h-[250px] sm:w-[280px] sm:h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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
            className="absolute inset-0"
            style={{
              animation: `spin ${traveller.duration}s linear infinite${traveller.reverse ? ' reverse' : ''}`,
              animationPlayState: playState,
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-emerald-200 shadow-[0_0_6px_2px_rgba(16,185,129,0.7)]" />
          </div>
        </div>
      ))}

      {/* Center element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-600/20 border border-neon-green/50 flex items-center justify-center shadow-neon-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="text-neon-green font-bold text-sm md:text-base lg:text-lg">bezikee</div>
            <div className="text-zinc-500 text-[10px] md:text-xs mt-0.5 md:mt-1">tech stack</div>
          </div>
        </div>
      </div>

      {/* Orbiting technologies: a constellation of glowing particles */}
      <div
        className="absolute inset-0"
        style={{
          animation: 'spin 30s linear infinite',
          animationPlayState: playState,
        }}
      >
        {/* Faint links from the core and between neighbouring particles, like the background network */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" aria-hidden="true">
          <defs>
            <radialGradient id="tech-orbit-link" cx="50" cy="50" r="42" gradientUnits="userSpaceOnUse">
              <stop offset="0.35" stopColor="rgb(16,185,129)" stopOpacity="0" />
              <stop offset="1" stopColor="rgb(16,185,129)" stopOpacity="0.35" />
            </radialGradient>
          </defs>
          {nodes.map((node) => (
            <line
              key={node.name}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              stroke="url(#tech-orbit-link)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <polygon
            points={nodes.map((node) => `${node.x},${node.y}`).join(' ')}
            fill="none"
            stroke="rgba(16,185,129,0.12)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {nodes.map((node, i) => {
          const isHovered = hoveredTech === node.name

          return (
            <div
              key={node.name}
              className="absolute"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Counter-rotate so the label stays upright while the orbit turns */}
              <div
                className="relative w-10 h-10 md:w-14 md:h-14 flex items-center justify-center cursor-pointer"
                style={{
                  animation: 'counter-spin 30s linear infinite',
                  animationPlayState: playState,
                }}
                onMouseEnter={() => setHoveredTech(node.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                {/* Halo */}
                <div
                  className="absolute inset-0 rounded-full animate-pulse-slow transition-transform duration-300"
                  style={{
                    background: `radial-gradient(circle, ${node.color}${isHovered ? '66' : '38'} 0%, ${node.color}14 40%, transparent 70%)`,
                    transform: `scale(${isHovered ? 1.5 : 1})`,
                    animationDelay: `${-i * 0.5}s`,
                  }}
                />
                {/* Core */}
                <div
                  className="relative rounded-full transition-transform duration-300 w-2 h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, #ffffff, ${node.color} 60%)`,
                    boxShadow: `0 0 6px 1px ${node.color}, 0 0 16px 3px ${node.color}66`,
                    transform: `scale(${isHovered ? 1.6 : 1})`,
                  }}
                />
                {/* Label */}
                <span
                  className={`absolute top-full -mt-1 md:mt-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] md:text-[11px] lg:text-xs transition-colors duration-300 ${isHovered ? 'text-white' : 'text-zinc-500'}`}
                >
                  {node.name}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Keyframes for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
      `}</style>

      {/* Decorative particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-neon-green/30 rounded-full animate-float"
          style={{
            left: `${seededRandom(i, 1) * 100}%`,
            top: `${seededRandom(i, 2) * 100}%`,
            animationDelay: `${seededRandom(i, 3) * 5}s`,
            animationDuration: `${3 + seededRandom(i, 4) * 4}s`,
          }}
        />
      ))}
    </div>
  )
}

export function TechStackSection() {
  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 md:px-12 lg:px-20 bg-dark-bg relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-xs font-semibold text-neon-green tracking-widest">TECHNOLOGY</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-4 mb-4 md:mb-6">
              Cutting-Edge Tech Stack
            </h2>
            <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-6 md:mb-8">
              We leverage the latest and most powerful technologies to build fast, scalable,
              and maintainable applications. Our expertise spans the entire modern web ecosystem.
            </p>

            <div className="space-y-3 md:space-y-4">
              {[
                { label: 'Frontend', techs: 'React, Next.js, Vue, TypeScript' },
                { label: 'Backend', techs: 'Node.js, Python, Go, PostgreSQL' },
                { label: 'Cloud', techs: 'AWS, Vercel, Docker, Kubernetes' },
                { label: 'Mobile', techs: 'React Native, Flutter, Swift' },
              ].map((item) => (
                <div key={item.label} className="flex items-start md:items-center gap-3 md:gap-4">
                  <div className="w-2 h-2 bg-neon-green rounded-full mt-2 md:mt-0 flex-shrink-0"></div>
                  <span className="text-white font-medium w-20 md:w-24 text-sm md:text-base">{item.label}</span>
                  <span className="text-zinc-500 text-sm md:text-base">{item.techs}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <TechOrbit />
          </div>
        </div>
      </div>
    </section>
  )
}
