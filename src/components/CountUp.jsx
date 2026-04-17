import { useEffect, useRef, useState } from 'react'

/**
 * Counts up from 0 to `to` when scrolled into view.
 * Handles integers, decimals (comma), and suffixes.
 */
export default function CountUp({ to, decimals = 0, duration = 1600, suffix = '', prefix = '' }) {
  const [value, setValue] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true) },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    const target = Number(to)
    if (Number.isNaN(target)) return
    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, to, duration])

  const formatted = decimals > 0
    ? value.toFixed(decimals).replace('.', ',')
    : Math.round(value).toLocaleString('fr-FR').replace(/\s/g, '\u202f')

  return (
    <span ref={ref} className="count-up">{prefix}{formatted}{suffix}</span>
  )
}
