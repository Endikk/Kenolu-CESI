import { useEffect, useState } from 'react'

/**
 * Returns an object with .current holding the current page scroll progress (0→1)
 * and triggers a rerender on change. Uses passive scroll listener + rAF.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const handler = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const p = max > 0 ? window.scrollY / max : 0
        setProgress(p)
        raf = 0
      })
    }
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return progress
}

/**
 * Observe an element and return whether it's in view.
 * Intersection threshold defaults to 0.2.
 */
export function useInView(ref, threshold = 0.2) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])

  return inView
}
