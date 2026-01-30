import { ReactNode } from 'react'

interface GradientBorderProps {
  children: ReactNode
  className?: string
  borderWidth?: number
  animated?: boolean
}

export function GradientBorder({
  children,
  className = '',
  borderWidth = 1,
  animated = true
}: GradientBorderProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-[${borderWidth}px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        style={{
          background: 'linear-gradient(90deg, #10B981, #34D399, #6EE7B7, #10B981)',
          backgroundSize: '300% 100%',
          animation: animated ? 'gradient-rotate 3s linear infinite' : 'none',
          padding: borderWidth
        }}
      />

      {/* Content container */}
      <div className="relative bg-dark-card rounded-2xl h-full">
        {children}
      </div>

      <style>{`
        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
    </div>
  )
}
