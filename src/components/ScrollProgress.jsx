import { useEffect, useRef } from 'react'

/** Thin LED progress bar that tracks total page scroll. */
export default function ScrollProgress() {
  const barRef = useRef(null)
  const dotRef = useRef(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`
      if (dotRef.current) dotRef.current.style.left = `${p * 100}%`
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="scroll-progress" aria-hidden>
      <div ref={barRef} className="scroll-progress__bar" />
      <div ref={dotRef} className="scroll-progress__dot" style={{ left: '0%' }} />
    </div>
  )
}
