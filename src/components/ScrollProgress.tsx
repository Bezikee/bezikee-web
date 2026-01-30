import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-dark-border/30">
      <div
        className="h-full bg-gradient-to-r from-neon-green via-emerald-400 to-teal-400 transition-all duration-75 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.7), 0 0 20px rgba(16, 185, 129, 0.4)'
        }}
      />
    </div>
  )
}
