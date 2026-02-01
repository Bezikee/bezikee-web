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

export function TechOrbit() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div
      className="relative w-[280px] h-[280px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer orbit ring */}
      <div className="absolute inset-0 rounded-full border border-dark-border/50 animate-pulse-slow"></div>

      {/* Middle orbit ring */}
      <div className="absolute inset-12 rounded-full border border-dark-border/30"></div>

      {/* Inner orbit ring */}
      <div className="absolute inset-24 rounded-full border border-neon-green/20"></div>

      {/* Center element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-neon-green/20 to-emerald-600/20 border border-neon-green/50 flex items-center justify-center shadow-neon-lg backdrop-blur-sm">
          <div className="text-center">
            <div className="text-neon-green font-bold text-sm md:text-base lg:text-lg">bezikee</div>
            <div className="text-zinc-500 text-[10px] md:text-xs mt-0.5 md:mt-1">tech stack</div>
          </div>
        </div>
      </div>

      {/* Orbiting technologies */}
      <div
        className="absolute inset-0 animate-spin-slow"
        style={{
          animationDuration: '30s',
          animationPlayState: isPaused ? 'paused' : 'running'
        }}
      >
        {technologies.map((tech) => {
          const angle = (tech.angle * Math.PI) / 180

          return (
            <div
              key={tech.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 orbit-item"
              style={{
                // Use CSS custom property for responsive radius
                '--angle': `${tech.angle}deg`,
              } as React.CSSProperties}
            >
              <div
                className={`
                  group relative w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-lg md:rounded-xl bg-dark-card border border-dark-border
                  flex items-center justify-center cursor-pointer
                  transition-all duration-300 hover:scale-125 hover:z-10
                  ${hoveredTech === tech.name ? 'shadow-neon-lg border-neon-green/50 scale-125 z-10' : 'shadow-neon'}
                  animate-counter-spin
                `}
                style={{
                  animationDuration: '30s',
                  animationPlayState: isPaused ? 'paused' : 'running',
                  boxShadow: hoveredTech === tech.name ? `0 0 30px ${tech.color}40` : undefined,
                  transform: `translate(calc(-50% + ${Math.cos(angle) * 110}px), calc(-50% + ${Math.sin(angle) * 110}px))`,
                }}
                onMouseEnter={() => setHoveredTech(tech.name)}
                onMouseLeave={() => setHoveredTech(null)}
              >
                {/* Tech icon placeholder with first letters */}
                <span
                  className="font-bold text-xs md:text-base lg:text-lg transition-all duration-300"
                  style={{ color: tech.color }}
                >
                  {tech.name.slice(0, 2)}
                </span>

                {/* Tooltip - hidden on mobile */}
                <div className={`
                  hidden md:block absolute -bottom-10 left-1/2 -translate-x-1/2
                  px-3 py-1 bg-dark-bg border border-dark-border rounded-lg
                  text-sm font-medium whitespace-nowrap
                  transition-all duration-200
                  ${hoveredTech === tech.name ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                `}>
                  <span style={{ color: tech.color }}>{tech.name}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* CSS for responsive orbit radius */}
      <style>{`
        .orbit-item > div {
          transform: translate(calc(-50% + var(--x, 0)), calc(-50% + var(--y, 0)));
        }
        @media (min-width: 768px) {
          .orbit-item > div {
            transform: translate(calc(-50% + ${technologies.map(t => Math.cos((t.angle * Math.PI) / 180) * 160).join('px), calc(-50% + ')}px));
          }
        }
        @media (min-width: 1024px) {
          .orbit-item > div {
            transform: translate(calc(-50% + ${technologies.map(t => Math.cos((t.angle * Math.PI) / 180) * 200).join('px), calc(-50% + ')}px));
          }
        }
      `}</style>

      {/* Decorative particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-neon-green/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
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
